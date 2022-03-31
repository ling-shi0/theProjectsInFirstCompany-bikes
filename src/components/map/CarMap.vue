<!--
 * @Description:
 * @Version:
 * @Author: wangXiaoMing
 * @Date: 2022-02-09 15:54:13
 * @LastEditors: DengDu
 * @LastEditTime: 2022-03-21 10:25:11
-->
<template>
  <div class="car-map-wrap">
    <div id="aroundCarMap" style="width: 100%; height: 100%"></div>
    <!-- <el-autocomplete
      class="el-input--width car-map-search-input"
      v-model="caseName"
      :props="{ value: 'caseName' }"
      :fetch-suggestions="searchCase"
      placeholder="请输入搜索关键词"
      @select="selectCase"
      @input="handle"
    ></el-autocomplete> -->
    <div class="leftBut">
      <div class="draw-type" :class="{'activeBac': isActive == 1}" @click="draw('rectangle')">
        <!-- <img src="~@/assets/images/map/icon-rectangle.png" title="绘制矩形"/> -->
        <img v-if="isActive == 1" src="~@/assets/images/map/lidaicon-map-select-rect-active.svg" alt="" title="绘制矩形">
        <img v-else src="~@/assets/images/map/lidaicon-map-select-rect.svg" alt="" title="绘制矩形">
        <!-- <img src="locationItem" /> -->
      </div>
      <div class="draw-type" :class="{'activeBac': isActive == 2}" @click="draw('polygon')">
        <!-- <img src="~@/assets/images/map/icon-polygon.png" title="绘制多边形" /> -->
        <img v-if="isActive == 2" src="~@/assets/images/map/lidaicon-map-select-poly-active.svg" alt="" title="绘制多边形">
        <img v-else src="~@/assets/images/map/lidaicon-map-select-poly.svg" alt="" title="绘制多边形">
      </div>
      <div class="draw-type" :class="{'activeBac': isActive == 3}" @click="draw('circle')">
        <!-- <img src="~@/assets/images/map/icon-circle.png" title="绘制圆形" /> -->
        <img v-if="isActive == 3" src="~@/assets/images/map/lidaicon-map-select-dot-active.svg" alt="" title="绘制圆形">
        <img v-else src="~@/assets/images/map/lidaicon-map-select-dot.svg" alt="" title="绘制圆形">
      </div>
      <div class="draw-type" :class="{'activeBac': isActive == 4}" @click="clearFeature()">
        <!-- <img src="~@/assets/images/map/icon-clear.png" title="清除" /> -->
        <img v-if="isActive == 4" src="~@/assets/images/map/lidaicon-clean-active.svg" alt="" title="清除">
        <img v-else src="~@/assets/images/map/lidaicon-clean.svg" alt="" title="清除">
      </div>
    </div>

    <!-- <div class="car-map-distance">搜索范围: {{ distance }}米</div> -->
    <!-- 下面这个层是为了给拖拽圆提供一个可以监听到鼠标位置的层 -->
    <div id="mapOperationProxyLayer"></div>
  </div>
</template>

<script>
import api from "@/api";
import rest from "@/rest";
import mapUtils from "@/utils/mapUtils";
import mapCameraIcon from "@/assets/images/map/mapCamera.png";
import mapTogetherIcon from "@/assets/images/map/togetherCamera.png";
import caseIcon from "@/assets/images/map/icon-02.png";
import carIcon from "@/assets/images/map/icon-06.png";
import Bus from "@/bus";
import moment from "moment";
import CarImgOnMap from '@/modules/page/searchCar/CarImgOnMap'

