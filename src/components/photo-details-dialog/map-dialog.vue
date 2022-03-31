<template>
  <el-dialog
    class="mapDialog"
    title="选取坐标"
    :visible="mapVisible"
    :area="[1200, 766]"
    top="middle"
    no-scrollbar
    @close="close"
  >
    <div class="mapDialog-wrap por">
      <div id="mapDialog"></div>
      <div class="mapDialog-wrap-info">
        <el-row>
          <el-col :span="12">
            <el-input placeholder="请输入" v-model="mapObj.longitude">
              <template slot="prepend"
                ><span class="fontBorder">经度</span></template
              >
            </el-input>
          </el-col>
          <el-col :span="12">
            <el-input placeholder="请输入" v-model="mapObj.latitude">
              <template slot="prepend"
                ><span class="fontBorder">纬度</span></template
              >
            </el-input>
          </el-col>
        </el-row>
      </div>
    </div>
    <div slot="footer">
      <el-button type="primary" @click="saveMap()"> 确 定 </el-button>
      <el-button @click="close">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import mapUtils from "@/utils/mapUtils";
import icon1 from "@/assets/images/map/mapCamera.png";

export default {
  name: "MapDialog",
  props: {
    longitude: {
      type: Number,
      default: 0,
    },
    latitude: {
      type: Number,
      default: 0,
    },
    visible: {
      type: Boolean,
    },
  },
  data() {
    return {
      mapObj: {
        longitude: 0,
        latitude: 0,
      },
      map: null, // 地图对象
      plot: null,
      mapVisible: false,
      markersLayer: null,
    };
  },
  watch: {
    longitude(val) {
      this.mapObj.longitude = val;
    },
    latitude(val) {
      this.mapObj.latitude = val;
    },
    visible(val) {
      this.mapVisible = val;
      if (val) {
        this.$nextTick(() => {
          if (!this.map) {
            this.init();
          } else {
            this.markersLayer.clearMarkers();
            mapUtils.setCenter(
              this.map,
              this.mapObj.longitude ? this.mapObj.longitude : 120.15,
              this.mapObj.latitude ? this.mapObj.latitude : 30.28
            );
            this.mapObj.longitude &&
              mapUtils.addMarker(
                this.markersLayer,
                this.mapObj.longitude,
                this.mapObj.latitude,
                icon1,
                this.map,
                new HGIS.Size(16, 21),
                true
              );
          }
        });
      }
    },
  },
  methods: {
    init() {
      this.initMap();
    },
    initMap() {
      const vm = this;
      this.map = new HGIS.MapEx("mapDialog", {
        mapLoaded: (object) => {
          vm.map.displayProjection = new HGIS.Projection("EPSG:4326");
          mapUtils.setCenter(
            vm.map,
            this.mapObj.longitude ? this.mapObj.longitude : 120.15,
            this.mapObj.latitude ? this.mapObj.latitude : 30.28
          );
          this.addPlot();
          this.mapObj.longitude &&
            mapUtils.addMarker(
              this.markersLayer,
              this.mapObj.longitude,
              this.mapObj.latitude,
              icon1,
              this.map,
              new HGIS.Size(16, 21),
              true
            );
        },
      });
      this.markersLayer = new HGIS.Layer.Markers("Markers");
      this.map.addLayer(this.markersLayer);
    },
    close() {
      this.mapVisible = false;
      this.$emit("changeVisible");
    },
    saveMap() {
      this.$emit("saveMap", JSON.stringify(this.mapObj));
      this.$emit("changeVisible");
      this.mapVisible = false;
    },
    // 标注点位函数
    addPlot() {
      const vectorLayer = new HGIS.Layer.Vector("Vector Layer");
      this.map.addLayer(vectorLayer);
      this.map.draw(
        "point",
        vectorLayer,
        "geometry",
        "点击以后标记位置",
        { keepOn: true, ifClear: true },
        (param) => this.drawAMarker(param),
        null
      );
    },
    drawAMarker(param) {
      if (this.markersLayer) {
        this.markersLayer.clearMarkers();
      }
      let lonlat = new HGIS.LonLat(param.x, param.y);
      lonlat = lonlat.transform(
        this.map.getProjectionObject(),
        this.map.displayProjection
      );
      this.result = [
        Number(lonlat.lon).toFixed(6),
        Number(lonlat.lat).toFixed(6),
      ];
      this.mapObj.longitude = Number(lonlat.lon).toFixed(6);
      this.mapObj.latitude = Number(lonlat.lat).toFixed(6);
      this.markersLayer = mapUtils.addMarkers(
        {
          x: Number(lonlat.lon).toFixed(6),
          y: Number(lonlat.lat).toFixed(6),
          type: "stick-tab",
          html: `<div class="stick-tab-icon"></div>`,
          offsetX: -8,
          offsetY: -10,
          isTransform: true,
        },
        this.map
      );
    },
  },
};
</script>

<style lang="scss" scope>
.mapDialog {
  overflow: hidden;
  .mapDialog-wrap {
    #mapDialog {
      width: 100%;
      height: 650px;
    }
    .mapDialog-wrap-info {
      position: absolute;
      top: 0;
      left: 50%;
      z-index: 1000;
      transform: translateX(-50%);
      ::v-deep .el-input el-input-group {
        width: 250px;
      }
    }
  }
}
.stick-tab-icon {
  width: 16px;
  height: 21px;
  background: url(~@/assets/images/map/mapCamera.png) no-repeat;
  background-size: 100% 100%;
}
</style>
