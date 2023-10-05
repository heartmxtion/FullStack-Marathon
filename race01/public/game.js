const socket = io();

const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;


let userLogin = null;
let userAvatar = null;
let currentMatchId = null; 
let enemy = null;
let deck = [];
let hand = [];
let visualhand = [];
let myHp = null;
let myEnergy = null;
let myTurn = null;
let enemyEnergy = null;
let enemyHp = null;


let avatar_scale = 0.5;
let avatar_offset = 10;
let card_scale = 0.5;

let selected_card = -1;
let act_turn = false;



socket.on('connect', () => {
    console.log('Подключено к серверу Socket.IO');
});

socket.on('disconnect', () => {
    console.log('Соединение с сервером потеряно');
	localStorage.removeItem('authToken');
	location.reload();
});


socket.once('my_info', (data) => {
	console.log("my_info");
	console.log(data);
	myHp = data.hp;
	myEnergy = data.energy;
	myTurn = data.num;
});

socket.on('new_card_init', (data) => {
	console.log("new_card");
	console.log(data);
	hand.push(data);
});

socket.once('enemy_info', (data) => {
	console.log("enemy_info");
	console.log(data);
	enemyHp = data.hp;
	enemyEnergy = data.energy;
});



const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    scene: {
        preload: preload,
        create: create
    },
	dom: {
        createContainer: true
    }
};

const game = new Phaser.Game(config);

//localStorage.removeItem('authToken');  //раскоментить для фикса бага с токеном.

function preload() {
		//this.load.plugin('rexinputtextplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexinputtextplugin.min.js', true);
}

function create() {
	this.scene.start('StartScene');
}

// Сцена стартовая
const startScene = {
    key: 'StartScene',
    preload: preloadStart,
    create: createStart
};

function preloadStart() {
	this.load.image('background', 'assets/background.webp')
}

function createStart() {
    this.add.image(0, 0, 'background').setOrigin(0);
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

	
    const authToken = localStorage.getItem('authToken');

    if (authToken) {
		socket.emit('tokenHandshake', {authToken: authToken});
		socket.on('tokenUserData', (data) => {
			userLogin = data.name;
			userAvatar = data.avatar;
			this.scene.start('MainMenuScene');
		});

        return;
    }

	
    const loginButton = this.add.text(centerX, centerY - 50, 'Login', { fontSize: '24px', fill: '#fff', backgroundColor: '#333', padding: { x: 10, y: 5 }, stroke: '#000', strokeThickness: 2  });
    const registerButton = this.add.text(centerX, centerY + 50, 'Register', { fontSize: '24px', fill: '#fff', backgroundColor: '#333', padding: { x: 10, y: 5 }, stroke: '#000', strokeThickness: 2  });

    loginButton.setOrigin(0.5);
    registerButton.setOrigin(0.5);

    loginButton.setInteractive().on('pointerdown', () => {
        this.scene.start('LoginScene');
    });

    registerButton.setInteractive().on('pointerdown', () => {
        this.scene.start('RegisterScene');
    });
	
}



game.scene.add('StartScene', startScene);
// Сцена стартовая

const loginScene = {
	key: 'LoginScene',
	preload: preloadLogin,
	create: createLogin
};

function preloadLogin() {
    this.load.image('background', 'assets/background.webp');
	//this.load.plugin('rexinputtextplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexinputtextplugin.min.js', true);
}

