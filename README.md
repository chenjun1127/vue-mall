# Vue Mall

> A Vue.js project

### 一、简介
Vue全家桶项目，该项目是基于Vue全家桶开发的商城网站，采用的技术栈为 Webpack + Vue + Vuex + Vue-router + Sass + Es6 + LocalStorage + Css3 + Node(express) + MongoDB；整个项目前后端分离开发，前端基于Vue全家桶进行渲染，后端由NodeJs+MongonDB提供服务。整个项目前后端由本人独自开发，基本实现了一个商城应有的功能！<font color=red>本项目仅供学习及交流，禁止商用及其它营利目的，如需商用，请找我授权</font>

[戳这里在线浏览，已部署到我自己的腾讯云](http://119.29.165.98/vue-mall/#/)


Tips：感兴趣的朋友可以在线注册一个账号进行体验，由于涉及到线上数据库安全问题，注册的账号都只是普通账号暂不开通高级权限。线上个人中心修改头像上传图片的时候，没做七牛云上传，所以上传图片会失败（pull代码到本地运行，是可以正常修改头像的）

#### 1、项目依赖基本核心版本：
* body-parser: "~1.17.1",
* cookie-parser: "~1.4.3",
* debug: "~2.6.3",
* express: "~4.15.2",
* jade: "~1.11.0",
* moment: "^2.20.1",
* morgan: "~1.8.1",
* serve-favicon: "~2.4.2",
* vue: "^2.5.2",
* vue-router: "^3.0.1",
* vuex: "^3.0.1"

#### 2、项目前端搭建:
* 基于Vue全家桶进行前端页面渲染
* 基本样式基于Bootstrap
* 引入了Moment.js格式化前端页面显示时间

#### 3、项目后端搭建:
* 使用NodeJs的express框架完成项目后端搭建；
* 使用mongodb完成数据存储，通过mongoose模块完成对mongodb数据的构建；


#### 4.该商城基本功能：
项目正常访问无需管理员权限，对个人中心资料的修改，需要用户登录，对商城产品及分类的基本操作（增删改查），需要有管理员权限，默认一个管理员，具体功能如下：
* 基本的用户登录、注册、个人资料修改
* 用户权限管理、登录做session处理（失效期暂为5天）
* 商城产品及产品分类的增加、删除、更新，查询（可分页查询）
* 加入购物车及结算、下单功能
* 收货地址的增加、编辑、删除
* 关键字搜索功能
* 订单查询功能

### 二、网站整体效果，截图看[这里](https://github.com/chenjun1127/vue-mall/blob/master/images.md)

### 三、运行环境
整个项目的运行，首先要确保 [Node](https://nodejs.org/zh-cn/) + [MongoDB](https://www.mongodb.org/downloads#production) 安装并配置好。

### 四、项目安装及运行

* 克隆项目，进入项目目录；
```bash
git clone git@github.com:chenjun1127/vue-mall.git
cd vue-mall
```
* 安装依赖
```bash
npm install or yarn install
```
* 启动后端服务
```bash
npm run server
```

* 执行
``` bash
npm run dev or npm start
```
* 浏览
```
http://localhost:4000/
```

* 打包
``` bash
npm run build
```

### 五、项目总结
整个项目由于是本人独自开发，UI部分基于Bootstrap（没有UI设计师），整体UI细节有待优化完善；部分功能有细微瑕疵，譬如订单的操作（增删改查）未根据订单的状态来判断、产品分类列表未做分页查询等等，这些都需要完善！觉得项目不错的，可以给个Star，谢谢！

坑：在使用vue2.0打包项目的时候，如发现背景图片路径错误，请修改 build/utils.js ，加一行publicPath:'../../':
```
return ExtractTextPlugin.extract({
  use: loaders,
  publicPath:'../../',
  fallback: 'vue-style-loader'
})
```
在css中，图片的引用使用相对路径即可！

### 六、重要提示
Tips：在npm install or yarn install 的时候，请确保网络良好，如个别依赖安装不了，请设置淘宝镜像为安装源；

强烈推荐使用 Yarn！

运行此项目一定要先启动 Mongo 服务，并连接 MongoDB 数据库。

<b>数据需要自己去建，不提供数据库（如想使用，请先扫码授权）。想拿此项目去做毕业设计的朋友，请先联系我本人授权，如未授权直接使用，本人保留追究法律责任的权利。</b>

<b>本项目是基于Vue-cli2.0x的，如果克隆下来运行不成功（webpack升级后可能不兼容），请点击[这里](https://github.com/chenjun1127/vue-mall-v2)查看Vue-cli3.x的版本。</b>

如有问题：请 Issue ，如需联系我本人指导，请先扫描下方二维码打赏再联系QQ：402074940 。另外，关于本项目也可以加讨论群，[点击链接加入群聊【vue-mall交流群】](https://jq.qq.com/?_wv=1027&k=5JMOpEx)

![微信](https://github.com/chenjun1127/vue-mall/blob/master/QR-code/pay.png)

***
React 技术交流QQ群：538825125 [点击链接加入群聊【React技术交流群】](https://jq.qq.com/?_wv=1027&k=5mMdA6K)

Vue   技术交流QQ群：572305259 [点击链接加入群聊【Vue技术交流群】](https://jq.qq.com/?_wv=1027&k=56wOWOv)

