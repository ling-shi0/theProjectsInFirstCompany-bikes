import SuiSelectPoint from './selectPoint.vue'
import SelectPointTree from './selectPointTree.vue'

/* istanbul ignore next */
SuiSelectPoint.install = function (Vue) {
  Vue.component(SuiSelectPoint.name, SuiSelectPoint)
}
SelectPointTree.install = function (Vue) {
  Vue.component(SelectPointTree.name, SelectPointTree)
}

export default SuiSelectPoint
export { SelectPointTree }