function createLogin() {
    this.add.image(0, 0, 'background').setOrigin(0);
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;


    const usernameInput = document.createElement('input');
    usernameInput.type = 'text';
    usernameInput.style = 'width: 200px; height: 30px; font-size: 20px; border: 1px solid #ccc; padding: 5px; text-align: center;';
    usernameInput.placeholder = 'Username';
    document.body.appendChild(usernameInput);
    usernameInput.style.position = 'absolute';
    usernameInput.style.top = -25 + 'px';
    usernameInput.style.left = -100 + 'px';

    const passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.style = 'width: 200px; height: 30px; font-size: 20px; border: 1px solid #ccc; padding: 5px; text-align: center;';
    passwordInput.placeholder = 'Password';
    document.body.appendChild(passwordInput);
    passwordInput.style.position = 'absolute';
    passwordInput.style.top = 50 + 'px';
    passwordInput.style.left = -100 + 'px';
	
	
	const inputsContainer = document.createElement('div');
	inputsContainer.style.position = 'absolute';
	inputsContainer.style.top = '50vh';
	inputsContainer.style.left = '50vw';
	inputsContainer.style.transform = 'translate(-50%, -50%)';
	document.body.appendChild(inputsContainer);

	inputsContainer.appendChild(usernameInput);
    inputsContainer.appendChild(passwordInput);


    const continueButton = this.add.text(centerX + 100, centerY + 150, 'Continue', { fontSize: '24px', fill: '#fff', backgroundColor: '#333', padding: { x: 10, y: 5 }, stroke: '#000', strokeThickness: 2  }).setOrigin(0.5);
    continueButton.setInteractive().on('pointerdown', () => {
        const name = usernameInput.value;
        const password = passwordInput.value;
		socket.emit('login', { name, password });
		// Чёт придумать с обработчиком ибо из-за того что он тут внутри он кароче багает колличество запросов. а если его от сюда убрать, то непонятно как понять когда инпуты удалять))0
		//  UPD:: КАЖЕТСЯ ПОФИКСИЛ, НО ЛУЧШЕ ПРОСЛЕДИТЬ)
		socket.once('loginResult', (data) => {
			if (data.success) {
				document.body.removeChild(inputsContainer);
				const authToken = data.authToken;
				localStorage.setItem('authToken', authToken);
				this.scene.start('MainMenuScene');
				userLogin = data.name;
				userAvatar = data.avatar;
			} else {
				console.log('Ошибка входа. Пожалуйста, проверьте свои учетные данные.');
			}
		});
	});
	const backButton = this.add.text(centerX - 100, centerY + 150, 'Back', { fontSize: '24px', fill: '#fff', backgroundColor: '#333', padding: { x: 10, y: 5 }, stroke: '#000', strokeThickness: 2  }).setOrigin(0.5);
	backButton.setInteractive().on('pointerdown', () => {
		document.body.removeChild(inputsContainer);
		this.scene.start('StartScene');
	});
}

game.scene.add('LoginScene', loginScene);

// Сцена регистрации
const registerScene = {
	key: 'RegisterScene',
	preload: preloadRegister,
	create: createRegister
};

function preloadRegister() {
    this.load.image('background', 'assets/background.webp');
}

function createRegister() {
	this.add.image(0, 0, 'background').setOrigin(0);
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;
	
    const usernameInput = document.createElement('input');
    usernameInput.type = 'text';
    usernameInput.style = 'width: 200px; height: 30px; font-size: 20px; border: 1px solid #ccc; padding: 5px; text-align: center;';
    usernameInput.placeholder = 'Username';
    document.body.appendChild(usernameInput);
    usernameInput.style.position = 'absolute';
    usernameInput.style.top = -75 + 'px';
    usernameInput.style.left = -100 + 'px';
	
	const emailInput = document.createElement('input');
	emailInput.type = 'email';
    emailInput.style = 'width: 200px; height: 30px; font-size: 20px; border: 1px solid #ccc; padding: 5px; text-align: center;';
    emailInput.placeholder = 'Email';
    document.body.appendChild(emailInput);
    emailInput.style.position = 'absolute';
    emailInput.style.top = -25 + 'px';
	emailInput.style.left = -100 + 'px';

    const passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.style = 'width: 200px; height: 30px; font-size: 20px; border: 1px solid #ccc; padding: 5px; text-align: center;';
    passwordInput.placeholder = 'Password';
    document.body.appendChild(passwordInput);
    passwordInput.style.position = 'absolute';
    passwordInput.style.top = 25 + 'px';
	passwordInput.style.left = -100 + 'px';
	
	const passwordRepeatInput = document.createElement('input');
	passwordRepeatInput.type = 'password';
    passwordRepeatInput.style = 'width: 200px; height: 30px; font-size: 20px; border: 1px solid #ccc; padding: 5px; text-align: center;';
    passwordRepeatInput.placeholder = 'Password';
    document.body.appendChild(passwordRepeatInput);
    passwordRepeatInput.style.position = 'absolute';
    passwordRepeatInput.style.top = 75 + 'px';
	passwordRepeatInput.style.left = -100 + 'px';
	
	const inputsContainer = document.createElement('div');
	inputsContainer.style.position = 'absolute';
	inputsContainer.style.top = '50vh';
	inputsContainer.style.left = '50vw';
	inputsContainer.style.transform = 'translate(-50%, -50%)';
	document.body.appendChild(inputsContainer);

	
	inputsContainer.appendChild(usernameInput);
    inputsContainer.appendChild(emailInput);
    inputsContainer.appendChild(passwordInput);
    inputsContainer.appendChild(passwordRepeatInput);
	

    const continueButton = this.add.text(centerX + 100, centerY + 150, 'Continue', { fontSize: '24px', fill: '#fff', backgroundColor: '#333', padding: { x: 10, y: 5 }, stroke: '#000', strokeThickness: 2  }).setOrigin(0.5);
    continueButton.setInteractive().on('pointerdown', () => {
        const name = usernameInput.value;
		const email = emailInput.value;
        const password = passwordInput.value;
		const password_confirmation = passwordRepeatInput.value;
		socket.emit('registration', { name, email, password, password_confirmation });
		// Чёт придумать с обработчиком ибо из-за того что он тут внутри он кароче багает колличество запросов. а если его от сюда убрать, то непонятно как понять когда инпуты удалять))0
		//  UPD:: КАЖЕТСЯ ПОФИКСИЛ, НО ЛУЧШЕ ПРОСЛЕДИТЬ)
		socket.once('registerResult', (data) => {
			if (data.success) {
				document.body.removeChild(inputsContainer);
				this.scene.start('LoginScene');
			} else {
				console.log('Ошибка регистрации.');
			}
		});
	});
	const backButton = this.add.text(centerX - 100, centerY + 150, 'Back', { fontSize: '24px', fill: '#fff', backgroundColor: '#333', padding: { x: 10, y: 5 }, stroke: '#000', strokeThickness: 2  }).setOrigin(0.5);
	backButton.setInteractive().on('pointerdown', () => {
		document.body.removeChild(inputsContainer);
		this.scene.start('StartScene');
	});

}

