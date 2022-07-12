const { ccclass, property } = cc._decorator;

@ccclass
export default class Ground extends cc.Component {

    start() {

    }

    onBeginContact(contact, selfCollider, other: cc.PhysicsBoxCollider) {
        if (other && other.tag == 99) {
            other.enabled = false;
            let rig = other.node.getComponent(cc.RigidBody)
            rig.linearVelocity.y = 0
            rig.gravityScale = 0;
            let anim = other.node.getComponent(cc.Animation);
            anim.play("Bomb_Ground_Anim")
            this.scheduleOnce(() => {
                if (other)
                    other.node.destroy();
            }, anim.currentClip.duration / anim.currentClip.speed)
        }
    }
}
