/**
 * 一些工具函数
 */

export function isArray(val: any): val is Array<any> {
    return Array.isArray(val)
}

export function isObject(val: any): val is Object {
    return val !== null && typeof val === 'object' && !isArray(val)
}