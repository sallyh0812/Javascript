"use strict";

window.Actions = {
    damage1: {
        name: "Whomp!",
        type: "",
        success: [
            { type: "textMessage", text: "{CASTER} uses {ACTION} on {TARGET}" },
            { type: "animation", animation: "spin" },
            // {type: "textMessage", text: "Something happend!"},
            { type: "stateChange", damage: 10 },
        ],
    },
    saucyStatus: {
        name: "Tomato Squeeze",
        targetType: "friendly",
        success: [
            { type: "textMessage", text: "{CASTER} uses {ACTION} on {TARGET}" },
            { type: "animation", animation: "spin" },
            { type: "stateChange", status: { type: "saucy", expiresIn: 1 } , },
        ],
    },
    saucyStatus2: {
        name: "Super Tomato Squeeze",
        targetType: "friendly",
        success: [
            { type: "textMessage", text: "{CASTER} uses {ACTION} on {TARGET}" },
            { type: "animation", animation: "spin" },
            { type: "stateChange", status: { type: "saucy", expiresIn: 3 },},
        ],
    },

    clumsyStatus: {
        name: "Olive Oil",
        success: [
            { type: "textMessage", text: "{CASTER} uses {ACTION} on {TARGET}" },
            { type: "animation", animation: "glob", color: "rgba(204, 204, 0,0.8)" },
            { type: "stateChange", status: { type: "clumsy", expiresIn: 2 } , damage: 5},
            { type: "textMessage", text: "{TARGET} is slipping!!" },
        ],
    },
}