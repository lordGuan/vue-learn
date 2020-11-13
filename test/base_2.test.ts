import Vue from "../src/core/instance";

describe("", () => {
    const v = new Vue({
        data() {
            return {
                person: {
                    name: "Programmer",
                    age: 29
                }
            }
        },
        watch: {
            'person.age'(newAge) {
                console.log(`${this.person.name} now is ${newAge}`)
            }
        }
    })

    // @ts-ignore
    v.person.age = 30
})