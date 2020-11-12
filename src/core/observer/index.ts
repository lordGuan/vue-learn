/**
 * 可被观察的对象，也就是Watcher的目标
 *  为了解决$data的问题，也就是Vue实例的数据源问题
 *  同时处理引用类型的数据字段和数组类型的数据字段
 */
export default class Observer {
    value: any

    constructor(value: any) {
        this.value = value
    }
}