game.scene.add('RegisterScene', registerScene);
// Сцена регистрации


// Сцена главного меню
const mainMenuScene = {
    key: 'MainMenuScene',
    preload: preloadMainMenu,
    create: createMainMenu
};

function preloadMainMenu() {
    this.load.image('avatarPlaceholder', 'assets/avatarPlaceholder.jpg');
	this.load.image('avatar1', 'assets/avatar1.jpg');
	this.load.image('avatar2', 'assets/avatar2.jpg');
	this.load.image('avatar3', 'assets/avatar3.jpg');
}


function createMainMenu() {
	
    this.add.image(0, 0, 'background').setOrigin(0);

    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    const searchButton = this.add.text(centerX, centerY - 50, 'Search Game', {
        fontSize: '24px',
        fill: '#fff',
        backgroundColor: '#333',
        padding: { x: 10, y: 5 },
        stroke: '#000',
        strokeThickness: 2
    }).setOrigin(0.5);
    searchButton.setInteractive().on('pointerdown', () => {
		this.scene.start('SearchGameScene');
    });

    const avatar = this.add.image(centerX, centerY + 50, `${userAvatar}`).setOrigin(0.5).setScale(0.5);
    const usernameText = this.add.text(centerX, centerY + 120, `${userLogin}`, {
        fontSize: '20px',
        fill: '#fff',
        backgroundColor: '#333',
        padding: { x: 10, y: 5 },
        stroke: '#000',
        strokeThickness: 2
    }).setOrigin(0.5);


	const editButton = this.add.text(centerX, centerY + 150, 'Edit', {
		fontSize: '18px',
		fill: '#fff',
		backgroundColor: 'lightgrey',
		padding: { x: 10, y: 5 },
		stroke: '#000',
		strokeThickness: 2
	}).setOrigin(0.5);

	editButton.setInteractive().on('pointerdown', () => {
		this.scene.start('ChooseAvatarScene');
	});
	const logoutButton = this.add.text(centerX, centerY + 250, 'Logout', {
		fontSize: '21px',
		fill: '#fff',
		backgroundColor: '#cb4154',
		padding: { x: 10, y: 5 },
		stroke: '#000',
		strokeThickness: 2
	}).setOrigin(0.5);

	logoutButton.setInteractive().on('pointerdown', () => {
		localStorage.removeItem('authToken');
		this.scene.start('StartScene');
	});
}


game.scene.add('MainMenuScene', mainMenuScene);
// Сцена главного меню

// Сцена выбора автара
const chooseAvatarScene = {
    key: 'ChooseAvatarScene',
	preload: preloadChooseAvatar,
    create: createChooseAvatar
};

function preloadChooseAvatar() {
	this.load.image('avatarPlaceholder', 'assets/avatarPlaceholder.jpg');
	this.load.image('avatar1', 'assets/avatar1.jpg');
	this.load.image('avatar2', 'assets/avatar2.jpg');
	this.load.image('avatar3', 'assets/avatar3.jpg');
}

