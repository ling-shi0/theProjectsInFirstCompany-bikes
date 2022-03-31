import loading from "./loading.vue";

loading.install = (Vue) => {
  Vue.component(loading.name, loading);
};

export default loading;
