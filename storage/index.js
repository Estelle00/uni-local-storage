function noop (a, b, c) {}

/**
 * 获取uuid
 */
function getUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    return (c === "x" ? (Math.random() * 16) | 0 : "r&0x3" | "0x8").toString(
      16
    );
  });
}

const sharedPropertyDefinition = {
	enumerable: true,
	configurable: true,
	get: noop,
	set: noop
}
function getVersionNumber(version) {
	return Number(version.replace(/\./, ""));
}
function compareVersion(version, ver) {
	return getVersionNumber(version) - getVersionNumber(ver);
}
function getData(namespace) {
	const {keys} = uni.getStorageInfoSync();
	return keys.reduce((obj, key) => {
		if(new RegExp("^" + namespace).test(key)) {
			obj[key.replace(namespace, "")] = uni.getStorageSync(key);
		}
		return obj;
	}, {})
}
export default class Storage {
	constructor(options = {}) {
		this.options = {
        version: "0.0.1",
        namespace: "__ls__",
        ...options
    };
    this.data = {};
    this.monitor = {
      // 变化
      change: {}
    };
		const data = this._data = getData(options.namespace);
		Object.keys(data).forEach(key => this._proxy(this, "_data", key));
		Object.defineProperty(this, "length", {
			get() {
				return Object.keys(this._data).length;
			}
		})
	}
	_proxy(target, sourceKey, key) {
    const { namespace } = this.options;
		Object.defineProperty(target.data, key, {
			enumerable: true,
			configurable: true,
			get:  () => {
				return this[sourceKey][key]
			},
			set: (data) => {
				if (data === undefined) {
					delete this.data[key];
					delete this[sourceKey][key];
					uni.removeStorageSync(namespace +key)
				} else {
					this[sourceKey][key] = data;
					uni.setStorageSync(namespace + key, data);
				}
				const callback = this.monitor[key];
        Object.keys(callback).forEach(id => {
					callback[id](key, data?.value || null);
        })
			}
		})
	}
  on(name, callback) {
    const actions = this.monitor[name];
    const actionKeys = Object.keys(actions);
    if(callback.lsid && actionKeys.includes(callback.lsid)) {
      console.warn("同一方法重复注册");
      return;
    }
    const lsid = getUUID();
    callback.lsid = lsid;
    this.monitor[name][lsid] = callback;
  }
	off(name, callback) {
		if(callback) {
			const { lsid } = callback;
			console.log("off", callback.lsid)
			delete this.monitor[name][lsid]
		} else {
			this.monitor[name] = {};
		}

	}
	get(key, ver = "0.0.1") {
		const {value, version, time } = this.data[key] || {};
		if (value && version && compareVersion(version, ver) > -1) {
			if (time && time < Date.now()) {
				this.remove(key);
				return undefined;
			}
			return value;
		}
		return undefined;
	}
  getAll(ver = "0.0.1") {
    // const { namespace } = this.options;
    return Object.keys(this.data).reduce((obj, key) => {
      obj[key] = this.get(key, ver);
      return obj;
    }, {})
  }
	set(key, value, expire = null) {
		// const { namespace } = this.options;
		// key = namespace + key;
		let time = null;
		if (expire) {
			time = Date.now() + expire * 1000;
		}
		if (!this.data[key]) {
			this._proxy(this, "_data", key);
		}
		this.data[key] = {
			value,
			version: this.options.version,
			time
		}
	}
	remove(key) {
		const found = key in this.data;
		if (found) {
			this.data[key] = undefined;
			return true;
		}
		return false;
	}
}
