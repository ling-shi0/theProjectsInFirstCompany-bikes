<template>
  <div class="sui-select-point-map">
    <iframe
      style="width: 100%; height: 100%"
      id="mapCheckIframe"
      frameborder="no"
      border="0"
      marginwidth="0"
      marginheight="0"
      :src="src"
    ></iframe>
  </div>
</template>
<script>
const mapFunc = ["onMapLoaded", "mapQueryEnded", "onMapClear"];
export default {
  name: "SuiSelectPointMap",
  componentName: "SuiSelectPointMap",
  props: {
    checkedNodes: {
      type: Array,
      default() {
        return [];
      },
    },
    src: {
      type: String,
    },
    hasOpen: {
      type: Boolean,
    },
  },
  data() {
    return {
      mapWindow: null,
      mapChecked: [],
    };
  },
  watch: {
    mapChecked(val) {
      this.$emit("change", val);
    },
  },
  methods: {
    onMapLoaded() {
      this.mapWindow = document.getElementById("mapCheckIframe").contentWindow;
    },
    mapQueryEnded(param) {
      /*
      * externalIndexCode: "33010000051210000003"
        id: "b71482b81d3d47d9a71257e5f8b67c39_CROSS"
        indexCode: "b71482b81d3d47d9a71257e5f8b67c39"
        latitude: "30.22"
        longitude: "120.11"
        name: "1108高德威卡口1-违法过车"
        resourceType: "CROSS"
      * */
      this.mapChecked = param;
    },

    onMapClear() {
      // postMessage返回空数组
      this.mapChecked = [];
    },
    /**
     * 地图打点（高亮选中的点位）
     * */
    mapPosition() {
      // 点位
      var obj = {
        highlightType: 0,
        resources: [],
      };
      // 组织
      var branchObj = {
        highlightType: 1,
        resources: [],
      };
      for (const item of this.checkedNodes) {
        if (item.iconSkin !== "org") {
          const param = {
            indexCode: item.indexCode,
            name: item.name,
            longitude: item.longitude,
            latitude: item.latitude,
            resourceType: "CROSS",
          };
          obj.resources.push(param);
        } else {
          const param = {
            indexCode: item.indexCode,
            name: item.name,
            resourceType: "CROSS",
          };
          branchObj.resources.push(param);
        }
      }

      var param = JSON.stringify(obj);
      var branchParam = JSON.stringify(branchObj);
      // 点位打点
      this.sendMsg(
        '{"function":"mapResourceLocation","param":' + param + "}",
        "*"
      );
      // 组织打点
      this.sendMsg(
        '{"function":"mapResourceLocation","param":' + branchParam + "}",
        "*"
      );
    },
    sendMsg(msg) {
      this.mapWindow && this.mapWindow.postMessage(msg);
    },
    receiveMsg(event) {
      if (this.hasOpen) {
        // 同时使用多个时，只有open的接收
        try {
          let params = JSON.parse(event.data);
          if (params.function && mapFunc.indexOf(params.function)) {
            this[params.function](params.param);
          }
        } catch (err) {}
      }
    },
  },
  created() {
    window.addEventListener("message", this.receiveMsg, false);
  },
  mounted() {
    this.$nextTick(() => {
      this.$emit("mounted", this);
    });
  },
  beforeDestroy() {
    window.removeEventListener("message", this.receiveMsg);
  },
};
</script>
<style lang="scss">
.sui-select-point-map {
  height: 100%;
}
</style>
