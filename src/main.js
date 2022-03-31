/*
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-08-26 16:54:52
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-12-09 19:43:19
 */
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import HUI from "hui";
import "hui/lib/hui.css";
import "./assets/sass/hui-variables.scss";
//import ElementUI from 'element-ui'
//import 'element-ui/lib/theme-chalk/index.css'
// import iView from "iview";
// import "iview/dist/styles/iview.css";
import axios from "axios";

import "./assets/sass/_install.scss";

// 布局
import page from "@hui-pro/page";
import "@hui-pro/page/theme/index.scss";
// 布局
import layout from "@hui-pro/layout";
import "@hui-pro/layout/theme/index.scss";
// 相册
import Album from "@hui-pro/album";
import "@hui-pro/album/theme/index.scss";
// tree
import syncTree from "@hui-pro/sync-tree";
import "@hui-pro/sync-tree/theme/index.scss";
// empty 缺省
import Empty from "@hui-pro/empty";
import "@hui-pro/empty/theme/index.scss";
// 图片预览
import ImgView from "@hui-pro/img-view";
import "@hui-pro/img-view/theme/index.scss";
// 工具集 -画矩形框
import ImgSnippets from "@hui-pro/img-snippets";
import "@hui-pro/img-snippets/theme/index.scss";
// 上传目标图片
import TargetImgUpload from "@hui-pro/target-img-upload";
import "@hui-pro/target-img-upload/theme/index.scss";
// 多图切换
import ImgCarousel from "@hui-pro/img-carousel";
import "@hui-pro/img-carousel/theme/index.scss";
// 图片放大
import ImgPreview from "@hui-pro/img-preview";
import "@hui-pro/img-preview/theme/index.scss";
import imgResultCard from '@hui-pro/img-result-card';
// 图片结果卡片
import '@hui-pro/img-result-card/theme/index.scss';
import VueClipboard from "vue-clipboard2";
import { gotoSearchCar } from "./goToApp";

Vue.use(VueClipboard);
Vue.prototype.$axios = axios;
Vue.use(page);
Vue.use(layout);
Vue.use(Album);
Vue.use(syncTree);
Vue.use(Empty);
Vue.use(ImgView);
Vue.use(ImgSnippets);
Vue.use(TargetImgUpload);
Vue.use(ImgCarousel);
Vue.use(ImgPreview);
Vue.use(imgResultCard);

Vue.use(HUI);
//Vue.use(ElementUI)
// Vue.use(iView);

Vue.config.productionTip = false;

Vue.prototype.$gotoSearchCar = gotoSearchCar;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
