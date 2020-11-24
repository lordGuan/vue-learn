import Vue from '../src/core/instance'

describe('unwatch test', () => {
    test('', () => {
        const v = new Vue({
            data() {
                return {
                    target: 1,
                    watchCount: 0
                }
            }
        })

        v.target = 2
        expect(v.watchCount).toBe(0)
        const unwatch = v.$watch('target', function (newValue) {
            console.log('++++', newValue)
            this.watchCount++
        })
        v.target = 3
        expect(v.watchCount).toBe(1)
        unwatch()
        v.target = 4
        expect(v.watchCount).toBe(1)
    })
})