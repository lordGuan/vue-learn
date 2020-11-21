import Watcher, {WatchHandler, WatchOptions, WatchOptionsWithHandler} from "../observer/watcher";
import {noop} from "../common/constant";
import {observe} from "../observer";


interface SimpleVueOptions {
    data: () => { [key: string]: any },
    watch?: { [key: string]: WatchHandler | WatchOptionsWithHandler }
    computed?: { [key: string]: Function },
    mounted?: Function
}

/**
 * 模拟Vue实例，为了演示Watcher的工作，只实现data属性和watch属性的处理
 */
export default class Vue {
    [x: string]: any;
    $options: SimpleVueOptions
    _data: { [key: string]: any }

    constructor(options: SimpleVueOptions) {
        this.$options = options

        this.initData()
        this.initComputed()
        this.initWatch()
    }

    /**
     * 模拟初始化data部分
     */
    initData() {
        let data = this._data = this.$options.data()

        // 获取state的key
        let keys = Object.keys(data)

        // Vue实例上将状态的访问交给_data，真正可观察的是_data
        keys.forEach(key => {
            Object.defineProperty(this, key, {
                get() {
                    return data[key]
                },
                set(v: any) {
                    data[key] = v
                }
            })
        })

        observe(data)
    }

    /**
     * 处理options中的watch部分
     */
    initWatch() {
        let watches = this.$options.watch
        if (!watches) return
        let keys = Object.keys(watches)

        keys.forEach(key => {
            // 如果是对象式配置
            let option = watches[key]
            if (option !== null && typeof option === 'object') {
                this.$watch(key, option.handler, {deep: option.deep})
            }

            if (option instanceof Function) {
                this.$watch(key, option)
            }
        })
    }

    /**
     * 处理options中的computed部分
     */
    initComputed() {
        let computed = this.$options.computed

        if (!computed) return

        for (let key in computed) {
            const fn = computed[key]
            const computedWatcher = new Watcher(this, fn, noop)
            Object.defineProperty(this, key, {
                get() {
                    Watcher.target && computedWatcher.addWatcher(Watcher.target)
                    return computedWatcher.get()
                }
            })
        }
    }

    /**
     * 模拟挂载组件，这里只是为了触发hook
     */
    $mount() {
        const mounted = this.$options.mounted
        if (mounted) {
            mounted.call(this)
        }
    }

    $watch(expOrFn: string | Function, cb: Function, options?: WatchOptions) {
        new Watcher(this, expOrFn, cb, options)
    }
}
