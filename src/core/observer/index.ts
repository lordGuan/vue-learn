/**
 * 可被观察的对象，也就是Watcher的目标
 *  为了解决$data的问题，也就是Vue实例的数据源问题
 *  同时处理引用类型的数据字段和数组类型的数据字段
 */
import Dep from "./dep"

export function observe(value: any) {
    if (Array.isArray(value)) {
        observeArray(value)
    } else if (typeof value === 'object' && value !== null) {
        observeObject(value)
    }
}


function observeObject(value: any) {
    const keys = Object.keys(value)

    keys.forEach(key => {
        let val = value[key]
        defineProperty(value, key, val)
        observe(val)
    })
}

function observeArray(value: any[]) {
    const oldPush = Array.prototype.push
    Object.defineProperty(value, 'push', {
        value: function (...args) {
            const dep: Dep = this['watchers']
            oldPush.apply(this, args)
            dep.notify()
        }
    })
    for (let i = 0; i < value.length; i++) {
        let val = value[i]
        defineProperty(value, i, val)
        observe(val)
    }
}

function defineProperty(target, key, val) {
    let dep = new Dep()
    if (Array.isArray(val)) val['watchers'] = dep
    Object.defineProperty(target, key, {
        get() {
            // 有观察者
            dep.depend()
            return val
        },
        set(v) {
            val = v
            dep.notify()
        }
    })
}

