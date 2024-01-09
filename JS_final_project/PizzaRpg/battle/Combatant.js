"use strict";

class Combatant {
    constructor(config, battle) {

        // config = {
        //     hp: 100,
        //     maxHp: 200,
        //     xp: 34,
        //     name: "Bingo",
        //     actions: [],
        // }

        Object.keys(config).forEach(key => {
            this[key] = config[key];
        })

        this.battle = battle;
    }

    get hpPercent() {
        const percent = this.hp / this.maxHp * 100;
        return percent > 0 ? percent : 0;
    }

    get xpPercent() {
        const percent = this.xp / this.maxXp * 100;
        return percent > 0 ? percent : 0;
    }

    get isActive() {
        return this.battle.activeCombatants[this.team] === this.id;
    }

    createElement() {
        this.hudElement = document.createElement("div");
        this.hudElement.classList.add("combatant");
        this.hudElement.setAttribute("data-combatant", this.id);
        this.hudElement.setAttribute("data-team", this.team);

        this.hudElement.innerHTML = (`
        <p class="combatant_name">${this.name}</p>
        <p class="combatant_level"></p>
        <div class="combatant_character_crop">
            <img class="combatant_character" alt="${this.name}" src = "${this.src}"/>
        </div>
        <img class="combatant_type" src="${this.icon}" alt="${this.type}"/>
        <svg viewBox = "0 0 26 3" class="combatant_life-container">
            <rect x = 0 y = 0 width = "0%" height = "1" fill = #82ff71></rect>
            <rect x = 0 y = 1 width = "0%" height = "2" fill = #3ef126></rect>
        </svg>
        <svg viewBox = "0 0 26 2" class="combatant_xp-container">
            <rect x = 0 y = 0 width = "0%" height = "1" fill = #ffd76a></rect>
            <rect x = 0 y = 1 width = "0%" height = "2" fill = #ffc934></rect>
        </svg>
        <p class="combatant_status"></p>
        `);

        this.pizzaElement = document.createElement("img");
        this.pizzaElement.classList.add("pizza");
        this.pizzaElement.setAttribute("src", this.src);
        this.pizzaElement.setAttribute("alt", this.name);
        this.pizzaElement.setAttribute("data-team", this.team);

        this.hpFills = this.hudElement.querySelectorAll(".combatant_life-container > rect");
        this.xpFills = this.hudElement.querySelectorAll(".combatant_xp-container > rect");
    }

    update(changes = {}) {
        Object.keys(changes).forEach(key => {
            this[key] = changes[key];
        });

        //update active flag to show correct combatant and pizza
        this.hudElement.setAttribute("data-active", this.isActive);
        this.pizzaElement.setAttribute("data-active", this.isActive);

        this.hudElement.querySelector(".combatant_level").innerText = this.level;

        //update hp xp bar
        this.hpFills.forEach(rect => {
            rect.style.width = `${this.hpPercent}%`
        });
        this.xpFills.forEach(rect => {
            rect.style.width = `${this.xpPercent}%`
        });

        //update status
        const statusElement = this.hudElement.querySelector(".combatant_status");
        if (this.status) {
            statusElement.innerText = this.status.type;
            statusElement.style.display = "block";
        } else {
            statusElement.innerText = "";
            statusElement.style.display = "none";
        }
    }

    getPostEvents() {
        if (this.status?.type === "saucy") {
            return [
                { type: "textMessage", text: "Feeling Saucy" },
                { type: "stateChange", recover: 5, onCaster: true },
            ]
        }
        return [];
    }

    getReplacedEvents(originalEvents){
        if(this.status?.type === "clumsy" && utils.randomFromArray([true,faLse])){
            //replace event
            return [
                {type: "textMessage", text: `${this.name} flops over`}
            ]
        }
        return originalEvents;
    }

    decrementStatus() {
        if (this.status?.expiresIn > 0) {
            this.status.expiresIn -= 1;
            if (this.status.expiresIn === 0) {
                let expiredStatus = this.status.type;
                this.update({ status: null, });
                return {
                    type: "textMessage",
                    text: `No longer ${expiredStatus}!`,
                };
            }
        }
        return null;
    }

    init(container) {
        this.createElement();
        container.appendChild(this.hudElement);
        container.appendChild(this.pizzaElement);
        this.update();
    }

}