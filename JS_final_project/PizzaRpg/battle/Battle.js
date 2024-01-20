class Battle {
    constructor({ enemy, onComplete }) {
        this.enemy = enemy,
            //enemy: enemies[this.event.enemyId],
            this.onComplete = onComplete;
        this.combatants = {
            /*"player1": new Combatant({
                ...Pizzas.s001,
                
                // name: "Slice Samuri",
                // type: PizzaTypes.spicy,
                // src: "/img/characters/pizzas/s001.png",
                // icon: "img/icons/spicy.png",
 
                team: "player", //enemy
                hp: 10,
                maxHp: 50,
                xp: 75,
                maxXp:80,
                level: 1,
                status: null,
                isPlayerControlled: true,
            }, this),
 
            "player2": new Combatant({...}, this),
 
            "enemy1": new Combatant({...}, this),
            */
        };

        this.activeCombatants = {
            player: null,
            enemy: null,
        };

        this.items = [];

        //dynamically add items for player team
        window.playerState.items.forEach(item => {
            this.items.push({
                ...item,
                team: "player",
            })
        });

        this.usedItemIds = {};

        //dynamically add the player team
        window.playerState.lineup.forEach(id => {
            this.addCombatant(id, "player", window.playerState.pizzas[id]);
        });

        //dynamically add the enemy team
        Object.keys(this.enemy.pizzas).forEach(key => {
            this.addCombatant("e_" + key, "enemy", this.enemy.pizzas[key]);
        });
    }

    addCombatant(id, team, config) {
        this.combatants[id] = new Combatant({
            ...Pizzas[config.pizzaId],
            ...config,
            team: team,
            isPlayerControlled: team === "player" ? true : false,
        }, this);

        let activePlayerId = this.activeCombatants[team];
        let pizza = window.playerState.pizzas[activePlayerId];
        if (pizza) {
            this.activeCombatants[team] = (pizza.hp > 0) ? activePlayerId : id;
        }else{
            this.activeCombatants[team] = id;
        }

    }

    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("battle");
        this.element.innerHTML = (`
            <div class="battle_hero">
                <img src= '/img/characters/people/hero.png' alt = "Hero" />
            </div> 
            <div class="battle_enemy">
                <img src= "${this.enemy.src}" alt = "${this.enemy.name}" />
            </div> 
        `);
    }

    init(container) {
        this.createElement();
        container.appendChild(this.element);

        this.playerTeam = new Team("player", "Hero");
        this.enemyTeam = new Team("enemy", "Jackie");

        Object.keys(this.combatants).forEach(key => {
            let combatant = this.combatants[key];
            combatant.id = key;
            combatant.init(this.element);

            if (combatant.team === "player") {
                this.playerTeam.combatants.push(combatant);
            } else if (combatant.team === "enemy") {
                this.enemyTeam.combatants.push(combatant);
            }
        });

        this.playerTeam.init(this.element);
        this.enemyTeam.init(this.element);

        this.turnCycle = new TurnCycle({
            battle: this,
            onNewEvent: event => {
                return new Promise(resolve => {
                    const battleEvent = new BattleEvent(event, this);
                    battleEvent.init(resolve);
                })
            },
            onWinner: winner => {
                if (winner === "player") {
                    const playerState = window.playerState;
                    Object.keys(playerState.pizzas).forEach(id => {
                        const playerStatePizza = playerState.pizzas[id];
                        const combatant = this.combatants[id];
                        if (combatant) {
                            playerStatePizza.hp = combatant.hp;
                            playerStatePizza.maxHp = combatant.maxHp;
                            playerStatePizza.xp = combatant.xp;
                            playerStatePizza.maxXp = combatant.maxXp;
                            playerStatePizza.level = combatant.level;
                            //playerStatePizza.status = combatant.status;
                        }
                    });

                    //delete used items
                    playerState.items.filter(i => {
                        return this.usedItemIds[i.itemId] !== true
                    });
                }

                this.element.remove();
                this.onComplete();
            }
        });

        this.turnCycle.init();
    }
}