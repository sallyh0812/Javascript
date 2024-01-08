class Battle {
    constructor() {
        this.combatants = {
            "player1": new Combatant({
                ...Pizzas.s001,
                /*
                name: "Slice Samuri",
                type: PizzaTypes.spicy,
                src: "/img/characters/pizzas/s001.png",
                icon: "img/icons/spicy.png",
                */

                team: "player", //enemy
                hp: 40,
                maxHp: 50,
                xp: 70,
                maxXp:100,
                level: 1,
                status: null,
                // status: {
                //     type: "clumsy",
                //     expiresIn: 3,
                // }
            }, this),

            "enemy1": new Combatant({
                ...Pizzas["v001"],
                team: "enemy",
                hp: 20,
                maxHp: 50,
                xp: 50,
                maxXp:50,
                level: 1,
                status: null,
            }, this),

            "enemy2": new Combatant({
                ...Pizzas["f001"],
                team: "enemy",
                hp: 25,
                maxHp: 50,
                xp: 30,
                maxXp:50,
                level: 1,
                status: null,
            }, this),
        }

        this.activeCombatants = {
            player: "player1",
            enemy: "enemy1",
        }
    }

    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("battle");
        this.element.innerHTML = (`
            <div class="battle_hero">
                <img src= "${'/img/characters/people/hero.png'}" alt = "Hero" />
            </div> 
            <div class="battle_enemy">
                <img src= "${'/img/characters/people/npc3.png'}" alt = "Enemy" />
            </div> 
        `);
    }

    init(container) {
        this.createElement();
        container.appendChild(this.element);

        Object.keys(this.combatants).forEach(key=>{
            let combatant = this.combatants[key];
            combatant.id = key;
            combatant.init(this.element);
        })
    }
}