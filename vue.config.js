/*
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-04-25 15:28:40
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-04-25 15:59:55
 */
const isDev = process.env.NODE_ENV === "development";
// vue.config.js 配置说明
// 这里只列一部分，具体配置惨考文档啊
module.exports = {
  lintOnSave: false,
  publicPath: isDev ? "/" : "/erim-web",
  outputDir: "../erim-web/view/src/main/resources/static",
  productionSourceMap: false,
  indexPath: `../templates/index.ftl`,
  devServer: {
    port: 8080, // 端口号
    host: "0.0.0.0",
    https: false, // https:{type:Boolean}
    open: false, //配置自动启动浏览器
    proxy: {
      "/api": {
        target: "http://10.15.82.14:17005/erim-web/",
        changeOrigin: true
      }
    }
  },
  chainWebpack: config => {
    if (isDev) {
      config.plugin("html").tap(args => {
        args[0].meta = {
          _csrf: "${(_csrf.token)!}",
          _csrf_header: "${(_csrf.headerName)!}"
        };
        return args;
      });
    } else {
      config.plugin("html").tap(args => {
        args[0].meta = {
          _csrf: "${(_csrf.token)!}",
          _csrf_header: "${(_csrf.headerName)!}"
        };
        return args;
      });
    }
  }
  // 打包上线测试时可以取消注释
  // configureWebpack: {
  //   devtool: "cheap-module-eval-source-map",
  //   entry: isDev ? ['projectThemeEntry', "./src/main.js"] : "./src/main.js",
  //   resolve: {
  //     alias: {
  //       "@var": "@iot/themes/var.scss"
  //     }
  //   }
  // }
};
