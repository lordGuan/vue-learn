/**
 * watcher实例观察vm.a时，在vm.a的get拦截中要获得watcher实例，
 * 只能通过全局访问域，或者静态变量来唯一标记
 */
import Watcher from "./watcher";

export default class Dep {
    static target: Watcher
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
