"use strict";

window.Actions = {
    damage1:{
        name: "Whomp!",
        type: "",
        success: [
            {type: "textMessage", text: "{CASTER} uses {ACTION} on {TARGET}"},
            {type: "animation", animation: "spin"},
            // {type: "textMessage", text: "Something happend!"},
            {type: "stateChange", damage: 10},
        ],
    },
    damage2:{
        name: "Whomp!",
        type: "",
        success: [
            {type: "textMessage", text: "{CASTER} uses {ACTION} on {TARGET}"},
            {type: "animation", animation: "spin"},
            // {type: "textMessage", text: "Something happend!"},
            {type: "stateChange", damage: 5},
        ],
    }
}