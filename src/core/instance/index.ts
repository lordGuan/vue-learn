import Watcher, {
  WatchHandler,
  WatchOptions,
  WatchOptionsWithHandler,
} from "../observer/watcher";
import { noop } from "../common/constant";
import { observe, defineProperty } from "../observer";
import Dep from "../observer/dep";
import {
  isArray,
  isPrimitive,
  isUndef,
  isValidArrayIndex,
} from "../util";

interface SimpleVueOptions {
  data: () => { [key: string]: any };
  watch?: { [key: string]: WatchHandler | WatchOptionsWithHandler };
  computed?: { [key: string]: Function };
  mounted?: Function;
}

/**
 * 模拟Vue实例，为了演示Watcher的工作，只实现data属性和watch属性的处理
 */
export default class Vue {
  [x: string]: any;

  $options: SimpleVueOptions;
  _data: { [key: string]: any };

  constructor(options: SimpleVueOptions) {
    this.$options = options;

    this.initData();
    this.initComputed();
    this.initWatch();
  }

  /**
   * 模拟初始化data部分
   */
  initData() {
    let data = (this._data = this.$options.data());

    // 获取state的key
    let keys = Object.keys(data);

    // Vue实例上将状态的访问交给_data，真正可观察的是_data
    keys.forEach((key) => {
      Object.defineProperty(this, key, {
        get() {
          return data[key];
        },
        set(v: any) {
          data[key] = v;
        },
      });
    });

    observe(data);
  }

  /**
   * 处理options中的watch部分
   */
  initWatch() {
    let watches = this.$options.watch;
    if (!watches) return;
    let keys = Object.keys(watches);

    keys.forEach((key) => {
      // 如果是对象式配置
      let option = watches[key];
      if (option !== null && typeof option === "object") {
        this.$watch(key, option.handler, { deep: option.deep });
      }

      if (option instanceof Function) {
        this.$watch(key, option);
      }
    });
  }

  /**
   * 处理options中的computed部分
   */
  initComputed() {
    let computed = this.$options.computed;

    if (!computed) return;

    for (let key in computed) {
      const fn = computed[key];
      const computedWatcher = new Watcher(this, fn, noop);
      Object.defineProperty(this, key, {
        get() {
          if (Dep.target) {
            computedWatcher.depend();
          }
          return computedWatcher.value;
        },
      });
    }
  }

  /**
   * 模拟挂载组件，这里只是为了触发hook
   */
  $mount() {
    const mounted = this.$options.mounted;
    if (mounted) {
      mounted.call(this);
    }
  }

  $watch(
    expOrFn: string | Function,
    cb: Function,
    options?: WatchOptions
  ): Function {
    const watcher = new Watcher(this, expOrFn, cb, options);

    return function unwatch() {
      // 取消观察关系
      watcher.teardown();
    };
  }

  static set<T>(
    target: Array<any> | object,
    property: string | number,
    value: T
  ): T {
    // 排除无法处理的target
    // 原始类型都无法处理
    if (isUndef(target) || isPrimitive(target)) {
      return value;
    }

    // 数组的话按下标进行修改，直接使用数组变异方法触发更新即可
    // 这里假设property传参正常
    if (isArray(target) && isValidArrayIndex(property)) {
      // 更新length
      target.length = Math.max(target.length, property);
      target.splice(property, 1, value);
      return;
    }

    // 判断属性是不是已存在
    // 如果已存在，直接赋值就好，如果target是可观察的，就是普通的赋值
    // 如果target是普通的对象，也不需要做额外的处理
    if (property in target) {
      target[property] = value;
      return value;
    }

    const ob = (target as any).__ob__;
    if (!ob) {
      // 如果不是可观察数据集合，不具有响应式特征，不需要处理
      target[property] = value;
      return value;
    }

    // 追加一个响应式属性
    defineProperty(target, property, value);
    ob.notify();
    return value;
  }
}
