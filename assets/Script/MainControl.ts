import Joystick from "./Joystick";
import TankControl from "./TankControl";

const { ccclass, property } = cc._decorator;

export enum GameStatus {
    Game_Ready = 0,
    Game_Pause,
    Game_Playing,
    Game_Over
}

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

    btnStart: cc.Button = null
    btnPause: cc.Button = null
    btnReturn: cc.Button = null
    game_logo: cc.Sprite = null
    sun_light: cc.Sprite = null
    game_over: cc.Sprite = null
    is_sun_light = true
    is_game_logo = true
    is_game_over = false
    scale_up = true
    gameStatus: GameStatus = GameStatus.Game_Ready;
    Infor: cc.Node = null

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

    tank_life: cc.Sprite[] = []

    @property([cc.Prefab])
    Aircraft_Prefab: cc.Prefab[] = []
    Aircraft: cc.Node[] = []

    @property(cc.Prefab)
    Bomb_Prefab: cc.Prefab = null

    onLoad() {
        cc.director.getPhysicsManager().enabled = true;
        var collisionManager = cc.director.getCollisionManager()
        collisionManager.enabled = true

        this.btnStart = this.node.getChildByName("Btn_Start").getComponent(cc.Button)
        this.btnPause = this.node.getChildByName("Btn_Pause").getComponent(cc.Button)
        this.btnReturn = this.node.getChildByName("Btn_Return").getComponent(cc.Button)
        this.btnStart.node.on(cc.Node.EventType.TOUCH_END, this.touchStartBtn, this)
        this.btnPause.node.on(cc.Node.EventType.TOUCH_END, this.touchPauseBtn, this)
        this.btnReturn.node.on(cc.Node.EventType.TOUCH_END, this.touchReturnBtn, this)
        this.game_logo = this.node.getChildByName("Game_Logo").getComponent(cc.Sprite)
        this.sun_light = this.node.getChildByName("Sun_Light").getComponent(cc.Sprite)
        this.game_over = this.node.getChildByName("GameOver").getComponent(cc.Sprite)
        this.Infor = this.node.getChildByName("Infor")
        this.tank_life[0] = this.Infor.getChildByName("x0").getComponent(cc.Sprite)
        this.tank_life[1] = this.Infor.getChildByName("x1").getComponent(cc.Sprite)
        this.tank_life[2] = this.Infor.getChildByName("x2").getComponent(cc.Sprite)
        this.tank_life[3] = this.Infor.getChildByName("x3").getComponent(cc.Sprite)
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

        if (this.is_sun_light) {
            this.sun_light.node.angle++;
            if (this.sun_light.node.angle >= 360)
                this.sun_light.node.angle = 0
        }

        if (this.is_game_logo) {
            if (this.scale_up && this.game_logo.node.scale <= 1.05) {
                this.game_logo.node.scale += 0.002
            }
            else this.scale_up = false
            if (!this.scale_up && this.game_logo.node.scale >= 1) {
                this.game_logo.node.scale -= 0.002
            }
            else this.scale_up = true
        }

        if (this.is_game_over) {
            if (this.scale_up && this.game_over.node.scale <= 1.2) {
                this.game_over.node.scale += 0.005
            }
            else this.scale_up = false
            if (!this.scale_up && this.game_over.node.scale >= 1) {
                this.game_over.node.scale -= 0.005
            }
            else this.scale_up = true
        }

        if (this.tank.life < 3) {
            this.tank_life[this.tank.life].node.active = true;
            this.tank_life[this.tank.life + 1].node.active = false;
        }

        if (this.tank.life == 0)
            this.Infor.opacity--

        // Smoke
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

        if (this.gameStatus != GameStatus.Game_Playing) {
            return;
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

    touchStartBtn() {
        this.btnStart.node.active = false
        this.game_logo.node.active = false
        this.sun_light.node.active = false
        this.is_sun_light = false
        this.is_game_logo = false

        this.Button_Right = this.node.getChildByName("Button_Right").getComponent(cc.Button);
        this.Button_Left = this.node.getChildByName("Button_Left").getComponent(cc.Button);
        this.Button_Right.node.active = true
        this.Button_Left.node.active = true
        this.joyStick.node.active = true
        this.Infor.active = true
        this.btnPause.node.active = true
        this.Button_Right.node.on(cc.Node.EventType.TOUCH_START, this.touchStartBR, this);
        this.Button_Left.node.on(cc.Node.EventType.TOUCH_START, this.touchStartBL, this);
        this.Button_Right.node.on(cc.Node.EventType.TOUCH_END, this.touchEndBR, this);
        this.Button_Left.node.on(cc.Node.EventType.TOUCH_END, this.touchEndBL, this);
        this.Button_Right.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEndBR, this);
        this.Button_Left.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEndBL, this);
        this.joyStick.setCallback(this.joyStickCallbackStart.bind(this), this.joyStickCallbackEnd.bind(this));
        this.gameStatus = GameStatus.Game_Playing
    }

    touchPauseBtn() {
        this.gameStatus = GameStatus.Game_Pause
        cc.director.getPhysicsManager().enabled = false
        this.btnReturn.node.active = true
        this.btnPause.node.active = false
    }

    touchReturnBtn() {
        this.gameStatus = GameStatus.Game_Playing
        cc.director.getPhysicsManager().enabled = true
        this.btnPause.node.active = true
        this.btnReturn.node.active = false
    }


    gameOver() {
        this.game_over.node.active = true
        this.gameStatus = GameStatus.Game_Over;
        this.is_game_over = true
        for (let i = 0; i < this.Aircraft_Prefab.length; i++) {
            this.Aircraft[i].destroy()
        }
        this.Button_Right.node.active = false
        this.Button_Left.node.active = false
        this.joyStick.node.active = false
        this.btnPause.node.active = false
        this.scheduleOnce(() => {
            this.Infor.active = false
        }, 2.5)
        let anim = this.tank.tank.node.getComponent(cc.Animation);
        this.tank.tank_muzzle.active = false
        anim.play("Tank_Die_Anim")
        this.scheduleOnce(() => {
            this.tank.node.active = false
        }, 1)
    }

    touchStartBR() {
        this.tank.setMoveLeft(false)
    }

    touchStartBL() {
        this.tank.setMoveLeft(true)
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