function createChooseAvatar() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;
	
	const headerText = this.add.text(centerX, centerY-200, 'Please, choose an avatar which you want.', {
        fontSize: '40px',
        fill: '#fff',
        backgroundColor: '#333',
        padding: { x: 10, y: 5 },
        stroke: '#000',
        strokeThickness: 2
    }).setOrigin(0.5);

    const avatarOptions = [
		{ key: 'avatarPlaceholder', width: 100, height: 100 },	
        { key: 'avatar1', width: 100, height: 100 },
        { key: 'avatar2', width: 100, height: 100 },
        { key: 'avatar3', width: 100, height: 100 }
    ];

    avatarOptions.forEach((option, index) => {
        const avatarImage = this.add.image(centerX - 200 + 150 * index, centerY, option.key)
            .setOrigin(0.5)
            .setDisplaySize(option.width, option.height)
            .setInteractive();
        
        avatarImage.on('pointerdown', () => {
            userAvatar = option.key;
			socket.emit('switchAvatar', {name: userLogin, avatar: userAvatar});
            this.scene.start('MainMenuScene');
        });
    });
}

game.scene.add('ChooseAvatarScene', chooseAvatarScene);

// Сцена выбора автара

// Сцена игры

const inGameScene = {
    key: 'InGameScene',
    preload: preloadInGame,
    create: createInGame
};

function preloadInGame() {
	this.load.image('avatarPlaceholder', 'assets/avatarPlaceholder.jpg');
	this.load.image('avatar1', 'assets/avatar1.jpg');
	this.load.image('avatar2', 'assets/avatar2.jpg');
	this.load.image('avatar3', 'assets/avatar3.jpg');
	this.load.image('health', 'assets/health.png');
	this.load.image('energy', 'assets/energy.png');
	this.load.image('card', 'assets/card.png');
	
	this.load.image('captain_america', 'assets/captain_america.png');
	this.load.image('thor', 'assets/thor.png');
	this.load.image('wolverine', 'assets/wolverine.png');
	this.load.image('sam_wilson', 'assets/sam_wilson.png');
	this.load.image('spiderman', 'assets/spiderman.png');
	this.load.image('nick_fury', 'assets/nick_fury.png');
	this.load.image('doctor_strange', 'assets/doctor_strange.png');
	this.load.image('hulk', 'assets/hulk.png');
	this.load.image('loki', 'assets/loki.png');
	this.load.image('captain_pika', 'assets/captain_pika.png');
	this.load.image('iron_man', 'assets/iron_man.png');
	this.load.image('agent_of_shield', 'assets/agent_of_shield.png');
	this.load.image('peter_parker', 'assets/peter_parker.png');
	this.load.image('black_widow', 'assets/black_widow.png');
	this.load.image('stan_lee', 'assets/stan_lee.png');
	this.load.image('ant-man', 'assets/ant-man.png');
	this.load.image('wasp', 'assets/wasp.png');
	this.load.image('deadpool', 'assets/deadpool.png');
	this.load.image('black_panther', 'assets/black_panther.png');
	this.load.image('gamora', 'assets/gamora.png');
	
	this.load.image('backOfCard', 'assets/backOfCard.png');
	this.load.image('battleground', 'assets/battleground2.jpg');
}

function draw_user_avatar(scene) {
	const avatar = scene.add.image(0, 0, `${userAvatar}`).setOrigin(0).setScale(avatar_scale);
	avatar.y = scene.cameras.main.height - (avatar.height * avatar_scale) - 2 * avatar_offset;
	avatar.x = avatar_offset;
	const usernameText = scene.add.text(0, 0, `${userLogin}`, {
        fontSize: '20px',
        fill: '#fff',
        backgroundColor: '#333',
        padding: { x: 10, y: 5 },
        stroke: '#000',
        strokeThickness: 2
    }).setOrigin(0.5, 0);
	usernameText.y = scene.cameras.main.height - usernameText.height - avatar_offset;
	usernameText.x = avatar.x + (avatar.width / 2) * avatar_scale;
	return avatar;
}

function draw_my_hp(scene, avatar) {
	let healthPic_scale = 0.2
	const healthPic = scene.add.image(0, 0, 'health').setOrigin(0).setScale(healthPic_scale);

	healthPic.x = avatar.x + avatar_offset;
	healthPic.y = avatar.y - (healthPic.height * healthPic_scale) - 5;

	const myHpText = scene.add.text(500, 335, `${myHp}`, {
        fontSize: '20px',
        fill: '#fff',
        padding: { x: 10, y: 5 },
        stroke: '#000',
        strokeThickness: 2
    }).setOrigin(0.5);

	myHpText.x = healthPic.x + (healthPic.width * healthPic_scale) / 2;
	myHpText.y = healthPic.y + (healthPic.height * healthPic_scale) / 2;


	return myHpText;
}

