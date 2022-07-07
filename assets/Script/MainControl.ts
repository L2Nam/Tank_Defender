import Joystick from "./Joystick";
import TankControl from "./TankControl";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MainControl extends cc.Component {

    @property(TankControl)
    tank: TankControl = null;
    @property(Joystick)
    joyStick: Joystick = null

    Smoke_speed = 5;
    @property(cc.Sprite)
    spSmoke: cc.Sprite[] = [null, null];

    Cloud_speed = 3;
    @property(cc.Sprite)
    spCloud: cc.Sprite[] = [null, null, null];

    Button_Right: cc.Button = null;
    Button_Left: cc.Button = null;

    max_alti = 500
    min_alti = 200
    max_x = 6000
    min_x = 1500
    min_speed = 3
    max_speed = 10
    Air_speed = []
    Air_alti = []
    is_down = []
    is_right = []
    time = []
    time_bomb = 3

    @property([cc.Prefab])
    Aircraft_Prefab: cc.Prefab[] = []
    Aircraft: cc.Node[] = []

    @property(cc.Prefab)
    Bomb_Prefab: cc.Prefab = null

    // Bomb
    // pos: cc.Vec2[] = []
    // bomb: cc.Node[] = []
    // throw_bomb() {
    //     for (let i = 0; i < this.Aircraft_Prefab.length; i++) {
    //         this.bomb[i] = cc.instantiate(this.Bomb_Prefab)
    //         this.bomb[i].parent = this.node
    //         this.pos[i] = this.Aircraft[i].getPosition()
    //         this.pos[i].y -= 70
    //         this.bomb[i].setPosition(this.pos[i])
    //     }
    // }


    onLoad() {
        cc.director.getPhysicsManager().enabled = true;

        this.Button_Right = this.node.getChildByName("Button_Right").getComponent(cc.Button);
        this.Button_Left = this.node.getChildByName("Button_Left").getComponent(cc.Button);

        this.Button_Right.node.on(cc.Node.EventType.TOUCH_START, this.touchStartBR, this);
        this.Button_Left.node.on(cc.Node.EventType.TOUCH_START, this.touchStartBL, this);
        this.Button_Right.node.on(cc.Node.EventType.TOUCH_END, this.touchEndBR, this);
        this.Button_Left.node.on(cc.Node.EventType.TOUCH_END, this.touchEndBL, this);
        this.Button_Right.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEndBR, this);
        this.Button_Left.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEndBL, this);

        this.joyStick.setCallback(this.joyStickCallbackStart.bind(this), this.joyStickCallbackEnd.bind(this));
    }

    start() {
        // Cloud
        for (let i = 0; i < this.spCloud.length; i++) {
            this.spCloud[i].node.x = 1500 + 1500 * i;
            var maxY_Cloud = 600
            var minY_Cloud = 400
            this.spCloud[i].node.y = 400 + Math.random() * (maxY_Cloud - minY_Cloud)
        }

        // Aircraft
        for (let i = 0; i < this.Aircraft_Prefab.length; i++) {
            this.Aircraft[i] = cc.instantiate(this.Aircraft_Prefab[i]);
            this.node.addChild(this.Aircraft[i])
            this.Air_alti[i] = Math.random() * (this.max_alti - this.min_alti) + this.min_alti
            this.Aircraft[i].y = this.Air_alti[i];
            this.is_down[i] = Math.random() < 0.5 ? true : false
            this.is_right[i] = Math.random() < 0.5 ? true : false
            this.Air_speed[i] = this.min_speed + Math.random() * (this.max_speed - this.min_speed)
            if (this.is_right[i]) {
                this.Aircraft[i].x = this.min_x + Math.random() * (this.max_x - this.min_x)
            }
            else {
                this.Aircraft[i].x = -this.min_x - Math.random() * (this.max_x - this.min_x)
            }
            this.time[i] = 0 + i * 0.3;
        }
    }

    update(dt) {

        // Tank_smoke
        for (let i = 0; i < this.spSmoke.length; i++) {
            this.spSmoke[i].node.x -= this.Smoke_speed;
            if (this.spSmoke[i].node.x <= -2000) {
                this.spSmoke[i].node.x = 2000;
            }
        }

        // Cloud
        for (let i = 0; i < this.spCloud.length; i++) {
            this.spCloud[i].node.x -= this.Cloud_speed;
            if (this.spCloud[i].node.x <= -1000) {
                this.spCloud[i].node.x = 3500;
                var maxY_Cloud = 600
                var minY_Cloud = 400
                this.spCloud[i].node.y = 400 + Math.random() * (maxY_Cloud - minY_Cloud)
            }
        }

        // Aircraft
        for (let i = 0; i < this.Aircraft_Prefab.length; i++) {
            this.time[i] += dt
            if (this.is_right[i]) {
                this.Aircraft[i].scaleX = 1;
                this.Aircraft[i].x -= this.Air_speed[i];
                if (this.Aircraft[i].x <= -1500) {
                    this.is_right[i] = Math.random() < 0.5 ? true : false
                    this.Air_speed[i] = this.min_speed + Math.random() * (this.max_speed - this.min_speed)
                    if (this.is_right[i]) {
                        this.Aircraft[i].x = this.min_x + Math.random() * (this.max_x - this.min_x)
                    }
                    else {
                        this.Aircraft[i].x = -this.min_x - Math.random() * (this.max_x - this.min_x)
                    }
                }
            }
            else {
                this.Aircraft[i].scaleX = -1;
                this.Aircraft[i].x += this.Air_speed[1];
                if (this.Aircraft[i].x >= 1500) {
                    this.is_right[i] = Math.random() < 0.5 ? true : false
                    this.Air_speed[i] = this.min_speed + Math.random() * (this.max_speed - this.min_speed)
                    if (this.is_right[i]) {
                        this.Aircraft[i].x = this.min_x + Math.random() * (this.max_x - this.min_x)
                    }
                    else {
                        this.Aircraft[i].x = -this.min_x - Math.random() * (this.max_x - this.min_x)
                    }
                }
            }
            if (Math.abs(this.Aircraft[i].y - this.Air_alti[i]) >= 100)
                this.is_down[i] = !this.is_down[i]
            if (this.is_down[i] == true)
                this.Aircraft[i].y -= 0.5;
            else
                this.Aircraft[i].y += 0.5;
            if (this.time[i] >= this.time_bomb) {
                this.time[i] = 0
                let bomb = cc.instantiate(this.Bomb_Prefab)
                bomb.parent = this.node
                let pos = this.Aircraft[i].getPosition()
                pos.y -= 70
                bomb.setPosition(pos)
            }
        }
    }

    touchStartBR() {
        this.tank.setMOveLeft(false)
    }

    touchStartBL() {
        this.tank.setMOveLeft(true)
    }


    touchEndBR() {
        this.tank.setStopMove();
    }

    touchEndBL() {
        this.tank.setStopMove();
    }

    joyStickCallbackStart(angel) {
        this.tank.setFire(angel);
    }

    joyStickCallbackEnd() {
        this.tank.setStopFire()
    }
}