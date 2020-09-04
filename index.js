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
        // console.log(Storage);
        // if(!this.vm) {
        //   throw new Error("请先实例化Storage");
        // }
				// return this;
			}
		})
		Object.defineProperty(Vue.prototype, `$${options.name}`, {
			get() {
         return vm;
    //     if(!this.vm) {
    //       throw new Error("请先实例化Storage");
    //     }
				// return Storage.vm;
			}
		})
  }
export default UniStorage;
