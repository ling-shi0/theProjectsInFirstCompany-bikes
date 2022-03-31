import loading from "./loading";
import headerNav from "./header_nav/index";

const components = [
  loading,
  headerNav
];

const install = (Vue) => {
  components.map((component) => {
    Vue.component(component.name, component);
  });
};

export default {
  install
};
