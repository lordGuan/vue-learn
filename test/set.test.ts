import Vue from "../src/core/instance";

describe("$set", () => {
  const v = new Vue({
    data() {
      return {
        watchCount: 0,
        test: {
          name: "bob",
        },
        arr: [1, 2, 3],
        arrWatchCount: 0,
      };
    },
    watch: {
      "test.id"() {
        this.watchCount++;
      },
      arr: {
        deep: true,
        handler() {
          this.arrWatchCount++;
        },
      },
    },
  });

  test("", () => {
    expect(v).toBeTruthy();
    Vue.set(v.test, "id", 123);
    expect(v.test.id).toBe(123);
    expect(v.watchCount).toBe(1);
    v.test.id = 223;
    expect(v.watchCount).toBe(2);

    Vue.set(v.arr, 2, 199);
    expect(v.arrWatchCount).toBe(1);
  });
});
