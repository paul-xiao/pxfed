/**
 * 
 * 发送给指定对象
 *   @param sendMsgs  发送记录
 *   @param receivedMsgs 接受记录
 * 发送给房间（群）
 *  
 */
class Test {
    constructor() {
        this.msgs = []
        this.init()
    }
    init() {
        this.add()
    }
    add() {
        this.msgs.push(1)
        console.log(this.msgs);
    }
    static test() {

    }
}
//果静态方法包含this关键字，这个this指的是类，而不是实例。
let a = new Test()
