const { ccclass, property } = cc._decorator;

@ccclass
export default class BulletControl extends cc.Component {

    @property(cc.Prefab)
    BombA: cc.Prefab = null

    onBeginContact(contact, selfCollider, other: cc.PhysicsBoxCollider) {
        if (other.tag == 99) {
            other.enabled = false;
            let pos = other.node.position
            other.node.destroy()
            selfCollider.node.destroy()
            let bombA = cc.instantiate(this.BombA)
            bombA.parent = other.node.parent
            bombA.angle = Math.random() * 180
            let anim = bombA.getComponent(cc.Animation);
            bombA.setPosition(pos)
            anim.play("Bomb_Shot_Anim");
            this.scheduleOnce(() => {
                bombA.destroy();
            }, anim.currentClip.duration / anim.currentClip.speed)
        }
        // if (other.tag == 98) {
        //     other.enabled = false;
        //     let pos = other.node.position
        //     other.node.destroy()
        //     selfCollider.node.destroy()
        //     let bombA = cc.instantiate(this.BombA)
        //     bombA.parent = other.node.parent
        //     bombA.angle = Math.random() * 180
        //     let anim = bombA.getComponent(cc.Animation);
        //     bombA.setPosition(pos)
        //     anim.play("Aircraft_Destroy_Anim");
        //     this.scheduleOnce(() => {
        //         bombA.destroy();
        //     }, anim.currentClip.duration / anim.currentClip.speed)
        // }
    }
}
