const CompressionWebpackPlugin = require("compression-webpack-plugin");
const productionGzip = true;
const productionGzipExtensions = ["js", "css"];
module.exports = {
  productionSourceMap: false,
  outputDir: "NewsManager",
  publicPath: './',
  lintOnSave: false,
  chainWebpack: config => {
    //生产环境
    // config.when(process.env.NODE_ENV === 'de', config => {
    // config.entry('app').clear().add('./src/main-prod.js')
    config.set('externals', {
      // ElementUI:'ElementUI'
      vue: 'Vue',
      'vue-router': 'VueRouter',
      axios: 'axios',
    });
    config.when(process.env.NODE_ENV === 'development', config => config.devtool('source-map'));
    // })
  },
  configureWebpack: {
    plugins: [
      new CompressionWebpackPlugin({
        filename: '[path].gz[query]', // 生产的gzip资源名
        algorithm: 'gzip',  // 压缩算法
        test: new RegExp('\\.(' + ['js', 'css', 'png'].join('|') + ')$'), // 匹配文件名 匹配到的会进行压缩
        threshold: 102, // 对0.1K以上的数据进行压缩
        minRatio: 0.8,  // 压缩率
        deleteOriginalAssets: false /* process.env.NODE_ENV == 'production' // 是否删除源文件 */
      })
    ]
  }
}

