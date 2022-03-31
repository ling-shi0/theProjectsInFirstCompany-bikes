<template>
  <div class="theMultipleDisplaySizeSmall">
    <div
      id="theMultipleDisplaySizeSmall"
      style="width: 100%; height: 300px"
    ></div>
    <!-- <i
      class="h-icon-windows_maximum fs30 cup"
      @click="openTheMultipleDisplaySizeLarge()"
    ></i> -->
  </div>
</template>

<script>
import Bus from "@/bus";
import envconfig from "@/envconfig/envconfig";
import mapUtils from "@/utils/mapUtils";
import iconCamera from "@/assets/images/map/mapCamera.png";
import CluePopWindow from "./CluePopWindow.vue";

export default {
  data() {
    return {
      map: null, // 地图对象
      vectorLayer: null, // 图层1
      selectClueData: [], // 选中线索管理数据
      selectLocationData: {
        // 定位搜数据
        centerPoint: {
          longitude: 0,
          latitude: 0,
          distance: 0,
        },
        list: [],
      },
      mapData: {
        centerPoint: {
          longitude: 0,
          latitude: 0,
          distance: 0,
        },
        selectClueData: [],
        selectLocationData: [],
      },
      popArr: [],
    };
  },
  mounted() {
    this.init([]);
    Bus.$on("clueManageToupdateTheMultipleDisplaySizeSmall", (data) => {
      this.selectClueData = data;
      this.concatLocationClueData();
    });
    Bus.$on("locationObjToupdateTheMultipleDisplaySizeSmall", (data) => {
      this.selectLocationData = data;
      this.concatLocationClueData();
    });
  },
  methods: {
    init(data) {
      this.$nextTick(() => {
        this.initMap(data);
      });
    },
    initMap(selectClueData) {
      const vm = this;
      this.map = new HGIS.MapEx("theMultipleDisplaySizeSmall", {
        mapLoaded: (object) => {
          vm.map.displayProjection = new HGIS.Projection("EPSG:4326");
          mapUtils.setCenter(vm.map, 120.15, 30.28);
        },
      });
      this.vectorLayer = new HGIS.Layer.Markers("Markers");
      this.map.addLayer(this.vectorLayer);
    },
    showSimplePopup(item, index) {
      mapUtils.addVueMarker(
        CluePopWindow,
        { ...item, showPop: false },
        {
          x: item.longitude,
          y: item.latitude,
          html: `<div id="${"popupWindow" + index}"></div>`,
        },
        this.map,
        "popupWindow" + index
      );
      // let divStr = `
      //     <div style="width: 100%;height: 100px;overflow: hidden;">
      //     <div style="width: 100px;height: 94px;margin: 2px;">
      //       <img src="${
      //         item.picUrl || item.image
      //       }" style="width:100%;height: 100%;"/>
      //     </div>
      //   </div>
      // `;
      // let popup = mapUtils.addPopCard(
      //   this.map,
      //   `mapSmallId${index}`,
      //   {
      //     longitude: item.longitude,
      //     latitude: item.latitude,
      //   },
      //   { width: 90, height: 100 },
      //   divStr,
      //   false
      // );
      // this.popArr.push(popup);
    },
    // 打开大地图
    openTheMultipleDisplaySizeLarge() {
      this.$emit("showLargeMap");
    },
    addCaseMarker(type) {
      if (type == "update") {
        this.map.clear();
      }
      this.mapData.selectLocationData.length > 0 &&
        this.mapData.selectLocationData.forEach((item) => {
          let iconSize = new HGIS.Size(24, 32);
          let iconPath = item.flag ? iconCamera : null;
          iconPath &&
            mapUtils.addMarker(
              this.vectorLayer,
              item.longitude,
              item.latitude,
              iconPath,
              this.map,
              iconSize,
              type === "update"
            );
        });
    },
    // 更新地图中心点
    updateCenterPoint(centerLongitude, centerLatitude) {
      let longitude = centerLongitude || 120.15;
      let latitude = centerLatitude || 30.28;
      mapUtils.setCenter(this.map, longitude, latitude);
    },
    // 拼接最新的地图数据
    concatLocationClueData() {
      this.$nextTick(() => {
        this.mapData = {
          centerPoint: this.selectLocationData.centerPoint,
          selectClueData: this.selectClueData,
          selectLocationData: this.selectLocationData.list,
        };
        if (
          !(
            this.mapData.centerPoint.longitude &&
            this.mapData.centerPoint.latitude
          )
        ) {
          if (this.mapData.selectClueData.length > 0) {
            this.mapData.centerPoint.longitude =
              this.selectClueData[0].longitude;
            this.mapData.centerPoint.latitude = this.selectClueData[0].latitude;
          } else {
            this.mapData.centerPoint.longitude = 0;
            this.mapData.centerPoint.latitude = 0;
          }
        }
        this.updateCenterPoint(
          this.mapData.centerPoint.longitude,
          this.mapData.centerPoint.latitude
        );
        this.addCaseMarker("update");
        while (this.popArr.length) {
          this.popArr.pop().destroy();
        }
        if (this.mapData.selectClueData.length > 0) {
          this.mapData.selectClueData.forEach((item, index) => {
            if (item.longitude && item.latitude) {
              this.showSimplePopup(item, index);
            }
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.theMultipleDisplaySizeSmall {
  .h-icon-windows_maximum {
    position: absolute;
    right: 0;
    bottom: 0;
    z-index: 1000;
  }
}
</style>
<style lang="scss">
.theMultipleDisplaySizeSmallPopup {
  position: relative;
  box-shadow: 0 2px 2px 1px #999;
  padding: 5px;
  &:before {
    content: "";
    width: 6px;
    height: 6px;
    position: absolute;
    bottom: -5px;
    left: 28px;
    transform: rotate(-45deg);
    background: #fff;
    border-bottom: 1px solid #999;
    border-left: 1px solid #999;
  }
  .point {
    background: url(~@/assets/images/map/icon-01.png);
    background-size: 100% 100%;
    width: 6px;
    height: 6px;
    display: inline-block;
    position: absolute;
    bottom: -22px;
    left: 28px;
  }
  p {
    text-align: center;
    color: #333;
    padding-bottom: 10px;
    font-size: 12px;
  }
}
</style>
