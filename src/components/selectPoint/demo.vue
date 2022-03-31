<!--http://localhost:8080/#/demo/selectPoint-->
<template>
  <div style="width: 400px;margin: 100px">
    <sui-select-point ref="selectPoint"
                      :requestData="requestTreeData"
                      :filterResult="filterResult"
                      :parentCheckable="true"
                      :showMap="false"
                      :expandOnChecked="true"
                      expandWhenHasValue
                      @change="handleChange">
    </sui-select-point>
    <el-button @click="clear">清空</el-button>
    <p style="margin: 40px"></p>
    <sui-select-point-tree ref="singleTree"
                           :loadDataByNode="loadDataForTree"
                           :filter="filterData"
                           :expandOnChecked="false"
                           @change="handleTreeChange"></sui-select-point-tree>
    <section>
      <div>{{names}}</div>
      <div>组织节点ID：{{parentKeys}}</div>
      <div>资源节点ID：{{leafKeys}}</div>
    </section>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  data () {
    return {
      // -------------------组件参数 begin-------------------
      // 多数据来源，有超过1个的来源才显示下拉
      dataSource: [{
        label: '国标目录',
        treeCode: '0'
      }, {
        label: 'test',
        treeCode: '81652768703066358237'
      }],
      // 大于2个时显示切换功能，取值参考httpspe说明
      resourceType: [{
        label: '卡口',
        resourceType: 'CROSS'
      }, {
        label: '监控点',
        resourceType: 'CAMERA'
      }],
      // xmap资源请求的url，当树编号或资源类型改变时要改变对应的url
      xMapUrl: 'https://10.33.26.130/xmap-web/third/mapQuery/index.do?resourceType=CROSS&treeCode=0',
      // 是否显示地图框选功能
      showMap: true,
      // dialog title
      dialogTitle: '选择点位',
      // 无多个数据来源时左侧标题
      innerTitle: '组织树',
      // ----------HUI Tree组件需要参数------------
      nodeKey: 'indexCode',
      // 组织节点能否勾选
      parentKey: 'parentId',
      treeProps: {
        label: 'name',
        children: 'children',
        icon: 'iconSkin',
        isLeaf: function (data) {
          return data.iconSkin !== 'org'
        }
      },
      // -------------------组件参数 end-------------------

      curTreeCode: '',

      // -------------------单独使用树参数 start-------------------
      names: '',
      parentKeys: '',
      leafKeys: ''
      // -------------------单独使用树参数 end-------------------
    }
  },
  computed: {
    baseUrl () {
      return `api/itim-web/web/org/tree/user`
    }
  },
  methods: {
    /**
     * @param params{Object} 查询条件改变时返回改变的值，返回关键字{[treeCode/resourceType/searchValue/parentKey]:'XXX'}
     * @return Promise resolve(data)
     * */
    requestTreeData (params) {
      if (params.treeCode) {
        this.curTreeCode = params.treeCode
      }
      return new Promise((resolve) => {
        axios.get(this.baseUrl, {
          params: {
            searchName: params ? params.searchValue : '',
            id: params ? params.parentKey : ''
          }
        }).then(res => {
          if (res && res.data && res.data.code === '0') {
            resolve(res.data.data || [])
          } else {
            resolve([])
          }
        }).catch(() => {
          resolve([])
        })
      })
    },
    /**
     * @param nameValue {String} 选中节点名称，逗号分隔
     * @param keyValue {parentKeys: ',', leafKeys: ','}
     * @param nodes {Array} 选中节点的data
     * */
    handleChange (nameValue, keyValue, nodes) {
      console.log('nameValue: ', nameValue, ' key是 ', keyValue, ' 节点是: ', nodes)
    },
    /**
     * @param type {'resourceType' or 'treeCode'}
     * @param value 对应的值
     * */
    handleDataSourceChange (type, value) {
      if (type === 'treeCode') {
        this.xMapUrl = `https://10.33.26.130/xmap-web/third/mapQuery/index.do?resourceType=CROSS&treeCode=${value}`
      }
      if (type === 'resourceType') {
        this.xMapUrl = `https://10.33.26.130/xmap-web/third/mapQuery/index.do?resourceType=${value}&treeCode=0`
      }
    },
    filterData (value) {
      return new Promise(resolve => {
        axios.get('api/itim-web/web/org/tree/user', {
          params: {
            searchName: value
          }
        }).then(res => {
          if (res && res.data && res.data.code === '0') {
            resolve(res.data.data || [])
          } else {
            resolve([])
          }
        }).catch(() => {
          resolve([])
        })
      })
    },
    loadDataForTree (data) {
      return new Promise(resolve => {
        axios.get('api/itim-web/web/org/tree/user', {
          params: {
            id: data ? data.indexCode : ''
          }
        }).then(res => {
          if (res && res.data && res.data.code === '0') {
            resolve(res.data.data || [])
          } else {
            resolve([])
          }
        }).catch(() => {
          resolve([])
        })
      })
    },
    filterResult (node) {
      return node.iconSkin !== 'org'
    },
    handleTreeChange (values, names, nodes) {
      console.log('单独使用的树：', values, names, nodes)
      this.names = names
      this.parentKeys = values.parentKeys
      this.leafKeys = values.leafKeys
    },
    clear () {
      this.$refs.selectPoint.clearValue()
    }
  },
  mounted () {
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
//       this.$refs.singleTree.setValue(initValue)
     })
  }
}
</script>
