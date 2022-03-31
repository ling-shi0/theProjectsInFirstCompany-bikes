import headerNav from "./header_nav.vue";

headerNav.install = (Vue) => {
  Vue.component(headerNav.name, headerNav);
};

export default headerNav;
