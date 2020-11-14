import Watcher from "../observer/watcher";
import {noop} from "../common/constant";
import {observe} from "../observer";

interface SimpleVueOptions {
    data: () => { [key: string]: any },
    watch?: { [key: string]: (newValue?: any, oldValue?: any) => void }
    computed?: { [key: string]: Function }
}

/**
 * 模拟Vue实例，为了演示Watcher的工作，只实现data属性和watch属性的处理
 */
export default class Vue {
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
            new Watcher(this, key, watches[key])
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
}
