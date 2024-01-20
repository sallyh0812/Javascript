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
        icon: "/img/icons/spicy.png",
        actions:["damage1","saucy","damage2","clumsyStatus","spicyStatus","saucyStatus2"],
    },
    s002:{
        name: "Bacon Brigade",
        description: "Super spicy!!",
        type: PizzaTypes.spicy,
        src: "/img/characters/pizzas/s002.png",
        icon: "/img/icons/spicy.png",
        actions:["damage1","saucy","damage2","clumsyStatus","spicyStatus","saucyStatus2",]//,"damage2","saucyStatus","saucyStatus2","clumsyStatus",],
    },
    v001:{
        name: "Florentine",
        description: "Lots of Spinach!",
        type: PizzaTypes.veggie,
        src: "/img/characters/pizzas/v001.png",
        icon: "img/icons/veggie.png",
        actions:["damage1","saucy","damage2","clumsyStatus",],
    },
    v002:{
        name: "Friarielli Broccoli",
        description: "Cheese and Broccoli!!",
        type: PizzaTypes.veggie,
        src: "/img/characters/pizzas/v001.png",
        icon: "img/icons/veggie.png",
        actions:["damage1","saucy","damage2","clumsyStatus","damage3"],
    },
    f001:{
        name: "Portobello Express",
        description: "Mushroom paradise",
        type: PizzaTypes.fungi,
        src: "/img/characters/pizzas/f001.png",
        icon: "img/icons/fungi.png",
        actions:["damage1","saucy","damage2","clumsyStatus","magicStatus"],
    },
}