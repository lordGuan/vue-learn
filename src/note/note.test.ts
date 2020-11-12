import Vue from "./note_1"

test("test note:", () => {
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

    expect(v['test'] === 1)
})
