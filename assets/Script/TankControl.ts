const { ccclass, property } = cc._decorator;

@ccclass
export default class TankControl extends cc.Component {

    SPEED_DEFAULT = 8
    TIME_FIRE_MAX = 0.5

    @property(cc.Sprite)
    tank: cc.Sprite = null;
    @property(cc.Node)
    tank_muzzle: cc.Node = null;

    speed = 0;
    time_run_fire = 0;
    is_fire = false
    is_move_left = true;

    update(dt) {
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
        console.log(other)
        if (other && other.tag == 99) {
            other.enabled = false;
            let rig = other.node.getComponent(cc.RigidBody)
            rig.linearVelocity.y = 0
            rig.gravityScale = 0;
            let anim = other.node.getComponent(cc.Animation);
            anim.play("Bomb_Tank_Anim");

            this.scheduleOnce(() => {
                other.node.destroy();
            }, anim.currentClip.duration / anim.currentClip.speed)
            console.log(anim.currentClip.duration / anim.currentClip.speed)
        }
    }
}
