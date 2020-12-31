import Storage from "./storage";
let vm = null;
function UniStorage(config) {
  if(!vm) vm = new Storage(config);
  return vm;
}
UniStorage.install = function (Vue, opt = {}) {
    const options = {
      name: "ls",
      ...opt
    };
		Object.defineProperty(Vue, `${options.name}`, {
			get() {
        return vm;
			}
		})
		Object.defineProperty(Vue.prototype, `$${options.name}`, {
			get() {
         return vm;
			}
		})
  }
export default UniStorage;
