/*
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-02-28 10:57:32
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-09-07 15:51:55
 */
import helper from "@/helper";

let baseURL;
let isdev = process.env.NODE_ENV;

const locationUrl = window.location.origin;

function fn() {
  // 各环境下的配置 API
  switch (isdev) {
    case "development":
      // let baseUrl_01 = 'http://10.15.82.109:17005/erim-web/';   // 李方生
      // let baseUrl_02 = 'http://10.15.81.20:17005/erim-web/';   // 高跃
      // let baseUrl_03 = 'http://10.15.81.117:17005/erim-web/';   // 季柳波
      // let baseUrl = "https://10.19.141.75/ctm01ctevehicle-web/"; // 75平台
      // let baseUrl = "http://10.15.80.27:8758/erim-web/"; // 朱鹏明
      // let baseUrl = "http://10.16.66.16:8758/erim-web/"; // 范奥博
      let baseUrl = "https://10.33.43.58/erim-web/"; // 58
      // let baseUrl = "https://10.19.132.173/erim-web/"; // 173
      // let baseUrl = "https://10.19.186.137/erim-web/"; // 137
      return baseUrl;
    case "production":
      return locationUrl + "/erim-web/";
    default:
      return "//api.cangdu.org";
  }
}
baseURL = fn();

let mapInfo = {
  EPSG: "4326",
  hvtUrl:
    isdev == "development"
      ? "http://10.19.154.61:1709/GeoData/hvt_213/"
      : helper.get("hvtUrl"),
  darkStyleUrl:
    isdev == "development"
      ? "http://10.19.154.61:1709/GeoData/style/white/mapStyle.json"
      : helper.get("darkStyleUrl")
};
/*let mapInfo = {
    EPSG: '4326',
    hvtUrl: isdev == 'development'
        ? "http://10.19.141.75:1709/hmap-server/hvt/"
        : helper.get('hvtUrl'),
    darkStyleUrl: isdev == 'development'
        ? "http://10.19.141.75:1709/hmap-server/hvtStyles/zp-cvehicle-fresh/MapStyle.json"
        : helper.get('darkStyleUrl')
}*/

export default {
  baseURL,
  mapInfo
};
