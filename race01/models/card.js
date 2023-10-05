import { compare } from "bcrypt";

let Field_size = 5;
let Base_card_amount = 5;

// player {
//   name: name,
//   avatar: avatar,
//   socket: socket
//   hand[]
//   hp: 20
//   energy: 10
// }


// общее
// enemy_info          --обмен инфой
// my_info             --обмен инфой

// личное
// new_card  (несколько)       -- стартовые карты
// start_turn                  -- твой шаг начался
//  place_card                 -- ставим карту на слот
//  update_player_state        -- обновляем твою инфу
//  remove_card_from_hand      -- убираем карту с руки
// end_place_turn              -- конец хода с растановкой карт
//  update_card_state          -- обновляем состояние карт
// end_turn                    -- конец хода

export class Match {
    constructor(player_1, player_2) {
        this.player_1 = player_1;
        this.player_2 = player_2;
        this.player_turn = 0;
        this.field = new Field(player_1.socket, player_2.socket);

        this.init();
    }

    get_card() {
		const allCards = [
			new Card("captain_america", 3, 2, 2, 5, new Ability_Shield(),           'captain_america'),
			new Card("thor",            5, 3, 1, 5, null,                           'thor'),
			new Card("wolverine",       3, 2, 1, 4, new Ability_Spike(),            'wolverine'),
			new Card("sam_wilson",      6, 2, 1, 3, null,                           'sam_wilson'),
			new Card("spiderman",       2, 2, 2, 6, new Ability_Duality(),          'spiderman'),
			new Card("nick_fury",       1, 2, 1, 4, new Ability_Leader(),           'nick_fury'),
			new Card("doctor_strange",  3, 2, 1, 3, new Ability_Damage_Weakening(), 'doctor_strange'),
			new Card("hulk",            3, 2, 1, 1, new Ability_Duality(),          'hulk'),
			new Card("loki",            5, 2, 1, 1, new Ability_Duality(),          'loki'),
			new Card("captain_pika",    3, 2, 1, 1, new Ability_Shield(),           'captain_pika'),
			new Card("iron_man",        2, 2, 1, 1, new Ability_Leader(),           'iron_man'),
			new Card("agent_of_shield", 3, 3, 1, 5, null,                           'agent_of_shield'),
			new Card("peter_parker",    3, 4, 1, 4, null,                           'peter_parker'),
			new Card("black_widow",     3, 2, 2, 6, null,                           'black_widow'),
			new Card("stan_lee",        3, 2, 1, 1, null,                           'stan_lee'),
			new Card("ant-man",         3, 3, 1, 4, null,                           'ant-man'),
			new Card("wasp",            3, 3, 1, 4, null,                           'wasp'),
			new Card("deadpool",        1, 2, 1, 1, null,                           'deadpool'),
			new Card("black_panther",   1, 2, 1, 1, null,                           'black_panther'),
			new Card("gamora",          3, 5, 1, 6, null,                           'gamora')
		];
        const randomIndex = Math.floor(Math.random() * allCards.length);
		return allCards[randomIndex];
    }

    get_player_by_id(player_id) {
        if (player_id == 0) return this.player_1;
        return this.player_2;
    }

    get_new_card(player_id, init) {
        let player_obj = this.get_player_by_id(player_id);
        let card = this.get_card();
        // card.pos = player_obj.hand.length;
        player_obj.hand.push(card);
        if (init) {
            player_obj.socket.emit('new_card_init', card.get_info());
        }
        else {
            player_obj.socket.emit('new_card', card.get_info());
        }
    }

    send_players_info() {
        this.player_1.socket.emit('my_info',    {hp: this.player_1.hp, energy: this.player_1.energy, num: 0});
        this.player_1.socket.emit('enemy_info', {hp: this.player_2.hp, energy: this.player_2.energy});
        this.player_2.socket.emit('my_info',    {hp: this.player_2.hp, energy: this.player_2.energy, num: 1});
        this.player_2.socket.emit('enemy_info', {hp: this.player_1.hp, energy: this.player_1.energy});
        console.log("info was sended");
    }

    init_hand() {
        for (let i = 0; i < Base_card_amount; i++) {
            this.get_new_card(0, 1);
            this.get_new_card(1, 1);
        }
    }

    init() {
        this.send_players_info();
        this.init_hand();
    }

    get_card_from_hand(player_id, card_id) {
        let player_obj = this.get_player_by_id(player_id);
        return player_obj.hand[card_id];
    }

