<template>
  <div class="theMultipleDisplaySizeLarge">
    <div
      id="theMultipleDisplaySizeLarge"
      style="width: 100%; height: 100%"
    ></div>
    <h-img-preview
      ref="single"
      :data="previewPicUrl"
      :visible.sync="previewPicVisible"
    />
  </div>
</template>

<script>
import Bus from "@/bus";
import mapUtils from "@/utils/mapUtils";
import iconCamera from "@/assets/images/map/mapCamera.png";
import CluePopWindow from "./CluePopWindow.vue";

export default {
  data() {
    return {
      map: null, // 地图对象
      vectorLayer: null, // 图层5
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
      previewPicUrl: [],
      previewPicVisible: false,
    };
  },
  mounted() {
    this.init([]);
    Bus.$on("clueManageToupdateTheMultipleDisplaySizeLarge", (data) => {
      this.selectClueData = data;
      this.concatLocationClueData();
    });
    Bus.$on("locationObjToupdateTheMultipleDisplaySizeLarge", (data) => {
      console.log(data);
      this.selectLocationData = data;
      this.concatLocationClueData();
    });
    Bus.$on("previewMapPic", (data) => {
      this.previewPicVisible = true;
      this.previewPicUrl = [data.picUrl];
    });
  },
  beforeDestroy() {
    Bus.$off("previewMapPic");
  },
  methods: {
    init(data) {
      this.$nextTick(() => {
        this.initMap(data);
      });
    },
    initMap(selectClueData) {
      const vm = this;
      this.map = new HGIS.MapEx("theMultipleDisplaySizeLarge", {
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
        { ...item, showPop: true },
        {
          x: item.longitude,
          y: item.latitude,
          html: `<div id="${"popupWindow" + index}"></div>`,
        },
        this.map,
        "popupWindow" + index
      );
      // let popup = mapUtils.addPopCard(
      //   this.map,
      //   `mapSmallId${index}`,
      //   {
      //     longitude: item.longitude,
      //     latitude: item.latitude,
      //   },
      //   { width: 120, height: 132 },
      //   divStr,
      //   false
      // );
      // this.popArr.push(popup);
      // let popTemp = document.getElementById("popupWindow" + index);
      // popTemp.addEventListener("click", () => {
      //   this.previewPicVisible = true;
      //   this.previewPicUrl = [item.picUrl];
      // });
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
    // 中心点
    addUpdateCenterMarker(type) {
      let longitude = this.mapData.centerPoint.longitude
        ? this.mapData.centerPoint.longitude
        : 120.15;
      let latitude = this.mapData.centerPoint.latitude
        ? this.mapData.centerPoint.latitude
        : 30.28;
      const point = new window.hmap.geom.Point(
        new window.hmap.basetype.Coordinate(longitude, latitude, 0)
      );
      //mark符号
      let markerSymbol = new window.hmap.style.Icon({
        opacity: 1.0,
        imgSrc: require("../../assets/images/map/icon-03.png"), //设置marker的图片路径
        size: new window.hmap.basetype.Size(32, 44), //设置marker的大小,单位为像素
      });
      const markerStyle = new window.hmap.style.Style({
        markerSymbols: [markerSymbol],
      });
      let pointFeature = new window.hmap.feature.Vector(point, {}, markerStyle);
      if (type == "update") {
        this.vectorLayer.removeAllFeatures();
        this.vectorLayer.updateFeatures([pointFeature]);
      } else {
        this.vectorLayer.addFeatures([pointFeature]);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.theMultipleDisplaySizeLarge {
  height: 100%;
  .h-icon-windows_maximum {
    position: absolute;
    right: 0;
    bottom: 0;
  }
}
</style>
<style lang="scss">
.theMultipleDisplaySizeLargePopup {
  position: relative;
  box-shadow: 0 2px 2px 1px #999;
  padding: 5px;
  &:before {
    content: "";
    width: 6px;
    height: 6px;
    position: absolute;
    bottom: -5px;
    left: 72px;
    transform: rotate(-45deg);
    background: #fff;
    border-bottom: 1px solid #999;
    border-left: 1px solid #999;
  }
  .theMultipleDisplaySizeLargePopup-point {
    background: url("../../assets/images/map/icon-01.png");
    background-size: 100% 100%;
    width: 6px;
    height: 6px;
    display: inline-block;
    position: absolute;
    bottom: -22px;
    left: 72px;
  }
  .theMultipleDisplaySizeLargePopup-flex {
    display: flex;
    span {
      flex: 0 0 43px;
    }
    p {
      flex: 1;
      word-break: break-all;
    }
  }
}
</style>
