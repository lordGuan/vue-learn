import {isArray, isObject} from "../util";

const unique = new Set()

/**
 * 遍历访问数组或对象
 * @param val
 */
export function traverse(val: any) {
    _traverse(val)
    // 递归完了要清空
    unique.clear()
}

/**
 * 递归操作
 * @param val
 */
function _traverse(val) {
    if (isArray(val)) {
        for (let i = 0; i < val.length; i++) {
            const child = val[i]

            if (!unique.has(child)) {
                unique.add(child)
                _traverse(child)
            }
        }
    } else if (isObject(val)) {
        Object.keys(val).forEach(key => {
            const child = val[key]

            if (!unique.has(child)) {
                unique.add(child)
                _traverse(child)
            }
        })
    }
}