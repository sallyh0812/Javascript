"use strict";

window.PizzaTypes = {
    normal: "normal",
    spicy: "spicy",
    veggie: "veggie",
    fungi: "fungi",
    chill: "chill",
}

window.Pizzas ={
    s001:{
        name: "Slice Samuri",
        description: "Classic",
        type: PizzaTypes.spicy,
        src: "/img/characters/pizzas/s001.png",
        icon: "img/icons/spicy.png",
        actions:[
            "clumsyStatus",
            "saucyStatus",
            "damage1",
        ],
    },
    s002:{
        name: "Bacon Brigade",
        description: "Bacon paradise!!",
        type: PizzaTypes.spicy,
        src: "/img/characters/pizzas/s002.png",
        icon: "img/icons/spicy.png",
        actions:[
            "clumsyStatus",
            "saucyStatus",
            "damage1",
        ],
    },
    v001:{
        name: "Call me Kale",
        description: "Bacon paradise!!",
        type: PizzaTypes.veggie,
        src: "/img/characters/pizzas/v001.png",
        icon: "img/icons/veggie.png",
        actions:[
            "damage1",
            "saucyStatus",
            "clumsyStatus",
        ],
    },
    f001:{
        name: "Portobello Express",
        description: "Everyone should try this",
        type: PizzaTypes.fungi,
        src: "/img/characters/pizzas/f001.png",
        icon: "img/icons/fungi.png",
        actions:["damage1", "saucyStatus","clumsyStatus",],
    },
}