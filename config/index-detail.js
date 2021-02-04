const { resolve } = require('path')

module.exports = {
  build: {
    env: require('.prod.env'),
    index: resolve(__dirname, '../dist/index.html'),
    assertsRoot: resolve(__dirname, '../dist'), // 构建输出目录，也就是构建后的东西都放这里
    assetsSubDirectory: 'static', // 资源子目录，除了index.html, 其余js， img， css 放这里
    aseetsPublicPath: '/', // 项目目录， 根目录
    /*
    * source map 直译过来就是资源地图
    * 所以，source map的作用就是定位
    * source map定位的时浏览器控制台输出语句在项目文件的位置。
    * https://blog.csdn.net/weixin_44869002/article/details/105832031
    */
    productionSourceMap: false, // 设置生产环境的source map 开启
    productionGzip: false, // 是否开启Gzip
    prodctionGzipExtensions: ['js', 'css'], // Gzip 包含的后缀名
    /*
    * 启动服务：
    * 生产环境查看：npm run build --report 或 正常build 即可启动查看器
    * 开发环境查看：webpack -p --progress 或启动正常devServer服务即可启动查看器!
    */
    bundleAnalyzerReport: process.env.npm_config_report,
  },
  dev: {
    env: require('./dev.env'),
    port: 8000,
    autoOpenBrowser: true,
    assertsSubDirectory: 'static',
    assertsPublicPath: '/',
    proxyTable: {},
    cssSourceMap: false,
    devServer: require('./devServer'),
    apis: require('./apis'),
    maps: require('./maps'),
  }
}