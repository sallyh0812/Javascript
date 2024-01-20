"use strict";

class Team {
    constructor(team, name) {
        this.team = team;
        this.name = name;
        this.combatants = [];
    }

    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("team");
        this.element.setAttribute("data-team", this.team);
        this.combatants.forEach(cmbt => {
            let icon = document.createElement("div");
            icon.setAttribute("data-combatant", cmbt.id);
            icon.innerHTML = (`
                <img class="alive-pizza" src="/img/icons/alive-pizza.png"></>
                <img class="dead-pizza" src="/img/icons/dead-pizza.png"></>
                <img class="indicator" src="/img/icons/indicator.png"></>
            `);
            this.element.appendChild(icon);
        });
    }

    update() {
        this.combatants.forEach(cmbt=>{
            //console.log(cmbt.id, cmbt.isActive);
            const icon = this.element.querySelector(`[data-combatant=${cmbt.id}]`);
            icon.setAttribute("data-dead", cmbt.hp<=0);
            icon.setAttribute("data-active", cmbt.isActive);
        })

    }

    init(container) {
        this.createElement();
        this.update();
        container.appendChild(this.element);
    }
}