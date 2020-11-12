let currentWatcher = null

class Watcher {
    context: Vue
    cb: Function

    constructor(context: Vue, target: string, cb: Function) {
        this.context = context
        this.cb = cb

        currentWatcher = this
        // 理论上任意形式的访问就会建立关系，这里用于最直观的演示
        let value = context[target]
        currentWatcher = null
    }

    /**
     * 当观察目标发生变化时，以这个方法作为响应
     * 或者说被观察目标调用该方法来实现通知
     */
    update() {
        // 先不去考虑其他参数，展示最最简单的格式
        this.cb.call(this.context)
    }
}

interface SimpleVueOptions {
    data: () => { [key: string]: any },
    watch: { [key: string]: (newValue?: any, oldValue?: any) => void }
}

// 用一个全局变量当做记录订阅者的容器
// Watcher作为观察者，是一对多的关系
// map的key是观察对象的标识，value是观察者的集合
const WatcherMap = new Map<string, Watcher[]>()

export default class Vue {
    constructor(options: SimpleVueOptions) {
        let state = options.data()
        Object.keys(state).forEach(key => {
            Object.defineProperty(this, key, {
                get() {
                    let ws = WatcherMap.get(key)
                    if(ws && currentWatcher) ws.push(currentWatcher)
                    return state[key]
                },
                set(v: any) {
                    state[key] = v
                    // 通知观察这个key的watcher，watcher响应目标变化的动作是update这个不能忘记
                    let ws = WatcherMap.get(key)
                    ws && ws.forEach(watcher => watcher.update())
                }
            })
        })

        let keys = Object.keys(options.watch)

        keys.forEach(key => {
            new Watcher(this, key, options.watch[key])
        })
    }
}
