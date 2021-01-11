# BMS-TOPO

> BMS v5.0 前端 Vue + Webpack 实现

## Build Setup

``` bash

# 设置镜像
npm config set registry https://registry.npm.taobao.org

# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# 只启动一页html
npm run dev PAGE_NAME

注意， page名字来自html的前缀， 如npm run dev index users

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test

# 发布打包文件
npm run release

# 若发布报错尝试用下列命令解决
npm run release:clean
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).


## 目录结构说明

* 首次使用, 将`config/devServer.example.js`复制为`devServer.js`, 修改`remoteServer`为后台服务器地址. `sessionId`和`csrftoken`修改为登陆后的对应cookie值。

* `assets` 图片等

* `components` 页面间可复用的及各页面自己的 Vue组件

* `helpers` 杂项，常量，及其他与 Vue 无关系的数据处理方法

* `models` 复杂 Vue组件 的数据结构类型

* `service` 后端接口对接

* `pages` 目录, 包括所有的多页面, 每一个文件夹中包含一个完整的 Vue App。

  + `subPages` 为该页面的路由子页面
  + `router` 子路由
  + `store` vuex 配置项
  
## 接口对接
* 所有接口必须添加至`config/apis.js`，主要有三种类型：`post`、`get`、`eventsource`，具体说明如下：
1. `post`：  
  + 格式：  

    ```javascript
    '接口名称': {
         method: 'post',
         isJson: 'false', //必填
       }
    ```  
  
  + 注意：使用`axios`调用需要添加` transformRequest: [buildUrlencodedData]`  
  + 样本：  
  
    ```javascript
    '/zh-cn/newdatapath/': {
        method: 'post',
        isJson: false,
       }
    ```
  
    ```javascript
    export const getDataPath = appName =>
        axios({
          url: '/zh-cn/newdatapath/',
          method: 'post',
          withCredentials: true,
          data: {
            app_name: appName,
            csrfmiddlewaretoken: token,
          },
          transformRequest: [buildUrlencodedData], //必须
        });
    ```  
2. `get`:
  + 格式：    
  
    ```javascript
    '接口名称': {
         method: 'get',
       }
    ```  
  + 样本： 
  
    ```javascript
    '/zh-cn/newdatapath/': {
        method: 'post',
        isJson: false,
       }
    ```  
3. `eventsource`:
  + 格式：  
  
    ```javascript
    '接口名称': {
         method: 'get',
         type: 'eventsource',
         events: ['事件1','事件2'], //eventsource监听的事件名称
       }
    ```
  + 注意：使用`new EventSource('接口名称')`进行调用
  + 样本：  
  
    ```javascript
    '/zh-cn/events/task/:taskId/': {
        method: 'get',
        type: 'eventsource',
        events: ['ack', 'event', 'eof'],
     }
    ```

## 本地路由配置
* 所有页面路径必须添加至`config/maps.js`
  + 格式：
  
    ```javascript
    {
       from: /\//, //匹配url的正则表达式
       to: '/index.html', //html名称
     }
    ```
  + 样本：
  
    ```javascript
    {
       from: /\/zh-cn\/edit\/datapath\/app\d+\//,
       to: '/edit_datapath.html',
     }
    ```
    
## 代码规范

常见 eslint 错误可通过 `npm run lint:fix` 解决

* 规则速查: https://eslint.org/docs/rules/


## 接口规范

1. 接口返回数据格式为：{'code'：0,'msg'：'','data'：{}} 
2. 保持现有功能，从data层获取数据，在网页展示
3. msg 字段为接口提示信息
4. code 字段为接口返回状态 
- 0： 接口调用成功
- -1： 无数据或数据为空
- -2： 服务器出现错误
- -3： 参数错误
- -4： 权限验证失败
- -5： 数据库访问异常
- -6： 接口请求方式错误
- -100： 其他错误

### 
输入框边框：1px  #15ece
<!-- 输入框文字：   #15ece4 -->


### 其他规范
- beforeDestroy， 清除定时器、resize事件监听
- 表单标签，使用change事件watch数据变化
- 频繁事件，使用[[debounce]](https://lodash.com/docs/4.17.11#debounce)
- 文字过长推荐使用自定义指令v-tooltip

### 项目开发300问300答

说明：主要分为业务、框架、原生语言

范例： 

1. 问：tip不停闪烁， 鼠标事件不停触发

答：未解决



