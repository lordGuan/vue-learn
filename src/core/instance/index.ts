import Watcher from "../observer/watcher";
import Dep from "../observer/dep";

interface SimpleVueOptions {
    data: () => { [key: string]: any },
    watch: { [key: string]: (newValue?: any, oldValue?: any) => void }
}

const WatcherMap = new Map<string, Watcher[]>()

function bookWatcher(key) {
    let newWatcher = Dep.target
    let watchers = WatcherMap.get(key)

    if (!newWatcher) return

    if (watchers) {
        watchers.push(newWatcher)
    } else {
        WatcherMap.set(key, [newWatcher])
    }
}

function notifyWatchers(key) {
    let watchers = WatcherMap.get(key)
    if (watchers) {
        watchers.forEach(watcher => watcher.update())
    }
}

/**
 * 模拟Vue实例，为了演示Watcher的工作，只实现data属性和watch属性的处理
 */
export default class Vue {
    $options: SimpleVueOptions
    $data: { [key: string]: any }

    constructor(options: SimpleVueOptions) {
        this.$options = options

        this.initData()

        this.initWatch()
    }

    /**
     * 模拟初始化data部分
     */
    initData() {
        // 这里默认data属性是工厂函数
        let data = this.$options.data()

        // 这里相当于Vue源码中的_data，作为数据源头
        this.$data = data

        // 获取state的key
        let keys = Object.keys(data)

        // 实现vm.a，将data中的字段，映射到vm上
        // TODO 很明显，这样的写法只能处理原始类型值，数组和对象现在无法处理，Observer类将用于此处
        keys.forEach(key => {
            Object.defineProperty(this, key, {
                get() {
                    // Watcher实例watcher观察vm.a，理论上这里需要得到watcher实例
                    // 还需要一个订阅者列表来记录登记在Dep.target上的watcher
                    bookWatcher(key)
                    return this.$data[key]
                },
                set(v: any) {
                    this.$data[key] = v
                    // 通知观察这个key的watcher，watcher响应目标变化的动作是update这个不能忘记
                    notifyWatchers(key)
                }
            })
        })
    }

    /**
     * 处理options中的watch部分
     */
    initWatch() {
        let keys = Object.keys(this.$options.watch)

        keys.forEach(key => {
            new Watcher(this, key, this.$options.watch[key])
        })
    }
}
