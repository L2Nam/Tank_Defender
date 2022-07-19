import MainControl, { GameStatus } from "./MainControl";
const { ccclass, property } = cc._decorator;

@ccclass
export default class TankControl extends cc.Component {

    mainControl: MainControl = null;

    SPEED_DEFAULT = 8
    TIME_FIRE_MAX = 0.4

    @property(cc.Sprite)
    tank: cc.Sprite = null
    @property(cc.Node)
    tank_muzzle: cc.Node = null
    @property(cc.Prefab)
    BombA: cc.Prefab = null

    @property(cc.Prefab)
    bulletPrefab: cc.Prefab = null
    @property(cc.Node)
    parentBullet: cc.Node = null
    @property(cc.Node)
    posBullet: cc.Node = null

    @property(cc.Animation)
    animation: cc.Animation = null

    life = 3;
    speed = 0;
    time_run_fire = 0;
    is_fire = false
    is_move_left = true;

    onLoad() {
        this.mainControl = cc.Canvas.instance.node.getComponent("MainControl");
        cc.log('hhhhhhhh', cc.winSize);
        this.node.width = cc.winSize.width
        this.node.height = cc.winSize.height
    }

    update(dt) {
        if (this.mainControl.gameStatus != GameStatus.Game_Playing) {
            return;
        }
        if (this.node.x <= -900)
            this.node.x = -900;
        if (this.node.x >= 900)
            this.node.x = 900

        if (this.is_move_left) {
            this.node.x -= this.speed;
        }
        else {
            this.node.x += this.speed;
        }
        if (this.life <= 0) {
            this.mainControl.gameOver()
        }

        if (this.is_fire) {
            this.time_run_fire += dt;
            if (this.time_run_fire >= this.TIME_FIRE_MAX) {
                this.time_run_fire = 0;
                // make_bullet
                let bullet = cc.instantiate(this.bulletPrefab)
                bullet.parent = this.parentBullet;
                bullet.angle = this.tank_muzzle.angle;
                let posW = this.parentBullet.convertToNodeSpaceAR(this.tank_muzzle.convertToWorldSpaceAR(this.posBullet.position))
                bullet.position = posW;
                const radians = (bullet.angle + 90) * Math.PI / 180;
                const ball_speed = 1300
                bullet.getComponent(cc.RigidBody).linearVelocity = cc.v2(Math.sin(radians) * ball_speed, Math.abs(Math.cos(radians) * ball_speed));
            }
        }
    }


    setMoveLeft(isLeft) {
        this.tank.node.scaleX = isLeft ? -1 : 1;
        this.is_move_left = isLeft;
        this.speed = this.SPEED_DEFAULT;
    }

    setStopMove() {
        this.speed = 0;
    }

    setFire(angel) {
        this.tank_muzzle.angle = angel;
        if (!this.is_fire) {
            this.time_run_fire = this.TIME_FIRE_MAX;
        }
        this.is_fire = true
    }

    setStopFire() {
        this.is_fire = false
        this.time_run_fire = 0;
    }

    onBeginContact(contact, selfCollider, other: cc.PhysicsBoxCollider) {
        if (other.tag == 99) {
            this.life--;
            console.log(this.life)
            other.enabled = false;
            let pos = other.node.position
            other.node.destroy();
            let bombA = cc.instantiate(this.BombA)
            bombA.parent = other.node.parent
            bombA.angle = Math.random() * 180
            let anim = bombA.getComponent(cc.Animation);
            bombA.setPosition(pos)
            anim.play("Bomb_Tank_Anim");
            this.scheduleOnce(() => {
                bombA.destroy();
            }, anim.currentClip.duration / anim.currentClip.speed)
        }
    }

    resetToDefault() {
        this.node.active = true;
        this.tank_muzzle.active = true
        this.animation.play("Tank_Anim")
        this.life = 3;
        this.speed = 0;
        this.time_run_fire = 0;
        this.is_fire = false
        this.is_move_left = true;
    }

    setDie() {

        this.speed = 0;
        this.tank_muzzle.active = false
        this.animation.play("Tank_Die_Anim")
        this.scheduleOnce(() => {
            this.node.active = false
        }, 1)
    }
}
