const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    Bomb_Prefab: cc.Prefab = null

    // onLoad () {}

    start() {

    }

    // update (dt) {}
}
