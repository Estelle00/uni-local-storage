import Vue from "vue";
import Storage from "../../index";
Vue.use(Storage, {
  name: "ls" // 可选 ==> this.$ls or  Vue.ls
});
const options = {
  version: process.env.versionName,
  namespace: "__ls__"
}

// 此次导出可直接在JS中使用
export default new Storage(options);
