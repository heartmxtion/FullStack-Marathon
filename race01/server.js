import express from 'express';
import session from 'express-session';
import path from 'path';
import http from 'http';
import { Server } from 'socket.io';
import bcrypt from 'bcrypt';
import User from './models/user.js';
import pool from './db.js';
import sessionMiddleware from 'express-socket.io-session';
import { v4 as uuidv4 } from 'uuid';
import { Match } from './models/card.js';

const PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ----------------------------------- настройка этой части заняла +- 4 часа пока не оказалось что там есть отдельная библа)))0)
const appSession = session({
    name: 'race01',
    secret: 'card-game',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 6000000,
    }
});

app.use(session);
io.use(sessionMiddleware(appSession, {
	autoSave:true
}));
// ---------------------------------

// Переменные для сравнений
const logins = [];
const emails = [];
const usersWithToken = [];
const gameQueue = [];
const matches = [];

// Обработка сокета
io.on('connection', (socket) => {
	getAllData();
    console.log('Новый игрок подключен');
	
	socket.on('switchAvatar', (data) => {		
		const avatarUser = new User();
		avatarUser.name = data.name.toString();
		avatarUser.avatar = data.avatar;
		avatarUser.update = true;
		avatarUser.save(data.name);
		console.log(`Пользователь ${avatarUser.name} успешно сменил автар на ${avatarUser.avatar}`);
	});

    socket.on('disconnect', () => {
        console.log('Игрок отключился');

        // Если игрок отключился, нужно удалить его из очереди (если он там был)
        const index = gameQueue.indexOf(socket);
        if (index !== -1) {
            gameQueue.splice(index, 1);
        }
    });
	socket.on('stopSearchingGame', (data) => {
		const indexToRemove = gameQueue.findIndex(item => item.userLogin === data.userLogin);
		if (indexToRemove !== -1) {
			gameQueue.splice(indexToRemove, 1);
			console.log(`Игрок с userLogin ${data.userLogin} удален из очереди.`);
		} else {
			console.log(`Игрок с userLogin ${data.userLogin} не найден в очереди.`);
		}
	});
	socket.on('tokenHandshake', (data) => {
		const user = usersWithToken.find(user => user.token === data.authToken);
		if (user) {
			const tokensUser = new User();
			tokensUser.param = 'name';
			tokensUser.find(user.name); // запрос с бд данных об этом юзере
			setTimeout(() => {
				socket.emit('tokenUserData', {name: tokensUser.name, avatar: tokensUser.avatar})//отправка данных обратно на клиент
			}, 10);
		} else {
			console.log('Произошла ошибка в при поиске необходимого токена.')
		}
	})


	socket.on('searchingGame', (data) => {
		gameQueue.push({ socket, data });
		console.log('Добавлено. Игроки в очереди:' + gameQueue);
		startMatch();
	});
	
	socket.on('login', async (data) => {
    console.log(data);
    const { name, password } = data;

    try {
        const currentUser = new User();
        currentUser.param = 'name';
        currentUser.find(name);
		setTimeout(() => {
        console.log('Session:', socket.handshake.session);
		console.log('User:', currentUser.name);

        if (currentUser.name === name && isCorrectPass(password, currentUser.password)) {
			const authToken = generateAuthToken(); 
			socket.handshake.session.authToken = authToken;
            socket.handshake.session.user = { name: currentUser.name};
			usersWithToken.push({name: currentUser.name, token: authToken});
			console.log(usersWithToken);
            socket.emit('loginResult', { success: true, name: currentUser.name, avatar: currentUser.avatar, authToken: authToken });
            return;
        }

        socket.emit('loginResult', { success: false });
		}, 10);
    } catch (error) {
        console.error(error);
        socket.emit('loginResult', { success: false });
    }
});

	socket.on('registration', async (data) => {
		console.log(data);
		const { name, email, password, password_confirmation } = data;
		
		try {
			if (logins.includes(name) || emails.includes(email) || password !== password_confirmation) {
				socket.emit('registerResult', { success: false });
			} else {
				const hashPass = setHash(password); 
				const userCreate = new User(name, email, hashPass, 'avatarPlaceholder');
				userCreate.save();
				logins.length = 0;
				emails.length = 0;
				socket.emit('registerResult', { success: true });
			}
		} catch (error) {
			console.error(error);
			socket.emit('registerResult', { success: false });
		}
	});

	
});

async function startMatch() {
    if (gameQueue.length >= 2) {
        const player1 = gameQueue.shift();
        const player2 = gameQueue.shift();

        // Создайте матч для player1 и player2
        const matchId = generateUniqueMatchId();
		
		const randomTurn = Math.random() < 0.5 ? 0 : 1;

		let test_player_1 = {
			name: player1.data.name,
			socket: player1.socket,
			hand: [],
			hp: 20,
			energy: 10
		};

		let test_player_2 = {
			name: player2.data.name,
			socket: player2.socket,
			hand: [],
			hp: 20,
			energy: 10
		};
		
        // Отправьте айди матча обоим игрокам
        player1.socket.emit('matchCreated', { matchId, opponentLogin: player2.data.name, opponentAvatar: player2.data.avatar, turn: randomTurn});
        player2.socket.emit('matchCreated', { matchId, opponentLogin: player1.data.name, opponentAvatar: player1.data.avatar, turn: 1 - randomTurn });
		console.log(`Айди матча отправлен юзерам ${player1.data.name} и ${player2.data.name}.`);
		console.log('Оставшиеся игроки в очереди:' + gameQueue);

		let match = new Match(test_player_1, test_player_2);
		playMatch(match);
    }
}

async function playMatch(match) {
	await match.prepare();
	await match.turn(1);
	await match.turn(0);
}

function generateUniqueMatchId() {
	return uuidv4();
}

// Генерация токена аутентификации, мне кажется можно было реализовать проще и без токенов, но уже как есть.
function generateAuthToken() {
    const authToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    return authToken;
}


// Функция для запроса инфы о юзерах
function getAllData() {
	pool.query('SELECT name, email FROM users', (err, res) => {
		if (err) {
			console.error(err);
			return;
		}
		res.map(({ name }) => logins.push(name));
		res.map(({ email }) => emails.push(email));
	});
};

// Для ремайндера паролей (взял из спринта, пусть будет, мб и делать это не будем)
async function getEmails() {
	const [result, _] = await pool.promise().query('SELECT email FROM users;');
	result.map(({ email }) => emails.push(email));
};

// Функция синхронного хеширования пароля
function setHash(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(Math.floor(Math.random() * (10 - 1 + 1)) + 1));
};

// Функция проверки на корректность пароль
const isCorrectPass = (pass, hash) => bcrypt.compareSync(pass, hash);

// Прослушка порта
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
