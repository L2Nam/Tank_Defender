const { ccclass, property } = cc._decorator;

@ccclass
export default class Aircraft extends cc.Component {

    @property(cc.Prefab)
    Prefab_Bomb: cc.Prefab = null

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
        if (this.is_right) {
            this.node.scaleX = 1;
            this.node.x -= this.Air_speed;
            if (this.node.x <= -1500) {
                this.is_right = Math.random() < 0.5 ? true : false
                this.Air_speed = this.min_speed + Math.random() * (this.max_speed - this.min_speed)
                if (this.is_right) {
                    this.node.x = this.min_x + Math.random() * (this.max_x - this.min_x)
                }
                else {
                    this.node.x = -this.min_x - Math.random() * (this.max_x - this.min_x)
                }
            }
        }
        else {
            this.node.scaleX = -1;
            this.node.x += this.Air_speed[1];
            if (this.node.x >= 1500) {
                this.is_right = Math.random() < 0.5 ? true : false
                this.Air_speed = this.min_speed + Math.random() * (this.max_speed - this.min_speed)
                if (this.is_right) {
                    this.node.x = this.min_x + Math.random() * (this.max_x - this.min_x)
                }
                else {
                    this.node.x = -this.min_x - Math.random() * (this.max_x - this.min_x)
                }
            }
        }
        if (Math.abs(this.node.y - this.Air_alti) >= 120)
            this.is_down = !this.is_down
        if (this.is_down == true)
            this.node.y -= 0.5;
        else
            this.node.y += 0.5;
        if (this.time >= this.time_bomb) {
            this.time = 0
            this.throw_bomb()
        }
    }

    throw_bomb() {
        let bomb = cc.instantiate(this.Prefab_Bomb)
        bomb.parent = this.node.parent
        let pos = this.node.getPosition()
        pos.y -= 70
        bomb.setPosition(pos)
    }
}