# 艺迷商城

艺迷商城：支持小程序、h5、安卓。

![240801_153735](https://github.com/user-attachments/assets/96c05b18-7490-4023-a255-93c22480d1b8)


## 环境和特性

- 环境
  - node v18.19.0
  - pnpm 9.0.6

- 特性
  - 请求封装 + 请求拦截 + 路由拦截 + 数据模拟
  - uniapp + Vue3 + Js/Ts + Vite4 + UnoCss + VSCode(无需依赖HBuilderX)
  - UnoCSS + UnoCSS Icons
  - prettier + eslint + stylelint + husky
  - pinia + pinia-plugin-persistedstate

## 参考文档

- 样式生成 https://alfred-skyblue.github.io/unocss-docs-cn/
- UI库 https://wot-design-uni.gitee.io/component/button.html
- 数据生成 https://wll8.github.io/mockjs-examples/
- 基础框架 https://codercup.github.io/unibest-docs/
- 接口调试 https://www.hongqiye.com/doc/mockm/

## 安装

检出自己的功能分支，执行 `pnpm i` 安装依赖，开发完成后创建 pr 由仓库管理员审核合并到 dev 分支。

## 运行

- 接口调试: `pnpm mm`
- web平台： `pnpm dev:h5`, 然后打开 [http://localhost:9000/](http://localhost:9000/)。
- weixin平台：`pnpm dev:mp-weixin` 然后打开微信开发者工具，导入本地文件夹，选择本项目的`dist/dev/mp-weixin` 文件。
- APP平台：`pnpm dev:app`, 然后打开 `HBuilderX`，导入刚刚生成的`dist/dev/app` 文件夹，选择运行到模拟器(开发时优先使用)，或者运行的安卓/ios基座。

如果报错 `manifest.json` 找不到，请运行 `pnpm prepare`.

## 发布

注：发布时，先发布 web 平台。

- web平台： `pnpm build:h5`，打包后的文件在 `dist/build/h5`，可以放到web服务器，如nginx运行。如果最终不是放在根目录，可以在 `manifest.config.ts` 文件的 `h5.router.base` 属性进行修改。
  - `pnpm push:h5` 上传到服务器
- weixin平台：`pnpm build:mp-weixin`, 打包后的文件在 `dist/build/mp-weixin`，然后通过微信开发者工具导入，并点击右上角的“上传”按钮进行上传。
- APP平台：`pnpm build:app`, 然后打开 `HBuilderX`，导入刚刚生成的`dist/build/app` 文件夹，选择发行 - APP云打包。


## 全局方法

### httpurl

以 http 的形式加载资源。

参数如果是相对路径，则会以 VITE_SERVER_STATIC_BASEURL 环境变量作为前缀，在开发环境下该变量实际访问的是 src/static-http 目录中的资源，如果是绝对路径，不做处理。

示例：在 html 模板中引用图片

```html
<wd-img :width="25" :height="25" :src="httpurl(item.logo)" />
```

示例：在 scss 中引用图片

```scss
.title {
  background-image: httpurl('/static/images/title_bg@2x.png');
}
```

### checkLogin

检测是否登录，并执行某操作。

checkLogin 传入一个可选函数，并返回一个函数。

示例：如果已登录则运行 pay 函数，未登录则跳转到登录页面。

```vue
<view @click="checkLogin(pay)()">立即购买</view>
```

### viewHtml

展示 html 内容。

参数：viewHtml 应传入一个函数，该函数需要返回一个对象，格式如下：

```js
return {
  tilte: '标题',
  content: '内容',
}
```

示例：展示根据 id 调用接口获取的 html。

```js
viewHtml(() => getById(id).then((res) => res.html))
```

### data-data

在 html 模板中，根据数据自动添加空状态。

示例：`carList.length` 为 0 时展示`暂无数据`。

```html
<div class="car-list" :data-data="carList.length">
  <div>...</div>
</div>
```
