"use strict";

class PlayerState {
    constructor() {
        this.pizzas = {
            "p1": {
                pizzaId: "s002",
                hp: 5,
                maxHp: 30,
                xp: 95,
                maxXp: 100,
                level: 1,
                status: null,
            },
            "p2": {
                pizzaId: "f001",
                hp: 30,
                maxHp: 30,
                xp: 0,
                maxXp: 100,
                level: 1,
                status: null,
            },
            "p3": {
                pizzaId: "v002",
                hp: 30,
                maxHp: 30,
                xp: 0,
                maxXp: 100,
                level: 1,
                status: null,
            },
        };

        this.lineup = ["p1", "p2", "p3"];
        this.items = [
            { actionId: "item_recoverStatus", itemId: "i1",},
            { actionId: "item_recoverStatus", itemId: "i2",},
            { actionId: "item_recoverHp", itemId: "i3",},
            { actionId: "item_protect", itemId: "i4",},
        ];
    }
}

window.playerState = new PlayerState();