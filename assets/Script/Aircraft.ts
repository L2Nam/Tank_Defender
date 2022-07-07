const { ccclass, property } = cc._decorator;

@ccclass
export default class Aircraft extends cc.Component {

    @property(cc.Prefab)
    Bomb_Prefab: cc.Prefab = null

    max_alti = 500
    min_alti = 200
    max_x = 6000
    min_x = 1500
    min_speed = 3
    max_speed = 10
    Air_speed: number
    Air_alti: number
    is_down: boolean
    is_right: boolean
    time = 0
    time_bomb = 3

    // onLoad () {}

    start() {
        this.Air_alti = Math.random() * (this.max_alti - this.min_alti) + this.min_alti
        this.node.y = this.Air_alti;
        this.is_down = Math.random() < 0.5 ? true : false
        this.is_right = Math.random() < 0.5 ? true : false
        this.Air_speed = this.min_speed + Math.random() * (this.max_speed - this.min_speed)
        if (this.is_right) {
            this.node.x = this.min_x + Math.random() * (this.max_x - this.min_x)
        }
        else {
            this.node.x = -this.min_x - Math.random() * (this.max_x - this.min_x)
        }
    }

    update(dt) {
        this.time += dt
    }
}
