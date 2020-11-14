import Vue from "../src/core/instance";

describe('对数组的可观察化处理', () => {
    const v = new Vue({
        data() {
            return {
                rooms: [
                    {
                        id: 1,
                        occupied: false
                    },
                    {
                        id: 2,
                        occupied: true
                    }
                ]
            }
        },
        computed: {
            canCheckIn() {
                return this.rooms.some(room => !room.occupied)
            }
        },
        watch: {
            canCheckIn(newValue, oldValue) {
                if (!newValue && oldValue) {
                    console.log("Last room has been occupied")
                }

                if (newValue && !oldValue) {
                    console.log("There are some new rooms can use")
                }
            }
        }
    })

    test('基本操作', () => {
        // @ts-ignore
        expect(v.canCheckIn).toBe(true)
        // @ts-ignore
        v.rooms[0].occupied = true
        // @ts-ignore
        expect(v.canCheckIn).toBe(false)
        // @ts-ignore
        v.rooms = [{id: 3, occupied: false}]
        // @ts-ignore
        expect(v.canCheckIn).toBe(true)
    })

    test('index操作', () => {
        // @ts-ignore
        expect(v.canCheckIn).toBe(true)
        // @ts-ignore
        v.rooms[0] = {id: 3, occupied: true}
        // @ts-ignore
        expect(v.canCheckIn).toBe(false)
    })
})


describe('对对象的可观察处理', () => {
    const v = new Vue({
        data() {
            return {
                boy: {
                    name: "bob",
                    age: 16
                },
                girl: {
                    name: "lily",
                    age: 18
                }
            }
        },
        computed: {
            isBoyOlder() {
                return this.boy.age > this.girl.age
            }
        },
        watch: {
            isBoyOlder(newValue, oldValue) {
                if (newValue && !oldValue) {
                    console.log('boy is older than girl')
                }
            }
        }
    })

    // @ts-ignore
    expect(v.isBoyOlder).toBe(false)
    // @ts-ignore
    v.boy.age = 20
    // @ts-ignore
    expect(v.isBoyOlder).toBe(true)
})

