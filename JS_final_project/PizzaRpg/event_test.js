class OverworldEvent {
    constructor({ map, event }) {
        this.map = map;
        this.event = event;
    }

    stand(resolve) {
        const who = this.map.gameObjects[this.event.who] //this.event.who ->　obj.id
        who.startBehavior({     //startBehavior(state, behavior)
            map: this.map
        }, {
            type: "stand",
            direction: this.event.direction,
            time: this.event.time,
        })

        //set up a handler to complete when correct person is done walking then resolve the event
        const completeHandler = e =>{
            if (e.detail.whoId === this.event.who){
                document.removeEventListener("PersonStandComplete", completeHandler);
                resolve();
            }
        }

        document.addEventListener("PersonStandComplete", completeHandler);
    }

    walk(resolve) {
        const who = this.map.gameObjects[this.event.who] //this.event.who ->　obj.id
        who.startBehavior({     //startBehavior(state, behavior)
            map: this.map
        }, {
            type: "walk",
            direction: this.event.direction,
            retry: true,
        })

        //set up a handler to complete when correct person is done walking then resolve the event
        const completeHandler = e =>{
            if (e.detail.whoId === this.event.who){
                document.removeEventListener("PersonWalkingComplete", completeHandler);
                resolve();
            }
        }

        document.addEventListener("PersonWalkingComplete", completeHandler);
    }

    init() {
        console.log("OverworldEvent init");
        return new Promise(resolve => {
            this[this.event.type](resolve)  //this.event.type -> "walk", "stand"
        })
    }
}