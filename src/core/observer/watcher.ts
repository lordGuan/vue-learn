import {popTarget, pushTarget} from "./dep";
import Vue from "../instance";

/**
 * 仿写并分析Vue中Watcher的工作方式
 */
export default class Watcher {
    vm: Vue
    cb: Function
    expOrFn: string
    value: any

    /**
     * 白话描述：观察vm上的expOrFn（先考虑字段），当其发生变化时，在vm上下文执行cb
     * vm.expOrFn一定是个可被观察的，即一个订阅源
     * @param vm
     * @param expOrFn
     * @param cb
     */
    constructor(vm: Vue, expOrFn: string, cb: Function) {
        this.vm = vm
        this.expOrFn = expOrFn
        this.cb = cb

        // 已知对vm.expOrFn进行求值相当于一个订阅
        // 先把自身记录在一个全局的范围内，标记自己是正在求值的观察者
        pushTarget(this)
        this.value = this.vm[expOrFn]
        popTarget()
    }

    /**
     * 已知Watcher作为订阅者时，响应动作为update
     * 观察到目标发生了变化，按照职责，应当触发cb
     */
    update() {
        // 取得观察目标的新值
        const value = this.vm[this.expOrFn]

        // 更新值
        const oldValue = this.value
        this.value = value

        // 触发cb
        this.cb.call(this.vm, value, oldValue)
    }
}