    delete_card_from_hand(player_id, card_id) {
        let player_obj = this.get_player_by_id(player_id);
        player_obj.hand.splice(card_id, 1);
        player_obj.socket.emit('remove_card_from_hand', {card_id: card_id});
    }

    decrease_energy(player_id, d_energy) {
        let player_obj = this.get_player_by_id(player_id);
        player_obj.energy = player_obj.energy - d_energy;
        player_obj.socket.emit('update_player_state', {hp: player_obj.hp, energy: player_obj.energy});
    }

    async prepare() {
        let player1Ready = false;
        let player2Ready = false;
    
        const player1Promise = new Promise((resolve) => {
            this.player_1.socket.once('prepare_done', () => {
                console.log("player 1 ready");
                player1Ready = true;
                resolve();
            });
        });
    
        const player2Promise = new Promise((resolve) => {
            this.player_2.socket.once('prepare_done', () => {
                console.log("player 2 ready");
                player2Ready = true;
                resolve();
            });
        });
    
        await Promise.all([player1Promise, player2Promise]);
    
        return player1Ready && player2Ready;
    }

    // data {
    //   hand_id
    //   slot_id
    // }
    async turn(player_id) {
        let player_obj = this.get_player_by_id(player_id);
        player_obj.energy = 10;
        this.send_players_info();
        player_obj.socket.emit('start_turn', null);
        console.log("start turn");
    
        const timerPromise = new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                clearTimeout(timer);
                reject("Ход не закончился за 30 секунд");
            }, 30000);
        });
    
        const placeCardPromise = new Promise((resolve) => {
            player_obj.socket.on('place_card', (data) => {
                console.log("place_card");
                console.log(data);
                let card = this.get_card_from_hand(player_id, data.hand_id);
                if (player_obj.energy - card.cost >= 0) {
                    this.field.insert_card(card, player_id, data.slot_id);
                    this.decrease_energy(player_id, card.cost);
                    this.delete_card_from_hand(player_id, data.hand_id);
                }
            });
            player_obj.socket.once('end_turn', () => {
                resolve();
            });
        });
    
        try {
            await Promise.race([timerPromise, placeCardPromise]);
            console.log("end_place_turn");
            player_obj.socket.emit('end_place_turn', null);
    
            let user_damage = this.field.fight(player_id);
            if (user_damage != 0) {
                let enemy = this.get_player_by_id(1 - player_id);
                enemy.hp = enemy.hp - user_damage;
                player_obj.socket.emit('update_enemy_state', { hp: enemy.hp, energy: enemy.energy });
                enemy.socket.emit('update_player_state', { hp: enemy.hp, energy: enemy.energy });
                if (enemy.hp <= 0) {
                    console.log(1 - player_id + "dead");
                }
            }
    
            player_obj.socket.emit('end_turn', null);
        } catch (error) {
            console.error(error);
        }
    }
}


class Slot {
    constructor() {
        this.bonus_atk = 0;
        this.bonus_def = 0;
    }

    apply_bonus(bonus_atk, bonus_def) {
        this.bonus_atk += bonus_atk;
        this.bonus_def += bonus_def;
    }
}


class Field {
    constructor(socket_1, socket_2) {
        this.field = {p1: [], p2: []};
        this.socket_1 = socket_1;
        this.socket_2 = socket_2;

        this.prepare_field();
    }

    send_to_both(action, data) {
        this.socket_1.emit(action, data);
        this.socket_2.emit(action, data);
    }

    prepare_field() {
        for (let i = 0; i < Field_size; i++) {
            this.field.p1.push(new Slot());
            this.field.p2.push(new Slot());
        }
    }

    get_side(player) {
        if (player == 0) return this.field.p1;
        return this.field.p2;
    }

    apply_ability_to_field(info, player) {
        if (info !== undefined) {
            for (let i = 0; i < info.targets_id.length; i++) {
                let target = info.targets_id[i];
                let side = this.get_side(Math.abs(player - target.side));
                side[target.pos].apply_bonus(info.damage_bonus, info.defence_bonus);
            }
        }
    }

    card_dead(player, dead_info, aditional_info) {
        if (aditional_info !== null) {
            aditional_info.damage_bonus = -aditional_info.damage_bonus;
            aditional_info.damage_bonus = -aditional_info.defence_bonus;
            this.apply_ability_to_field(aditional_info, player);
        }
        let side = this.get_side(player);
        side[dead_info.pos] = dead_info.slot;
        this.send_to_both('card_dead', {player: player, pos: dead_info.pos});
    }

