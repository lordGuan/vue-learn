import Vue from "../src/core/instance"

test("computed", () => {
    const v = new Vue({
        data() {
            return {
                a: 1,
                b: 2
            }
        },
        computed: {
            sum() {
                return this.a + this.b
            }
        },
        watch: {
            sum(newValue) {
                console.log("new sum:", newValue)
            }
        }
    })

    // @ts-ignore
    expect(v.sum).toBe(3)
    // @ts-ignore
    v.b = 3
    // @ts-ignore
    expect(v.sum).toBe(4)
})