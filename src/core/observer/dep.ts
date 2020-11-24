/**
 * watcher实例观察vm.a时，在vm.a的get拦截中要获得watcher实例，
 * 只能通过全局访问域，或者静态变量来唯一标记
 */
import Watcher from "./watcher";

export default class Dep {
    static target: Watcher
    subs: Watcher[]

    constructor() {
        this.subs = []
    }

    /**
     * 保存观察者
     * @param sub
     */
    addSub(sub: Watcher) {
        this.subs.push(sub)
    }

    removeSub(sub: Watcher) {
        let index = this.subs.indexOf(sub)
        if (index > -1) {
            this.subs.splice(index, 1)
        }
    }

    depend() {
        if (Dep.target) {
            Dep.target.addDep(this)
        }
    }

    /**
     * 通知
     */
    notify() {
        this.subs.forEach(sub => {
            sub.update()
        })
    }
}

/**
 * 记录正在求值的观察者
 * @param target
 */
export function pushTarget(target: Watcher) {
    Dep.target = target
}

export function popTarget() {
    Dep.target = null
}