    apply_damage(info, player) {
        let user_damage = 0;
        for (let i = 0; i < info.targets_id.length; i++) {
            let target = info.targets_id[i];
            let side = this.get_side(Math.abs(player - target.side));
            if (side[target.pos] instanceof Card) {
                let answer = side[target.pos].apply_damage(target, info.source_id);
                answer['player'] = Math.abs(player - target.side);
                answer['card'] = side[target.pos].get_info();

                if (answer.aditional !== null) {
                    this.apply_damage(answer.aditional, player);
                }
                delete answer.aditional;
                let action = answer.action;
                delete answer.action;

                this.send_to_both(action, answer);
                if (side[target.pos].hp <= 0) {
                    let answer_dead = side[target.pos].death();
                    this.card_dead(Math.abs(player - target.side), answer_dead[0],  answer_dead[1]);
                }
            }
            else {
                user_damage += target.damage;
            }
        }
        return user_damage;
    }



    insert_card(card, player, pos) {
        let side = this.get_side(player);

        if (pos >= 0 && pos < Field_size) {
            card.pos = pos;
            card.apply_slot(side[pos]);
            side[pos] = card;

            const answer = {
                player: player,
                pos: pos,
                card: card.get_info()
            }
            this.send_to_both('place_card', answer);
            let info = card.apply_ability();
            this.apply_ability_to_field(info, player);
        }
    }

    fight(player) {
        let side = this.get_side(player);
        let user_damage = 0;
        for (let i = 0; i < side.length; i++) {
            if (side[i] instanceof Card) {
                const fight = {
                    player: player,
                    pos: i
                }
                this.send_to_both('attack_card', fight);
                user_damage += this.apply_damage(side[i].attack(), player);
            }
        }
        return user_damage;
    }



}




class Card {
    constructor(name, hp, atk, def, cost, ability, img) {
        this.name    = name;
        this.hp      = hp;
        this.atk     = atk;
        this.def     = def
        this.cost    = cost;
        this.ability = ability;
        this.pos     = 0;
		this.img = img;

        this.slot;

        this.bonus_def = 0;
        this.bonus_atk = 0;
    }

    get_full_damage() {
        return this.atk + this.bonus_atk;
    }

    get_full_defence() {
        return this.def + this.bonus_def;
    }

    apply_bonus(damage_bonus, defence_bonus) {
        this.slot.apply_bonus(damage_bonus, defence_bonus);
        this.apply_slot(this.slot);
    }

    apply_slot(slot) {
        this.slot = slot;
        this.bonus_atk = this.slot.bonus_atk;
        this.bonus_def = this.slot.bonus_def;
    }

    get_info() {
        return {
            name: this.name,
            hp: this.hp,
            atk: this.get_full_damage(),
            def: this.get_full_defence(),
            cost: this.cost,
            ability: ((this.ability !== null ) ? this.ability.name : null),
            bonus_atk: this.bonus_atk,
            bonus_def: this.bonus_def,
            pos: this.pos,
			img: this.img
        }
    }

    death() {
        const dead_info = {
            pos: this.pos,
            slot: this.slot
        }

        if (this.ability && this.ability.type === "controll") {
            const controll_info = {
                source_id: {side: 0, pos: this.pos},
                targets_id: [null],
                damage_bonus: 0,
                defence_bonus: 0
            }

            return [dead_info, this.ability.apply_ability(controll_info)];
        }
        return [dead_info, null];
    }


    attack() {
        const damage_info = {
            source_id: {side: 0, pos: this.pos},
            targets_id: [{side: 1, pos: this.pos, damage: this.get_full_damage()}],
            damage: this.get_full_damage()
        }

        if (this.ability && this.ability.type === "attack") {
            return this.ability.apply_ability(damage_info);
        }

        return damage_info;
    }

    apply_ability() {
        if (this.ability && this.ability.type === "controll") {
            const controll_info = {
                source_id: {side: 0, pos: this.pos},
                targets_id: [null],
                damage_bonus: 0,
                defence_bonus: 0
            }

            return this.ability.apply_ability(controll_info);
        }
    }

    apply_damage(damage_info, source) {
        let answer;
        let dmg = damage_info.damage;
        if (this.ability && this.ability.type === "defence") {
            answer = this.ability.apply_ability(damage_info, source);
            dmg = answer[0];
        }

        let actual_dmg = ((this.get_full_defence() < dmg) ? this.get_full_defence() - dmg : 0)

        this.hp = this.hp + actual_dmg;

        const result = {
            action: 'update_card_state',
            damage: actual_dmg,
            aditional: null
        }

        if (answer) {
            result.aditional = answer[1];
        }
        return result;
    }
}



class Ability {
    constructor(name, type) {
        this.name = name;
        this.type = type;
    }

