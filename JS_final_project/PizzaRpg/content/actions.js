"use strict";

window.Actions = {
    damage1: {
        name: "Whomp!",
        description: "Basic attack",
        targetType: "",
        success: [
            { type: "textMessage", text: "{CASTER} uses {ACTION} on {TARGET}" },
            { type: "animation", animation: "spin" },
            // {type: "textMessage", text: "Something happend!"},
            { type: "stateChange", damage: 10 },
        ],
    },
    saucyStatus: {
        name: "Tomato Squeeze",
        description: "Recover Hp",
        targetType: "friendly",
        success: [
            { type: "textMessage", text: "{CASTER} uses {ACTION}" },
            { type: "animation", animation: "rotate" },
            { type: "stateChange", status: { type: "saucy", expiresIn: 2 } , },
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
        description: "Make longterm damage",
        success: [
            { type: "textMessage", text: "{CASTER} uses {ACTION} on {TARGET}" },
            { type: "animation", animation: "glob", color: "rgba(204, 204, 0,0.8)" },
            { type: "stateChange", status: { type: "clumsy", expiresIn: 3 } , damage: 3},
            { type: "textMessage", text: "{TARGET} is slipping!!" },
        ],
    },
}