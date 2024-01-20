"use strict";

window.Actions = {
    //attack
    damage1: {
        name: "Whomp!",
        description: "Basic attack (damage: 5)",
        targetType: "",
        alwaysAvailable: true,
        success: [
            { type: "textMessage", text: "{CASTER} uses {ACTION}" },
            { type: "animation", animation: "spin" },
            { type: "stateChange", damage: 5 },
        ],
        fail: [
            { type: "textMessage", text: "{CASTER} uses {ACTION}" },
            { type: "animation", animation: "spin" },
            { type: "animation", animation: "protect" },
            { type: "textMessage", text: "{TARGET} is protected!!" },
        ],
    },

    damage2: {
        name: "Cut",
        description: "Strong attack (damage: 10)",
        targetType: "",
        alwaysAvailable: false,
        success: [
            { type: "textMessage", text: "{CASTER} uses {ACTION}" },
            { type: "animation", animation: "spin" },
            { type: "stateChange", damage: 10 },
        ],
        fail: [
            { type: "textMessage", text: "{CASTER} uses {ACTION}" },
            { type: "animation", animation: "spin" },
            { type: "animation", animation: "protect" },
            { type: "textMessage", text: "{TARGET} is protected!!" },
        ],
    },

    damage3: {
        name: "Broccoli attack",
        description: "Random attack (damage: 1-50)",
        targetType: "",
        alwaysAvailable: false,
        success: [
            { type: "textMessage", text: "{CASTER} uses {ACTION}" },
            { type: "animation", animation: "spin" },
            { type: "stateChange", damage: Math.floor(Math.random()*50)},
        ],
        fail: [
            { type: "textMessage", text: "{CASTER} uses {ACTION}" },
            { type: "animation", animation: "spin" },
            { type: "animation", animation: "protect" },
            { type: "textMessage", text: "{TARGET} is protected!!" },
        ],
    },

    saucy: {
        name: "Tomato Squeeze",
        description: "Squeeze some sauce (Recover hp for 5)",
        targetType: "friendly",
        alwaysAvailable: true,
        success: [
            { type: "textMessage", text: "{CASTER} uses {ACTION}" },
            { type: "animation", animation: "rotate" },
            { type: "stateChange", recover: 5},
        ],
    },

    saucyStatus2: {
        name: "Super Tomato Squeeze",
        description: "Saucy status! (Recover hp for 5 in 2 rounds)",
        targetType: "friendly",
        alwaysAvailable: false,
        success: [
            { type: "textMessage", text: "{CASTER} uses {ACTION}" },
            { type: "animation", animation: "rotate" },
            { type: "stateChange", status: { type: "saucy", expiresIn: 2 },},
        ],
    },

    spicyStatus: {
        name: "Spicy sauce",
        description: "Too hot to attack! (Decrease the damage in the next 3 rounds)",
        alwaysAvailable: true,
        success: [
            { type: "textMessage", text: "{CASTER} uses {ACTION}" },
            { type: "animation", animation: "glob", color: "rgba(255, 25, 25,0.8)" },
            { type: "stateChange", status: { type: "spicy", expiresIn: 3 }},
        ],
        fail: [
            { type: "textMessage", text: "{CASTER} uses {ACTION}" },
            { type: "animation", animation: "glob", color: "rgba(255, 25, 25,0.8)" },
            { type: "animation", animation: "protect" },
            { type: "textMessage", text: "{TARGET} is protected!!" },
        ],
    },

    clumsyStatus: {
        name: "Olive Oil",
        description: "Split oil! (Make 5 damage in the next 3 rounds)",
        alwaysAvailable: false,
        success: [
            { type: "textMessage", text: "{CASTER} uses {ACTION}" },
            { type: "animation", animation: "glob", color: "rgba(204, 204, 0,0.8)" },
            { type: "stateChange", status: { type: "clumsy", expiresIn: 3 } , damage: 3},
            { type: "textMessage", text: "{TARGET} is slipping!!" },
        ],
        fail: [
            { type: "textMessage", text: "{CASTER} uses {ACTION}" },
            { type: "animation", animation: "glob", color: "rgba(204, 204, 0,0.8)" },
            { type: "animation", animation: "protect" },
            { type: "textMessage", text: "{TARGET} is protected!!" },
        ],
    },

    magicStatus: {
        name: "Magic mushroom",
        description: "Magic Power! (Cause 1.5 times damage in the next 2 rounds)",
        targetType: "friendly",
        alwaysAvailable: true,
        success: [
            { type: "textMessage", text: "{CASTER} uses {ACTION}" },
            { type: "stateChange", status: { type: "magic", expiresIn: 3 }},
        ],
        fail: [
            { type: "textMessage", text: "{CASTER} uses {ACTION}" },
            { type: "animation", animation: "protect" },
            { type: "textMessage", text: "{TARGET} is protected!!" },
        ],
    },

    //Items
    item_recoverStatus:{
        name: "Heating Lamp",
        description: "Feeling fresh (clear status)",
        targetType: "friendly",
        success: [
            { type: "textMessage", text: "{CASTER} uses a {ACTION}" },
            { type: "stateChange", status: null , },
            { type: "textMessage", text: "Feeling fresh!" },
        ],
    },

    item_recoverHp:{
        name: "Oven",
        description: "Bake again! (recover: 50)",
        targetType: "friendly",
        success: [
            { type: "textMessage", text: "{CASTER} uses a {ACTION}" },
            { type: "stateChange", recover: 10 , },
            { type: "textMessage", text: "{CASTER} recovers HP!" },
        ],
    },

    item_protect:{
        name: "Cheese",
        description: "Covered by cheese! (get no damage in 2 rounds)",
        targetType: "friendly",
        success: [
            { type: "textMessage", text: "{CASTER} uses a {ACTION}" },
            { type: "animation", animation: "cover", color: "rgba(204, 204, 0,0.8)" },
            { type: "stateChange", status: {type:"cheesy", expiresIn: 3} , },
            { type: "textMessage", text: "Feeling strong!" },
        ],
    },

}