    apply_ability(info) {
    }
}

// attack ability
class Ability_Fly extends Ability {
    constructor() {
        super("Fly", "attack");
    }

    apply_ability(damage_info) {
        damage_info.targets_id = [{side: 1, pos: -1}];
        return damage_info;
    }
}

class Ability_Duality extends Ability {
    constructor() {
        super("Duality", "attack");
    }

    apply_ability(damage_info) {
        let source_pos = damage_info.source_id.pos;
        if (source_pos === 0) {
            damage_info.targets_id = [{side: 1, pos: 1, damage: damage_info.damage}];
        }
        else if (source_pos === Field_size - 1) {
            damage_info.targets_id = [{side: 1, pos: Field_size - 2, damage: damage_info.damage}];
        }
        else {
            damage_info.targets_id = [{side: 1, pos: source_pos - 1, damage: damage_info.damage}, 
                                      {side: 1, pos: source_pos + 1, damage: damage_info.damage}];
        }
        return damage_info;
    }
}
// attack ability



// controll ability
class Ability_Damage_Weakening extends Ability {
    constructor() {
        super("Weakening", "controll");
        this.damage_bonus = -1;
    }

    apply_ability(control_info) {
        let source_pos = control_info.source_id.pos;
        control_info.targets_id = [{side: 1, pos: source_pos}];
        control_info.damage_bonus = this.damage_bonus;
        return control_info;
    }
}

class Ability_Leader extends Ability {
    constructor() {
        super("Leader", "controll");
        this.damage_bonus = 1;
    }

    apply_ability(control_info) {
        let source_pos = control_info.source_id.pos;
        if (source_pos === 0) {
            control_info.targets_id = [{side: 0, pos: 1}];
        }
        else if (source_pos[0] === Field_size - 1) {
            control_info.targets_id = [{side: 0, pos: Field_size - 2}];
        }
        else {
            control_info.targets_id = [{side: 0, pos: source_pos - 1}, {side: 0, pos: source_pos + 1}];
        }
        control_info.damage_bonus = this.damage_bonus;
        return control_info;
    }
}
// controll ability


// defence ability
class Ability_Spike extends Ability {
    constructor() {
        super("Spike", "defence");
        this.percent = 0.8;
    }

    apply_ability(damage_info, source) {
        let ret_damage = Math.floor(damage_info.damage * this.percent);
        if (ret_damage == 0 && damage_info.damage !== 0) ret_damage = 1;

        const answer = {
            source_id: {side: 1, pos: source.pos},
            targets_id: [{side: 0, pos: source.pos, damage: ret_damage}],
            damage: ret_damage
        }
        return [damage_info.damage, answer];
    }
}

class Ability_Shield extends Ability {
    constructor() {
        super("Shield", "defence");
        this.active = true;
    }

    apply_ability(damage_info, source) {
        if (this.active) {
            this.active = false;
            return [0, null];
        }
        return [damage_info.damage, null];
    }
}
// defence ability



// let card_1 = new Card("weak",  10, 5, 1, 5, new Ability_Damage_Weakening());
// let card_2 = new Card("spike", 10, 5, 1, 5, new Ability_Spike());
// let card_3 = new Card("dual",  10, 5, 1, 5, new Ability_Duality());


// let field = new Field();
// field.insert_card(card_1, 0, 1);
// field.insert_card(card_3, 1, 1);
// field.insert_card(card_2, 0, 2);
// console.log(field.field);
// field.fight(1);


// let player_1 = {
//   name: "aboba",
//   avatar: "-",
//   socket: "-",
//   hand: [],
//   hp: 20,
//   energy: 10
// }

// let player_2 = {
//     name: "abobiks",
//     avatar: "-",
//     socket: "-",
//     hp: 20,
//     energy: 10,
//     hand: []
// }

// let match = new Match(player_1, player_2);
// console.log("--------------------\n");
// match.turn(0);
// console.log(match.player_1);





// способности:
// ! полёт             -> бьёт игрока напрямую
// провокация        -> заставляет летающего атаковать себя, а не игрока
// телекинез         -> ударить выбраную карту(летающую в том числе)
// ! дуализм           -> бьёт две карты по диагонали
// ! шипы              -> отражает часть урона врагу
// ! ослабление        -> уменьшает урон противника на 1
// ! лидер             -> увеличивает урон у соседей на 1
// поддержка щитом   -> увеличить защиту выбраной карты
// зачаровать оружие -> увеличить урон выбраной карты





// "генератор"       -> увеличивает регенирацию енергии за ход
