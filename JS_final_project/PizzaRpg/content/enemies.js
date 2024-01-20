"use strict";

window.enemies = {
    "Bob": {
        name: "Bob",
        src: "/img/characters/people/npc3.png",
        pizzas: {
            "a": {
                pizzaId: "s001",
                hp: 30,
                maxHp: 30,
                xp: 0,
                maxXp: 40,
                level: 1,
                status: null,
            }
        }
    },

    "Jackie": {
        name: "Jackie",
        src: "/img/characters/people/erio.png",
        pizzas: {
            "a": {
                pizzaId: "f001",
                hp: 30,
                maxHp: 30,
                xp: 0,
                maxXp: 50,
                level: 1,
                status: null,
            },
            "b": {
                pizzaId: "v001",
                hp: 30,
                maxHp: 30,
                xp: 0,
                maxXp: 80,
                level: 1,
                status: null,
            }
        }
    },
    "Jane": {
        name: "Jane",
        src: "/img/characters/people/npc1.png",
        pizzas: {
            "a": {
                pizzaId: "f001",
                hp: 1,
                maxHp: 50,
                xp: 0,
                maxXp: 80,
                level: 1,
                status: null,
                attackBonus: 200,
            },
        }
    }
}