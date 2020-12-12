/**
 * 一些工具函数
 */

export function isArray(val: any): val is Array<any> {
  return Array.isArray(val);
}

export function isObject(val: any): val is Object {
  return val !== null && typeof val === "object" && !isArray(val);
}

/**
 * 判断v是否为未定义或者空指针
 * @param v
 */
export function isUndef(v) {
  return v === undefined || v === null;
}

/**
 * 判断value是否为基本类型数据
 * @param value
 */
export function isPrimitive(value: any) {
  return (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  );
}

/**
 * 判断是否为一个有效的数组下标
 * 1. 大于等于0
 * 2. 是个数字，且不是小数
 * 3. 是个有限值
 * @param index
 */
export function isValidArrayIndex(index: any): index is number {
  let n = parseFloat(String(index));
  return n >= 0 && Math.floor(n) === n && isFinite(n);
}