function draw_my_energy(scene, avatar) {
	let energyPic_scale = 0.1
	const energyPic = scene.add.image(0, 0, 'energy').setOrigin(0).setScale(energyPic_scale);

	energyPic.x = avatar.x + (avatar.width * avatar_scale) - avatar_offset - (energyPic.width * energyPic_scale);
	energyPic.y = avatar.y - (energyPic.height * energyPic_scale) - 5;

	const myEnergyText = scene.add.text(500, 335, `${myEnergy}`, {
        fontSize: '20px',
        fill: '#fff',
        padding: { x: 10, y: 5 },
        stroke: '#000',
        strokeThickness: 2
    }).setOrigin(0.5);

	myEnergyText.x = energyPic.x + (energyPic.width * energyPic_scale) / 2;
	myEnergyText.y = energyPic.y + (energyPic.height * energyPic_scale) / 2;


	return myEnergyText;
}

function draw_enemy_avatar(scene) {
	const avatar = scene.add.image(0, 0, `${enemy.avatar}`).setOrigin(0).setScale(avatar_scale);
	avatar.y = avatar_offset;
	avatar.x = scene.cameras.main.width - (avatar.width * avatar_scale) - avatar_offset;
	const enemy_usernameText = scene.add.text(0, 0, `${enemy.name}`, {
        fontSize: '20px',
        fill: '#fff',
        backgroundColor: '#333',
        padding: { x: 10, y: 5 },
        stroke: '#000',
        strokeThickness: 2
    }).setOrigin(0.5, 0.7);

	enemy_usernameText.y = avatar.y + (avatar.height * avatar_scale);
	enemy_usernameText.x = avatar.x + (avatar.width / 2) * avatar_scale;
	return avatar;
}

function draw_enemy_hp(scene, avatar) {
	let healthPic_scale = 0.2
	const healthPic = scene.add.image(0, 0, 'health').setOrigin(0).setScale(healthPic_scale);

	healthPic.x = avatar.x + avatar_offset;
	healthPic.y = avatar.y + (avatar.height * avatar_scale) + 5;

	const enemyHpText = scene.add.text(500, 335, `${myHp}`, {
        fontSize: '20px',
        fill: '#fff',
        padding: { x: 10, y: 5 },
        stroke: '#000',
        strokeThickness: 2
    }).setOrigin(0.5);

	enemyHpText.x = healthPic.x + (healthPic.width * healthPic_scale) / 2;
	enemyHpText.y = healthPic.y + (healthPic.height * healthPic_scale) / 2;


	return enemyHpText;
}

function draw_enemy_energy(scene, avatar) {
	let energyPic_scale = 0.1
	const energyPic = scene.add.image(0, 0, 'energy').setOrigin(0).setScale(energyPic_scale);

	energyPic.x = avatar.x + (avatar.width * avatar_scale) - avatar_offset - (energyPic.width * energyPic_scale);
	energyPic.y = avatar.y + (avatar.height * avatar_scale) + 5;

	const enemyEnergyText = scene.add.text(500, 335, `${myEnergy}`, {
        fontSize: '20px',
        fill: '#fff',
        padding: { x: 10, y: 5 },
        stroke: '#000',
        strokeThickness: 2
    }).setOrigin(0.5);

	enemyEnergyText.x = energyPic.x + (energyPic.width * energyPic_scale) / 2;
	enemyEnergyText.y = energyPic.y + (energyPic.height * energyPic_scale) / 2;


	return enemyEnergyText;
}


