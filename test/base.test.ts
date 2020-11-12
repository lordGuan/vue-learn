import Vue from "../src/core/instance"

test("base test", () => {
    const v = new Vue({
        data() {
            return {
                a: 1,
                test: 0
            }
        },
        watch: {
            a(newValue, oldValue) {
                console.log(newValue, oldValue)
                this.test++
            }
        }
    })

    v['a'] = 100
    v['a'] = 200

    expect(v['test']).toBe(2)
})
