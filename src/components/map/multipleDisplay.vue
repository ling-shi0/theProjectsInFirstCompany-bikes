<template>
  <el-dialog
    class="map-dialog"
    title="坐标定位"
    :visible="visible"
    :area="[850, 520]"
    top="middle"
    no-scrollbar
    @close="close"
  >
    <div id="hmap" style="width: 100%; height: 461px" class="case-map"></div>
    <h-img-preview ref="single" :data="previewPicUrl" :visible.sync="previewPicVisible" />
  </el-dialog>
</template>

<script>
import mapUtils from "@/utils/mapUtils";
import icon1 from "@/assets/images/map/icon-01.png";

export default {
  name: "MapDialog",
  props: ["visible", "lonlat"],
  data () {
    return {
      map: null,
      markersLayer: null, // 手动打点图层
      activeLayer: null, // 左侧列表点击打点图层
      tabsLayer: null, // 地标打点图层
      vectorLayer: null,
      center: {
        defaultLon: 117.3,
        defaultLat: 39.72,
        defaultLevel: 13
      },
      keyWord: "",
      list: [],
      mouseIndex: null,
      activeIndex: null,
      mapOpt: null,
      previewPicUrl: [],
      previewPicVisible: false,
      popWindows: []
    };
  },
  watch: {
    visible (val) {
      if (val) {
        this.$nextTick(() => {
          if (!this.map) {
            this.init();
          } else if (this.lonlat.length > 0) {
            if (this.mapOpt) {
              this.mapOpt.clear();
              this.map.clear();
            }
            this.markersLayer.clearMarkers();
            this.addElements();
          }
        });
      }
    }
  },
  methods: {
    addElements () {
      let vm = this;
      let points = [];
      while (this.popWindows.length) {
        this.popWindows.pop().destroy();
      }
      this.lonlat.forEach((item, index) => {
        mapUtils.addMarker(
          this.markersLayer,
          item.longitude.toFixed(6),
          item.latitude.toFixed(6),
          icon1,
          vm.map,
          { w: 30, h: 30 },
          { w: 16, h: 16 }
        );
        let id = 'popupWindow' + ((index + 1) * Math.random());
        let tempCard = mapUtils.addPopCard(
          vm.map,
          `popCard${index}`,
          item,
          {
            width: 120,
            height: 156
          },
          `<div style="width: 100%;height: 152px;overflow: hidden;" id="${id}">
            <div style="width: 100%;height: 132px;">
              <img src="${item.picUrl || item.image}" style="width:100%;height: 100%;"/>
            </div>
            <div style="text-align: center;color: black;">
            ${item.passTime || "未知时间"}
            </div>
          </div>`,
          false
        );
        this.popWindows.push(tempCard);
        points.push({
          longitude: +item.longitude.toFixed(6),
          latitude: +item.latitude.toFixed(6)
        });
        let popTemp = document.getElementById(id);
        popTemp.addEventListener('click', () => {
          this.previewPicVisible = true;
          this.previewPicUrl.pop();
          this.previewPicUrl.push(item.picUrl || item.image);
        });
      });
      var lineStyle = {
        strokeWidth: 1,
        stroke: true,
        strokeColor: "red",
        strokeLinecap: "square",
        strokeDashstyle: "dashdot"
      };
      mapUtils.addLineString(points, lineStyle, vm.vectorLayer, vm.map);
    },
    /* eslint-disable no-undef */
    init () {
      const vm = this;
      this.map = new HGIS.MapEx("hmap", {
        mapLoaded: (object) => {
          vm.map.displayProjection = new HGIS.Projection("EPSG:4326");
          mapUtils.setCenter(
            vm.map,
            vm.lonlat[0].longitude.toFixed(6),
            vm.lonlat[0].latitude.toFixed(6)
          );
          this.addElements();
        }
      });
      this.markersLayer = new HGIS.Layer.Markers("Markers");
      this.vectorLayer = new HGIS.Layer.Vector("Vector Layer");
      this.map.addLayer(this.markersLayer);
      this.map.addLayer(this.vectorLayer);
      this.mapOpt = new HGIS.Plot.MapOperate(this.map);
    },
    close () {
      this.$emit("update:visible", false);
    },
    submit () {
      this.$emit("submit", this.result);
      this.$emit("update:visible", false);
    },
    empty () {
      this.total = 0;
      this.list = [];
    },
    setActive (item, index) {
      if (this.activeLayer) {
        clearMarkers(this.activeLayer);
      }
      if (this.markersLayer) {
        clearMarkers(this.markersLayer);
      }
      this.activeIndex = index;
      this.activeLayer = addMarker(
        {
          x: Number(item.longitude).toFixed(6),
          y: Number(item.latitude).toFixed(6),
          type: "tabIconActive",
          html: `<div class="tab-icon-active"></div>`,
          offsetX: -18,
          offsetY: -40,
          isCenter: true
        },
        this.map
      );
      this.result = [
        Number(item.longitude).toFixed(6),
        Number(item.latitude).toFixed(6)
      ];
    },
    drawComplete (param) {
      let lonlat = new HGIS.LonLat(param.x, param.y);
      lonlat = lonlat.transform(
        this.map.getProjectionObject(),
        this.map.displayProjection
      );
      this.result = [
        Number(lonlat.lon).toFixed(6),
        Number(lonlat.lat).toFixed(6)
      ];
      if (this.activeLayer) {
        clearMarkers(this.activeLayer);
      }
      if (this.markersLayer) {
        clearMarkers(this.markersLayer);
      }

      this.markersLayer = addMarker(
        {
          x: Number(lonlat.lon).toFixed(6),
          y: Number(lonlat.lat).toFixed(6),
          type: "stick-tab",
          html: `<div class="stick-tab-icon"></div>`,
          offsetX: -8,
          offsetY: -10,
          isTransform: true
        },
        this.map
      );
    }
  }
};
</script>
<style lang="scss" scope>
.map-dialog {
  .el-dialog__body {
    padding: 0;
  }
}
.case-map {
  width: 100%;
  height: 500px;
}
.result-wrap {
  width: 480px;
  position: absolute;
  left: 332px;
  top: 16px;
  z-index: 999;
}
.box-card {
  position: absolute;
  left: 16px;
  top: 16px;
  margin-bottom: 16px;
  z-index: 999;
  width: 300px;
  height: 644px;
  display: flex;
  flex-direction: column;
}
.card-total {
  border-bottom: 1px solid #ebebeb;
  line-height: 40px;
  height: 40px;
  font-size: 14px;
  padding: 0 12px;
  div {
    display: inline-block;
  }
  .card-blue-cut {
    width: 2px;
    height: 14px;
    background-color: #2080f7;
    margin-right: 12px;
    vertical-align: -2px;
  }
  .card-total-wrap {
    color: rgba(0, 0, 0, 0.9);
    .text-gray {
      color: #ccc;
    }
    .text-orange {
      color: #ff952c;
    }
  }
  .card-operate {
    float: right;
    margin-top: 4px;
  }
}
.card-content {
  flex: 1;
  overflow: hidden;
  .card-content-item {
    height: 40px;
    line-height: 40px;
    padding: 0 12px;
    background-color: #fff;
    cursor: pointer;
    &.active {
      background-color: #eef5ff;
    }
  }
}
.card-footer {
  height: 40px;
  padding-top: 4px;
  .card-footer-pagination {
    text-align: center;
  }
}
</style>
<style lang="scss">
.el-dialog__body {
  position: relative;
}
.map-dialog {
  .el-card__header {
    padding: 8px 12px;
  }
  .el-card__body {
    padding: 0;
    flex: 1;
    display: flex;
    overflow: hidden;
    flex-direction: column;
  }
  .el-input--width {
    width: 100%;
  }
}
.result-wrap .el-input-group {
  width: 50%;
}
/*.tab-icon {
  width: 36px;
  height: 36px;
  background: url(../../assets/images/map/map-tab.png) no-repeat;
  // background-color: red;
  color: #fff;
  text-align: center;
  line-height: 28px;
  font-size: 14px;
  font-weight: 600;
  // border-radius: 50%;
}
.tab-icon-active {
  width: 35px;
  height: 36px;
  background: url(../../assets/images/map/map-tab-active.png) no-repeat;
}
.stick-tab-icon {
  width: 16px;
  height: 21px;
  background: url(../../assets/images/map/stick-tab.png) no-repeat;
}
.case-map-scroll-wrap {
  position: relative;
  height: 100%;
  // overflow-y: auto;
  overflow-x: hidden;
  padding-right: 4px;
}*/
</style>