function draw_card(scene, x, y, info) {
	const card = scene.add.image(x, y, `${info.img}`).setOrigin(0).setScale(card_scale);
	let card_width = card.width * card_scale;
	let card_height = card.height * card_scale;
	let spot_size = 18;
	const hp_text = scene.add.text(card.x + (spot_size / 2), 
								   card.y + spot_size + (spot_size / 2) + 1, `${info.hp}`, {
        fontSize: '20px',
        fill: '#fff',
        padding: { x: 10, y: 5 },
        stroke: '#000',
        strokeThickness: 2
    }).setOrigin(0.5);
	const atk_text = scene.add.text(card.x + (spot_size / 2), 
								    card.y + (spot_size / 2) + 1, `${info.atk}`, {
        fontSize: '20px',
        fill: '#fff',
        padding: { x: 10, y: 5 },
        stroke: '#000',
        strokeThickness: 2
    }).setOrigin(0.5);
	const def_text = scene.add.text(card.x + card_width - (spot_size / 2), 
								    card.y + (spot_size / 2) + 1, `${info.def}`, {
        fontSize: '20px',
        fill: '#fff',
        padding: { x: 10, y: 5 },
        stroke: '#000',
        strokeThickness: 2
    }).setOrigin(0.5);
	const cost_text = scene.add.text(card.x + card_width - (spot_size / 2), 
									 card.y + spot_size + (spot_size / 2) + 1, `${info.def}`, {
		fontSize: '20px',
		fill: '#fff',
		padding: { x: 10, y: 5 },
		stroke: '#000',
		strokeThickness: 2
	}).setOrigin(0.5);
	const ability_text = scene.add.text(card.x + card_width / 2, 
										card.y + (spot_size / 2) + 1, `${info.ability !== null ? info.ability : ""}`, {
		fontSize: '18px',
		fill: '#000',
		padding: { x: 10, y: 5 },
		stroke: '#000',
		strokeThickness: 1
	}).setOrigin(0.5);


	let card_obj = {
		card_info: info,
		x: card.x,
		y: card.y,
		value: -1,
		card_draw_objs: [card, hp_text, atk_text, def_text, cost_text, ability_text]
	}

	// for (let i = 0; i < card_obj.card_draw_objs.length; i++) {
	// 	card_obj.card_draw_objs[i].x += 100;
	// }

	return card_obj;
}

