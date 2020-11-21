import Vue from "../instance";
import {noop} from "../common/constant";
import {traverse} from "./traverse";

export interface WatchOptions {
    deep: boolean
}

export interface WatchHandler {
    (newValue?: any, oldValue?: any): void
}

export interface WatchOptionsWithHandler extends WatchOptions {
    handler: WatchHandler,
}

/**
 * 记录正在求值的观察者
 * @param target
 */
export function pushTarget(target: Watcher) {
    Watcher.target = target
}

export function popTarget() {
    Watcher.target = null
}

/**
 * 仿写并分析Vue中Watcher的工作方式
 */
export default class Watcher {
    vm: Vue
    cb: Function
    expOrFn: string | Function
    value: any
    getter: Function
    watchers: Watcher[]
    deep: boolean
    static target: Watcher

    /**
     * 白话描述：观察vm上的expOrFn（先考虑字段），当其发生变化时，在vm上下文执行cb
     * vm.expOrFn一定是个可被观察的，即一个订阅源
     * @param vm
     * @param expOrFn
     * @param cb
     * @param options
     */
    constructor(vm: Vue, expOrFn: string | Function, cb: Function, options?: WatchOptions) {
        this.vm = vm
        this.expOrFn = expOrFn
        this.cb = cb
        this.watchers = []
        if (options) {
            this.deep = !!options.deep
        } else {
            this.deep = false
        }

        // 将要观察的目标，不管是单一属性，还是计算过程（相当于一组属性）
        // 统一化保存起来
        if (typeof expOrFn === 'string') {
            // 将观察单一属性的要求，也转换成一个计算过程
            this.getter = function () {
                return this[expOrFn]
            }
        }

        if (typeof expOrFn === 'function') {
            this.getter = expOrFn
        }

        // 兜底
        if (!this.getter) {
            this.getter = noop
        }

        // 已知对vm.expOrFn进行求值相当于一个订阅
        // 先把自身记录在一个全局的范围内，标记自己是正在求值的观察者
        pushTarget(this)
        this.value = this.get()
        popTarget()
    }

    /**
     * 已知Watcher作为订阅者时，响应动作为update
     * 观察到目标发生了变化，按照职责，应当触发cb
     */
    update() {
        // 取得观察目标的新值
        const newValue = this.get()

        // 更新值
        const oldValue = this.value
        this.value = newValue

        // 考虑deep
        if (newValue !== oldValue || this.deep) {
            // 仅在结果发生变化时触发cb，减少不必要的动作
            this.cb.call(this.vm, newValue, oldValue)
        }
    }

    /**
     * 求观察目标的值
     * 由于已经将expOrFn转化成统一的形式，这里只需要合理的call一下
     */
    get() {
        let value = this.getter.call(this.vm)
        if (this.deep) {
            // 遍历这个value，普通类型就无所谓了
            // 数组是循环，对象
            traverse(value)
        }
        return value
    }

    addWatcher(watcher: Watcher) {
        this.watchers.push(watcher)
    }
}
