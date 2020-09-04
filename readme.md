### install

#### NPM

```shell script
npm install uni-ls --save
```

#### YARN

```shell script
yarn add uni-ls
```

### Usage

uni storage API

```javascript
import Storage from "uni-ls";
// name 默认 ls；
Vue.use(Storage, { name: "ls" });
// or
Vue.use(Storage);
// 实例化存储
const config = {
  version: "0.0.1", // 当前存储版本号 推荐动态读取manifest.json文件版本名称（versionName）
  namespace: "__ls__", // 当前存储key前缀 推荐动态读取manifest.json文件中AppID（appid）
}
const storage = new Storage();
export default storage; // 方便js文件内直接使用

new Vue({
    el: '#app',
    created() {
        Vue.ls.set('foo', 'boo');
        //Set expire for item
        Vue.ls.set('foo', 'boo', 60 * 60); //expiry 1 hour
        Vue.ls.get('foo');
        Vue.ls.remove('foo');
    },
})
```
#### Context
```javascript
this.$ls
```

### API
```javascript
Vue.ls.get(name, version);
```
返回key为name的本地存储数据。
- `version` 默认为0.0.1，返回大于当前版本数据
> 小于当前版本数据会自动删除

```javascript
Vue.ls.set(name, value, expire);
```
存储`name`下的`value`。
- `expire` 默认null，数据有效秒

```javascript
Vue.ls.getAll(version)
```
返回所以存储数据
- `version` 默认为0.0.1，返回大于当前版本数据
> 小于当前版本数据会自动删除

```javascript
Vue.ls.remove(name);
```
删除`name`数据，成功返回`true`；
