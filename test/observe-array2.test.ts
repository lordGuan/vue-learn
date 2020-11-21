import Vue from '../src/core/instance'

describe("测试：引用类型数据内容被修改时，watch被触发", () => {
    const v = new Vue({
        data() {
            return {
                obj: {
                    name: 'obj',
                    address: {
                        street: 'St.V',
                        no: '117'
                    },
                    keys: [1, 9, 21]
                },
                objWatchCount: 0,
                array: [
                    1,
                    {
                        id: 2
                    },
                    [3, 10]
                ],
                arrayWatchCount: 0
            }
        },
        watch: {
            obj: {
                handler() {
                    this.objWatchCount++
                },
                deep: true
            },
            array: {
                handler() {
                    this.arrayWatchCount++
                },
                deep: true
            },
        }
    })


    test('Obj nasted', () => {
        v.obj.name = 'newObj'
        v.obj.address.no = '200'
        v.obj.address = {
            street: 'St.V',
            no: '118'
        }
        expect(v.objWatchCount).toBe(3)
    })

    test('array nasted', () => {
        v.array[0] = 99
        v.array[1].id = 99
        v.array[2][0] = 99
        expect(v.arrayWatchCount).toBe(3)
        expect(v.array[0]).toBe(99)
        expect(v.array[1].id).toBe(99)
        expect(v.array[2][0]).toBe(99)
    })

})