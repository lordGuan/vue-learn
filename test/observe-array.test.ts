import Vue from "../src/core/instance";

describe('observe array', () => {
    const v = new Vue({
        data() {
            return {
                rooms: [
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
        },
        mounted() {
            setTimeout(() => {
                this.rooms.push({
                    id: 1,
                    occupied: false
                })
            }, 100)
        }
    })

    v.$mount()

    test("base test", done => {
        expect(v).toBeTruthy()
        setTimeout(() => {
            // @ts-ignore
            expect(v.rooms.length).toBe(2)
            done()
        }, 200)
    })
})