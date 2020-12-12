/**
 * 可被观察的对象，也就是Watcher的目标
 *  为了解决$data的问题，也就是Vue实例的数据源问题
 *  同时处理引用类型的数据字段和数组类型的数据字段
 */
import Dep from "./dep";
import { isArray, isObject } from "../util";

export function observe(value: any) {
  const dep = new Dep();
  if (isObject(value) || isArray(value)) {
    Object.defineProperty(value, "__ob__", {
      enumerable: false,
      value: dep,
      writable: true,
      configurable: true,
    });
  }
  _observe(value);

  return dep;
}

function _observe(value: any) {
  if (isArray(value)) {
    observeArray(value);
  }
  if (isObject(value)) {
    observeObject(value);
  }
}

function observeObject(value: any) {
  const keys = Object.keys(value);

  keys.forEach((key) => {
    defineProperty(value, key, value[key]);
  });
}

function observeArray(value: any[]) {
  ["push", "pop", "splice", "shift", "unshift", "sort"].forEach((method) => {
    const oldMethod = Array.prototype[method];
    Object.defineProperty(value, method, {
      value: function (...args) {
        const dep: Dep = this.__ob__;
        oldMethod.apply(this, args);
        dep.notify();
      },
    });
  });
}

export function defineProperty(target, key, val) {
  let dep = new Dep();
  let ob = observe(val);
  Object.defineProperty(target, key, {
    get() {
      // 有观察者
      dep.depend();
      if (ob) {
        ob.depend();
      }
      return val;
    },
    set(v) {
      val = v;
      dep.notify();
    },
  });
}