export default {
  name: "CarMap",
  props: {
    startTime: {
      type: [String, Object, Date],
      default: () => {},
    },
    endTime: {
      type: [String, Object, Date],
      default: () => {},
    },
  },
  data() {
    return {
      markersLayer: null, // 点位marker层
      caseLayer: null, // 案件图标marker层
      searchLayer: null,
      map: null,
      caseName: "",
      distance: 3000,
      dragPan: null,
      control: null,
      wktResult: "",
      mapBox: "",
      locationItem:"",
      isActive:"",
      hasMarkedCase: []
    };
  },
  mounted() {
    this.initMap();
    Bus.$on("dragCircleDistance", ({ newDistance }) => {
      this.distance = newDistance;
    });
    Bus.$on("mapLocation", (info) => {
      this.locationItem = info.item.image;
      this.locationCase(info.item);
    });
  },
  methods: {
    initMap() {
      const vm = this;
      this.dragPan = new HGIS.Control.DragPan();
      this.dragPan.documentDrag = true;
      this.map = new HGIS.MapEx("aroundCarMap", {
        controls: [this.dragPan],
        mapLoaded: (object) => {
          vm.map.displayProjection = new HGIS.Projection("EPSG:4326");
          this.initListeners();
          this.findResource();
          this.dragPan.activate();
          let zoomAnimation = new HGIS.Control.ZoomAnimation({ map: vm.map });
          vm.map.addControl(zoomAnimation);
        },
      });
      this.markersLayer = new HGIS.Layer.Markers("Markers");
      this.caseLayer = new HGIS.Layer.Markers("caseMarkers");
      this.map.addLayer(this.caseLayer);
      this.map.addLayer(this.markersLayer);

      this.searchLayer = new HGIS.Layer.Vector("searchLayer");
      this.map.addLayer(this.searchLayer);
    },
    initListeners() {
      const vm = this;
      this.map.events.register("moveend", this.map, function () {
        vm.findResource();
      });
      this.map.events.register("zoomend", this.map, function () {
        vm.findResource();
      });
      // 定位到滨江区政府附近
      mapUtils.setCenter(vm.map, 120.211871, 30.211393, 13);
    },
    findResource() {
      const mapLocation = JSON.parse(JSON.stringify(this.map.getExtent()));
      const leftBottom = new HGIS.LonLat(
        mapLocation.left,
        mapLocation.bottom
      ).transform(
        this.map.getProjectionObject(),
        new HGIS.Projection("EPSG:4326")
      );
      const rightTop = new HGIS.LonLat(
        mapLocation.right,
        mapLocation.top
      ).transform(
        this.map.getProjectionObject(),
        new HGIS.Projection("EPSG:4326")
      );
      const bbox = `${leftBottom.lon},${leftBottom.lat},${rightTop.lon},${rightTop.lat}`;
      const wkt = `${leftBottom.lon}@${leftBottom.lat},${rightTop.lon}@${leftBottom.lat},${rightTop.lon}@${rightTop.lat},${leftBottom.lon}@${rightTop.lat}`;
      this.mapBox = bbox;
      rest
        .post(api.searchCar.findResourceByMap, {
          bbox: bbox,
          width: this.map.size.w,
          height: this.map.size.h,
          collections: wkt.split(","),
          hierarchy: this.map.zoom,
        })
        .then(({ data }) => {
          this.markersLayer.clearMarkers();
          if (data && data.length) {
            data.map((item) =>
              Object.assign(item, {
                pic: item.cluster ? mapTogetherIcon : mapCameraIcon,
              })
            );
            mapUtils.addFeaturesIntoMap(data, this.markersLayer, this.map);
          }
        });
    },
    searchCase(str, cb) {
      rest
        .post(api.searchCar.searchCase, {
          startTime: moment(this.startTime).format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
          endTime: moment(this.endTime).format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
          pageNo: 1,
          pageSize: 100,
          caseName: str,
        })
        .then(({ data }) => {
          cb(data.caseInfoVOList || []);
        });
    },
    selectCase(item) {
      if(this.control) this.clearFeature();
      mapUtils.setCenter(this.map, item.longitude, item.latitude);
      mapUtils.setCenter(this.map, null, null, 13);

      // 加拖拽圆
      mapUtils.addDragBtn(
        this.map,
        {
          lon: item.longitude,
          lat: item.latitude,
        },
        this.dragPan
      );
      this.caseLayer.clearMarkers();
      this.clearCaeseImgsOnMap();
      this.caseLayer.setZIndex(799);
      // 加案件图标
      mapUtils.addSingleMark(
        this.map,
        this.caseLayer,
        caseIcon,
        item.longitude,
        item.latitude,
        { w: 54, h: 50 },
        item.detail
      );

      Bus.$emit("dragCircleDistance", {
        newDistance: 3000,
        center: {
          lon: item.longitude,
          lat: item.latitude,
        },
      });
    },
    locationCase(info) {
      console.log(info);
      console.log("caseLocation", info.id);
      // 先清除所有的marker
      // 清除车辆图标
      this.caseLayer.clearMarkers()
      // 清除车辆照片
      this.clearCaeseImgsOnMap()
      // 更新需要标记的线索列表
      let currentCaseHasMarked = false
      for(let i = 0; i < this.hasMarkedCase.length; i++) {
        if(this.hasMarkedCase[i].id === info.id) {
          currentCaseHasMarked = true
          this.hasMarkedCase.splice(i, 1)
          break
        }
      }
      if(!currentCaseHasMarked) {
        this.hasMarkedCase.push(info)
      }
      // 重新渲染需要标记的线索列表的marker
      for(let i = 0; i < this.hasMarkedCase.length; i++) {
        console.log("marker",this.hasMarkedCase[i].id);
        let longitude = this.hasMarkedCase[i].longitude;
        let latitude = this.hasMarkedCase[i].latitude;
        mapUtils.setCenter(this.map, longitude, latitude);
        mapUtils.setCenter(this.map, null, null, 13);
        this.caseLayer.setZIndex(799);

        let size = new HGIS.Size(34, 40);
        let lonlat = new HGIS.LonLat(longitude, latitude);

        // 地图上添加车辆照片
        mapUtils.addVueMarker(
          CarImgOnMap,
          {
            imgUrl: this.hasMarkedCase[i].image
          },
          {
            x: lonlat.lon,
            y: lonlat.lat,
            html: `<div id="CarImgOnMap_${this.hasMarkedCase[i].id}"></div>`
          },
          this.map,
          `CarImgOnMap_${this.hasMarkedCase[i].id}`,
          true
        )
        // 地图上添加车辆图标
        lonlat.transform(
          new HGIS.Projection("EPSG:4326"),
          this.map.getProjectionObject()
        );
        let icon = new HGIS.Icon(carIcon, size);
        let marker = new HGIS.Marker(lonlat, icon);
        // marker.events.register("click", marker, this.showPopUp);
        this.caseLayer.addMarker(marker);
      }
    },

    // showPopUp(e) {
    //   let popSize = new HGIS.Size(150, 75);
    //   let imgUrl = this.locationItem;
    //   //弹框内容
    //   let contentHTML = "<img src='https://10.33.43.58:443/ngx/proxy?i=aHR0cDovLzEwLjE2LjcwLjIyNDo2NTAxL3BpYz9BQzAxRjA2QjBEQjA0QjA3RUMwMCpoY3M2Mjk3M2NhMDg5ZWU0NDYyOTIwMjEvcGljX2NvdmVyXzdkYXkvMjUxMjM7MTY0NTc2OTE0OTc3MzE3ODM1MDE1P3BpYyoxMTkxMjQ3ODg4KjMyMTI0OCoyNjc0KkFDMDFGMDZCMERCMDRCMDdFQzAwLTIqMTY0NTc4NjkwMA' style='width:100%; height:100%; overflow:hidden'></img>";
    //   //声明普通弹框
    //   let popup = new HGIS.Popup(
    //     "popId",
    //     e.object.lonlat,
    //     popSize,
    //     contentHTML,
    //     // true
    //   );
    //   //弹框添加到地图上
    //   this.map.addPopup(popup);
    // },

    // 对地图进行圈选
    draw(type) {
      this.searchLayer.removeAllFeatures();
      if (type === "rectangle") {
        this.isActive = 1;
        if (!this.map.drawControls["rectangle"]) {
          this.control = new HGIS.Control.DrawFeature(
            this.searchLayer,
            HGIS.Handler.RegularPolygon,
            {
              handlerOptions: {
                sides: 4, //规则几何体的边数
                irregular: true,
              },
            }
          );
          this.map.drawControls["rectangle"] = this.control;
          this.map.addControl(this.control);
        } else {
          this.control = this.map.drawControls["rectangle"];
        }
      } else if (type === "circle") {
        this.isActive = 3;
        if (!this.map.drawControls["circle"]) {
          this.control = new HGIS.Control.DrawFeature(
            this.searchLayer,
            HGIS.Handler.RegularPolygon,
            {
              handlerOptions: {
                sides: 50, //条边
                irregular: false,
              },
            }
          );
          this.map.drawControls["circle"] = this.control;
          this.map.addControl(this.control);
        } else {
          this.control = this.map.drawControls["circle"];
        }
      } else if (type === "polygon") {
        this.isActive = 2;
        if (!this.map.drawControls["polygon"]) {
          this.control = new HGIS.Control.DrawFeature(
            this.searchLayer,
            HGIS.Handler.Polygon,
            {
              handlerOptions: {
                holeModifier: "altKey",
              },
            }
          );
          this.map.drawControls["polygon"] = this.control;
          this.map.addControl(this.control);
        } else {
          this.control = this.map.drawControls["polygon"];
        }
      }
      console.log(this.isActive);

      this.control.activate();
      // 在圈选完成后 调用该函数
      this.control.featureAdded = this.onAddFeature;
      this.handle("");
    },
    onAddFeature(feature) {
      if (this.control != undefined) {
        this.map.removeControl(this.control);
        this.map.stopdraw();
      }
      // 取出圈选几何图形的数据(这里是一层层取出的，应该有更好的办法)
      let component = feature.geometry.components[0];
      let len = component.components.length;
      let arrLonlat = [];
      for (let i = 0; i < len; i++) {
        var lonlat = new HGIS.LonLat(
          component.components[i].x,
          component.components[i].y
        );
        lonlat.transform(
          this.map.getProjectionObject(),
          new HGIS.Projection("EPSG:4326")
        );
        arrLonlat.push(lonlat.lon + "@" + lonlat.lat);
      }

      Bus.$emit("wktResultInfo", [
        this.mapBox,
        this.map.size.w,
        this.map.size.h,
        arrLonlat,
      ]);
    },
    // 清空
    clearFeature() {
      this.isActive = 4;
      this.searchLayer.removeAllFeatures();
      // 禁用绘画控件
      if(this.control) this.control.deactivate();
      Bus.$emit("wktResultInfo", "");
    },

    // 清空搜索框后 清除案件图标、拖曳圆; 在查询的时候也不再带有距离，经纬度参数
    handle(val) {
      if (val == "") {
        mapUtils.removeDragBtn(this.map);
        this.caseLayer.clearMarkers();
        Bus.$emit("dragCircleDistance", {
          newDistance: "",
          center: {
            lon: "",
            lat: "",
          },
        });
      }
    },
    // 清除车辆照片
    clearCaeseImgsOnMap() {
      let imgElements = document.getElementsByClassName('car-img-on-map');
      console.log(imgElements);
      for(var i = imgElements.length - 1; i >= 0; i--) {
        imgElements[i].parentNode.removeChild(imgElements[i]);
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.car-map-wrap {
  position: relative;
  width: 93%;
  height: 100%;
  margin: 0 auto;
  border: 1px solid #bebebe;
  #mapOperationProxyLayer {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1000;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
  .car-map-search-input {
    position: absolute;
    top: 16px;
    left: 16px;
    z-index: 999;
  }
  .car-map-distance {
    position: absolute;
    bottom: 16px;
    right: 16px;
    z-index: 999;
    padding: 4px;
    height: 30px;
    background: rgba(66, 66, 66, 0.5);
    border-radius: 2px;
    font: 16px/24px sans-serif;
    color: white;
  }
}
</style>
<style lang="scss">
.activeBac{
  // background-color: 	#80FFFF;
  /* border: 1px solid #000; */
}
.car-map-wrap .olControlZoom.olControlNoSelect {
  display: none;
}
.leftBut {
  cursor:pointer;
  z-index: 900;
  position: absolute;
  top: 6px;
  right: 8px;
  box-shadow: 2px 2px 3px #000;
  background-color: #fff;
  display: flex;
  flex-wrap: nowrap;
}
.draw-type {
  display: flex;
  flex-wrap: nowrap;
}
.draw-type img{
  padding: 6px;

}
</style>