function createInGame() {
	const handSprites = this.add.group();
	this.add.image(0, 0, 'battleground').setOrigin(0);
	const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;
	
	// Я
	const avatar = draw_user_avatar(this);
	const myHpText = draw_my_hp(this, avatar);
	const myEnergyText = draw_my_energy(this, avatar);

	// Враг
	const enemyAvatar = draw_enemy_avatar(this);
	const enemyHpText = draw_enemy_hp(this, enemyAvatar);
	const enemyEnergyText = draw_enemy_energy(this, enemyAvatar);

	// let card_test = {
	// 	name: "sam_wilson",
	// 	img: "sam_wilson",
	// 	ability: "Fly",
	// 	hp: 3,
	// 	atk: 2,
	// 	def: 1,
	// 	cost: 1,
	// 	bonus_atk: 0,
	// 	bonus_def: 0,
	// 	pos: 0
	// }
	// draw_card(this, centerX, centerY, card_test)


	const exitButton = this.add.text(avatar_offset, avatar_offset, '🏳️', {
		fontSize: '21px',
		fill: '#fff',
		backgroundColor: '#cb4154',
		padding: { x: 10, y: 5 },
		stroke: '#000',
		strokeThickness: 2
	}).setOrigin(0);
	exitButton.setInteractive().on('pointerdown', () => {
		// Записать юзеру 0 хп и завершить матч
		endMatch();
		location.reload();
	});
	const end_turn = this.add.text(this.cameras.main.width - 100, centerY, '🏳️', {
		fontSize: '21px',
		fill: '#fff',
		backgroundColor: '#cb4154',
		padding: { x: 10, y: 5 },
		stroke: '#000',
		strokeThickness: 2
	}).setOrigin(0.5, 1);
	end_turn.setInteractive().on('pointerdown', () => {
		socket.emit('end_turn', null);
	});

	function endMatch() {
		matchId = null;
	}
	
	socket.on('remove_card_from_hand', (data) => {
		console.log("remove_card_from_hand");
		console.log(data);
		clear_card(visualhand[data.card_id]);
		visualhand.splice(data.card_id, 1);
		hand.splice(data.card_id, 1);
		takeCards();
	});
		//////////////////////////////////////////////////////////////////////////////////////////////////////
	
	    // Создаем слоты для игрока
    const alliedSlots = [];
    for (let i = 0; i < 5; i++) {
        const slotX = 100 * i + centerX - 200;
        const slotY = centerY+50;
        const slot = this.add.rectangle(slotX, slotY, 80, 100, 0x808080, 0.5).setOrigin(0.5);
        slot.setInteractive();
        slot.slotId = i; // Присваиваем айди слоту
        alliedSlots.push(slot);
    }

    // Создаем слоты для противника
    const enemySlots = [];
    for (let i = 0; i < 5; i++) {
        const slotX = 100 * i + centerX - 200;
        const slotY = centerY - 70;
        const slot = this.add.rectangle(slotX, slotY, 80, 100, 0x808080, 0.5).setOrigin(0.5);
        slot.slotId = i; // Присваиваем айди слоту
        enemySlots.push(slot);
    }





	// НЕ УВЕРЕН ЧТО ПРАВИЛЬНО РЕАЛИЗОВАЛ
	// Обработчик усиления слота союзной карты
	function handleEnhanceRequest(slotId) {
		socket.emit('selectedSlot', { slotId }); // Отправляем инфу на сервер
	}

	// Приходит запрос от сервера о выборе слота для усиления
	socket.on('enhanceRequest', (data) => {
		const slotIdToEnhance = data.slotId; // ид слота, который нужно усилить

		handleEnhanceRequest(slotIdToEnhance);
	});
	

	// Обработчик клика по слоту игрока
	alliedSlots.forEach(slot => {
		slot.on('pointerdown', () => {
			// Отправляем на сервер айди выбранного слота
			if (act_turn) {
				if (selected_card !== -1) {
					console.log("place_card sended");
					socket.emit('place_card', {hand_id: selected_card, slot_id: slot.slotId})
				}
			}
		});
	});
	// НЕ УВЕРЕН ЧТО ПРАВИЛЬНО РЕАЛИЗОВАЛ
	
	
	
	

    // Обработчик клика по слоту противника
    enemySlots.forEach(slot => {
        slot.on('pointerdown', () => {
            // Отправляем на сервер айди выбранного слота противника
            socket.emit('selectedEnemySlot', { slotId: slot.slotId });
        });
    });
	
	// //////////////////////////////////////////////////////////////////////////////////////////////////////
	
    // // Генерируем колоду
    // for (let i = 0; i < 52; i++) {
    //     deck.push(i);
    // }
	function clear_card(card) {
		for (let j = 0; j < card.card_draw_objs.length; j++) {
			card.card_draw_objs[j].destroy();
		}
	}

	function clearHandSprites() {
		// Удаляем все спрайты и их данные
		for (let i = 0; i < visualhand.length; i++) {
			let card = visualhand[i];
			clear_card(card);
		}
	}

	//280 × 430
	//140 x 215

	const takeCards = () =>{
		clearHandSprites();
	 	// Берём карты в руки
		console.log("------------Рисую карточки------------");
	 	for (let i = 0; i < hand.length; i++) {
			const card_obj = draw_card(this, 150 * i + 200, this.cameras.main.height-100, hand[i]);
			visualhand.push(card_obj);
			card_obj.card_draw_objs[0].setInteractive();
			card_obj.card_draw_objs[0].value = i;
			card_obj.card_draw_objs[0].on('pointerdown', function (pointer, localX, localY, event) {
				selected_card = this.value;
				console.log(selected_card);
			});
	 	}
		
	}
	takeCards();

	socket.emit('prepare_done', null);
	console.log("prepare_done");
	
	// const enemyTakesCards = () => {
	// 	// Даём карты противнику
	// 	// Переписать код, чтобы ему выдавало столько карт сколько у него сейчас в руке, а не фиксированно 5 ПРИ ЧЁМ, ЧТОБЫ НУЖНЫЕ, А ТО ТУТ ОДИНАКОВЫЕ ВЫДАЁТ
	// 	for (let i = 0; i < 5; i++) {
	// 		let randomIndex = Phaser.Math.RND.between(0, deck.length - 1);
	// 		let cardIndex = deck.splice(randomIndex, 1)[0];
	// 		let card = this.add.sprite(60 * i + centerX-125, centerY-300, 'backOfCard').setScale(0.3);
	// 		card.value = cardIndex;
	// 		enemyHand.push(card);
	// 		card.setInteractive();
	// 	}
	// }
	
	// enemyTakesCards();
	

	socket.on('start_turn', () => {
		console.log("start_turn");
		act_turn = true;
		// setTimeout(() => { socket.emit('place_card', {hand_id: 0, slot_id: 0}) }, 2000);
	});

	socket.on('place_card', (data) => {
		console.log("place_card");
		console.log(data);
		const card = data.card;
		const slotId = data.pos;
		const player = data.player;
		let targetSlots;

		if (player === myTurn) {
			targetSlots = alliedSlots;
		} else targetSlots = enemySlots;
		if (targetSlots) {
			const targetSlot = targetSlots.find(slot => slot.slotId === slotId);
			if (targetSlot) {
				const slotX = targetSlot.getCenter().x;
				const slotY = targetSlot.getCenter().y;

				const cardSprite = this.add.sprite(slotX, slotY, card.img).setScale(0.2);
			}
		}
	});

	socket.on('card_dead', (data) => {
		console.log("card_dead");
		const player = data.player;
		if (player === myTurn) {
			targetSlots = alliedSlots;
		} else targetSlots = enemySlots;

	});
	
	
	socket.on('attack_card', (data) => {
		console.log("attack_card");
		console.log(data);
		
		const attackingPlayer = (data.player === myTurn) ? 'me' : 'enemy'; // Определяем, кто атакует

		const attackingCard = (attackingPlayer === 'me') ? alliedSlots[data.pos] : enemySlots[data.pos]; // Определяем, какая карта атакует
		const targetCard = (attackingPlayer === 'me') ? enemySlots[data.pos] : alliedSlots[data.pos]; // Определяем, какая карта получает атаку

		// Анимация атаки
		this.tweens.add({
			targets: attackingCard,
			scaleX: 1.2,
			scaleY: 1.2,
			duration: 200,
			yoyo: true,
			onComplete: function() {
				// Анимация завершена, возвращаем карту в исходное состояние
				attackingCard.setScale(1);
			}
		});

		// Анимация получения урона
		this.tweens.add({
			targets: targetCard,
			alpha: 0.5,
			duration: 200,
			yoyo: true,
			onComplete: function() {
				// Анимация завершена, возвращаем карту в исходное состояние
				targetCard.setAlpha(1);
			}
		});
	});

	socket.on('update_card_state', (data) => {
		console.log("update_card_state");
		console.log(data);
	});

	socket.on('update_player_state', (data) => {
		console.log("update_player_state");
		console.log(data);
		myHp = data.hp;
		myEnergy = data.energy;
		myHpText.setText(`${myHp}`);
		myEnergyText.setText(`${myEnergy}`);
	});

	socket.on('update_enemy_state', (data) => {
		console.log("update_enemy_state");
		console.log(data);
		enemyHp = data.hp;
		enemyEnergy = data.energy;
		enemyHpText.setText(`${enemyHp}`);
		enemyEnergyText.setText(`${enemyEnergy}`);
	});

	socket.on('end_place_turn', () => {
		act_turn = false;
		console.log("end_place_turn");
	});

	socket.on('end_turn', () => {
		console.log("end_turn");
	});


}

