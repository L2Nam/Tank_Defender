const { ccclass, property } = cc._decorator;

@ccclass
export default class Joystick extends cc.Component {

    @property(cc.Node)
    Stick: cc.Node = null;

    max_R = 0;
    dir: cc.Vec2 = cc.Vec2.ZERO

    callback_start = null
    callback_end = null

    onLoad() {
        this.max_R = this.node.width / 2 - 20

        this.Stick.setPosition(cc.Vec2.ZERO);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.Stick_move, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.Stick_end, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.Stick_end, this);
    }

    Stick_move(event: cc.Touch) {
        const screen_pos = event.getLocation();
        const pos = this.node.convertToNodeSpaceAR(screen_pos);
        const len = pos.mag()
        if (len <= 0) {
            this.Stick.setPosition(pos)
            return
        }
        this.dir.x = pos.x / len
        this.dir.y = pos.y / len


        if (len > this.max_R) {
            pos.x = this.max_R * pos.x / len;
            pos.y = this.max_R * pos.y / len;
        }
        this.Stick.setPosition(pos);

        let angel = Math.atan2(this.dir.y, this.dir.x) * 180 / Math.PI;
        if (angel >= -90 && angel <= -10)
            angel = -10;
        if (angel >= -170 && angel < -90)
            angel = -170;
        if (this.callback_start) this.callback_start(angel);
    }

    Stick_end(event: cc.Touch) {
        this.Stick.setPosition(cc.v2(0, 0));
        if (this.callback_end) this.callback_end();
    }

    setCallback(_callback_start, _callback_end) {
        this.callback_start = _callback_start;
        this.callback_end = _callback_end;
    }
}
