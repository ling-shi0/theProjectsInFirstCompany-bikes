# selectPoint组件使用说明

## 使用方法
```js
<sui-select-point ref="selectPoint"
                  :requestData="requestTreeData"
                  :filterResult="filterResult"
                  :parentCheckable="true"
                  :showMap="false"
                  :expandOnChecked="true"
                  @change="handleChange">
</sui-select-point>
```

## 配置项
```js
dataSource: { // 数据来源，可为空，支持多个目录切换，大于一个显示下拉框
  type: Array,
  default () { // 没有默认值，以下是格式说明
    return [{
      label: '国标目录',
      treeCode: '0'
    }, {
      label: 'test',
      treeCode: '81652768703066358237'
    }]
  }
},
resourceType: { // 资源类型，可为空，支持多种资源切换查询，大于一个显示下拉框
  type: Array,
  default () { // 没有默认值，以下是格式说明
    return [{
      label: '卡口',
      resourceType: 'CROSS'
    }, {
      label: '监控点',
      resourceType: 'CAMERA'
    }]
  }
},
xMapUrl: { // 显示地图时xmap服务地址，注意两个参数的值
  type: String,
  default: '/xmap-web/third/mapQuery/index.do?resourceType=CROSS&treeCode=0'
},
/**
 * @param params {Object} 查询条件改变时返回改变的值，返回关键字如下：
 * {
 *  treeCode: 对应dataSource的treeCode
 *  resourceType: 对应resourceType的resourceType
 *  searchValue: 组件搜索资源输入的值
 *  parentKey: 展开父节点返回父节点标识如indexCode
 * }
 * @return Promise => resolve(data)
 * */
requestData: { // 请求数据方法
  type: Function,
  required: true
},
showMap: { // 是否显示地图
  type: Boolean,
  default: true
},
dialogTitle: { // 弹出框标题
  type: String,
  default: '选择点位'
},
innerTitle: { // 左侧框title，在没有多个数据来源时显示这个title，有多个数据来源为来源下拉框
  type: String,
  default: '组织树'
},
parentCheckable: { // 父节点是否禁用check
  type: Boolean,
  default: true
},
/**
 * 节点过滤方法，左侧树check完的节点过滤到右侧列表
 * 默认根据父子关系简化，即父节点选中则不返回子节点
 * @param node 过滤节点的data数据
 * @return {Boolean} 是否过滤
 * */
filterResult: {
  type: Function 
},
expandOnChecked: { // check父节点时自动展开子节点
  type: Boolean,
  default: false
},
expandWhenHasValue: { // 有初始值时是否展开所有节点（并勾选初始值），默认只展开第一层，展开节点后才勾选初始值
  type: Boolean,
  default: false
},
// -------------------树需要的props-------------------
nodeKey: { // 树节点id字段
  type: String,
  default: 'indexCode'
},
parentKey: { // 树节点指向父节点id字段
  type: String,
  default: 'parentId'
},
treeProps: { // 树组件配置选项，参照HUI>Tree组件的props
  type: Object,
  default () {
    return {
      label: 'name',
      children: 'children',
      icon: 'iconSkin',
      isLeaf: function (data) {
        return data.iconSkin !== 'org'
      }
    }
  }
}
```

## 事件
* change
```js
@change="handleChange"
/**
 * @param nameValue {String} 选中节点名称，逗号分隔
 * @param keyValue {parentKeys: ',', leafKeys: ','}
 * @param nodes {Array} 选中节点的data
 * */
handleChange (nameValue, keyValue, nodes) {
  console.log('nameValue: ', nameValue, ' key是 ', keyValue, ' 节点是: ', nodes)
}
```
* dataSourceChange
```js
@dataSourceChange="dataSourceChange"
/**
 * @param type {String} 改变类型，有可能的值：'treeCode'、'resourceType'
 * @param value
 * */
dataSourceChange (type, value) {
  if (type === 'treeCode') {
    this.xMapUrl = `/xmap-web/third/mapQuery/index.do?resourceType=CROSS&treeCode=${value}`
  }
}
```

## 方法
* setValue 设置初始值
```js
    const initValue = {
      parent: [{
        name: '宁波市',
        indexCode: '95ab9e3943b84f6886106d7885b00777'
      }],
      leaf: [{
        name: '微卡62',
        indexCode: '87be85ec8c194739a65d62f17d7203b2'
      }, {
        name: 'test',
        indexCode: '0f65b1cb5ca54a2e9ceeb47b778d7a0b'
      }]
    }
    this.$nextTick(() => {
      this.$refs.selectPoint.setValue(initValue)
    })
```
* clearValue
```js 清除重置
this.$refs.selectPoint.clearValue()
```