game.scene.add('InGameScene', inGameScene);

// Сцена игры

// Сцена поиска игры

const searchGameScene = {
	key: 'SearchGameScene',
	preload: preloadSearchGame,
	create: createSearchGame
}

function preloadSearchGame() {
	
}

function createSearchGame() {
	this.add.image(0, 0, 'background').setOrigin(0);
	const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;
	
	const matchStatusText = this.add.text(centerX, centerY, 'Searching game...', {
        fontSize: '40px',
        fill: '#fff',
        backgroundColor: '#333',
        padding: { x: 10, y: 5 },
        stroke: '#000',
        strokeThickness: 2
    }).setOrigin(0.5);
	
	const cancelButton = this.add.text(centerX, centerY + 50, 'Cancel', {
		fontSize: '18px',
		fill: '#fff',
		backgroundColor: '#333',
		padding: { x: 10, y: 5 },
		stroke: '#000',
		strokeThickness: 2
	}).setOrigin(0.5);

	cancelButton.setInteractive().on('pointerdown', () => {
		socket.emit('stopSearchingGame', {userLogin} );
		this.scene.start('MainMenuScene');
	});
	
	
	// Временное решение с переходом на сцену игры
	socket.emit('searchingGame', {name: userLogin, avatar: userAvatar}); // отправка игрока в очередь на поиск игры.
	
	socket.once('matchCreated', ({ matchId, opponentLogin, opponentAvatar, turn }) => {
		currentMatchId = matchId;
		console.log(`Айди пришёл юзеру. ID: ${matchId}`);
		console.log(`Твоя очередь на то, чтобы сделать шаг: ${turn + 1}`)

		setTimeout(() => { matchStatusText.text = 'Game founded! Preparing battleground...'; }, 10);
		enemy = {name: opponentLogin, avatar: opponentAvatar};
		//this.scene.start('InGameScene');
		setTimeout(() => { this.scene.start('InGameScene') }, 1000);
	});
}

game.scene.add('SearchGameScene', searchGameScene);
// Сцена поиска игры

