<template>
  <div>
    <el-dialog title="周边案件" :visible.sync="showMap" :area="[1000, 620]" class="peripheryCaseMap">
      <h-layout style="height: 300px;" class="peripheryCaseMap-main">
        <h-layout>
          <h-layout-content>
            <div id="window.hmap" style="width:100%; height:500px;" v-if="showMap"></div>
          </h-layout-content>
        </h-layout>
        <h-layout-aside width="240px" class="peripheryCaseMap-main-aside">
          <div class="fs14 pl40 pt10 color_333" v-if="caseDetails">
            <p>
              <img
                src="../../assets/images/clueManage/icon_01.png"
                class="poa"
                style="top:-2px;left:-26px;"
              />
              {{ caseDetails.code }}
            </p>
            <p>
              <img
                src="../../assets/images/clueManage/icon_02.png"
                class="poa"
                style="top:-4px;left:-26px;"
              />
              {{ caseDetails.name }}
            </p>
            <p>
              <i
                class="h-icon-info_time poa"
                style="font-size:24px; color:#ccc;top:-4px;left:-26px;"
              ></i>
              {{ caseDetails.happenTime }}
            </p>
            <p>
              <i
                class="h-icon-info_location poa"
                style="font-size:24px; color:#ccc;top:-4px;left:-26px;"
              ></i>
              {{ caseDetails.happenPlace }}
            </p>
            <p>
              <i class="h-icon-details poa" style="font-size:22px; color:#666;top:-1px;left:-26px;"></i>
              {{ caseDetails.detail }}
            </p>
          </div>
        </h-layout-aside>
      </h-layout>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="relationCase()">关联案件</el-button>
        <el-button @click="showMap = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import helper from "@/helper";
import api from "@/api";
import rest from "@/rest";
import Bus from "@/bus";
import envconfig from "@/envconfig/envconfig";

export default {
  data() {
    return {
      showMap: false,
      vectorLayer: null, // 矢量图层对象
      map: null, // 地图对象
      caseDetails: {},
      mapParams: {
        caseLongitude: 0, // 案件经纬度
        caseLatitude: 0,
        clueLongitude: 0, // 线索经纬度
        clueLatitude: 0,
        picUrl: "",
      },
    };
  },
  methods: {
    init(data) {
      this.showMap = true;
      this.mapParams.clueLongitude = data.longitude;
      this.mapParams.clueLatitude = data.latitude;
      this.mapParams.picUrl = data.picUrl;
      this.mapParams.clueId = data.id; // 线索 id
      this.mapParams.caseCode = data.netArchiveCode; // 案件编号
      this.getCaseDetails(data.netArchiveCode);
    },
    // 获取案件详情
    getCaseDetails(caseCode) {
      let that = this;
      rest
        .get(api.clueDetails.findArchiveCase, {
          caseCode: caseCode,
        })
        .done(function (res) {
          if (helper.isSuccess(res)) {
            that.caseDetails = res.data;
            that.mapParams.caseLongitude = +that.caseDetails.happenPlaceLon;
            that.mapParams.caseLatitude = +that.caseDetails.happenPlaceLat;
            that.$nextTick(() => {
              that.initMap(that.mapParams);
            });
          } else {
            that.$message.error(res.msg);
          }
        });
    },
    initMap(mapParams) {
      let mapOptions = {
        zoom: 14, // 默认展示哪一级
        minLevel: 8, // 缩放登记
        maxLevel: 20,
        crs: new window.hmap.proj.Crs(envconfig.mapInfo.EPSG), // 坐标系
        center: new window.hmap.basetype.Coordinate(
          this.mapParams.clueLongitude ? this.mapParams.clueLongitude : 120.15,
          this.mapParams.clueLatitude ? this.mapParams.clueLatitude : 30.28,
          0
        ), // 中心点,初始化位置
      };
      // 创建地图对象
      this.map = new window.hmap.Map("window.hmap", mapOptions);
      
      const vtOptions = {
        matrixOrigin: new window.hmap.basetype.Coordinate(-180, 90), //切片原点
        dataFormat: "hvt", //切片格式
        labelOn: true,
        enableHashCode: true,
        styleUrl: envconfig.mapInfo.darkStyleUrl, //矢量切片样式文件地址
      };
      let vectorTileLayer = new window.hmap.layer.VectorTileLayer(
        "矢量切片图层",
        envconfig.mapInfo.hvtUrl,
        vtOptions
      );
      this.map.addLayer(vectorTileLayer); // 将图层添加至地图对象

      this.vectorLayer = new window.hmap.layer.VectorLayer("矢量");
      this.map.addLayer(this.vectorLayer);

      // 添加一个弹框
      this.showSimplePopup(mapParams);
      this.vectorLayer.removeAllFeatures(); // 删除所有的功能
      // 添加 mark
      this.addMarker(mapParams);
      // 添加线
      this.drawDashLine(mapParams);
    },
    // 添加弹框
    showSimplePopup(mapParams) {
      let divStr;
      if (mapParams.picUrl) {
        divStr = `
                    <div class="peripheryCaseMapPopup" style="background:#fff;">
                        <span class="peripheryCaseMapPopup-point"></span>
                        <img src=${mapParams.picUrl} style='width:100%;height:100%;'>
                    </div>
                `;
      } else {
        divStr = `
                        <div class="peripheryCaseMapPopupNoPic" style="background:#fff;">
                        <span class="peripheryCaseMapPopupNoPic-point"></span>
                    </div>
                    `;
      }
      let ele = document.createElement("div");
      ele.innerHTML = divStr;
      ele.style = "width:140px;position: absolute;bottom: 23px;left:-70px;";
      const coord1 = new window.hmap.basetype.Coordinate(
        mapParams.clueLongitude,
        mapParams.clueLatitude,
        0
      );
      let simplePopup = new window.hmap.overlay.SimplePopup({
        location: coord1,
        element: ele,
      });
      //                let pt = new window.hmap.geom.Point(coord1);
      //                let feature = new window.hmap.feature.Vector(pt);
      //                this.vectorLayer.addFeature(feature);
      let overlayLayer = new window.hmap.layer.OverlayLayer("overlay");
      this.map.addLayer(overlayLayer);
      overlayLayer.addOverlay(simplePopup);
    },
    // 添加 mark
    addMarker(mapParams) {
      const point = new window.hmap.geom.Point(
        new window.hmap.basetype.Coordinate(
          mapParams.caseLongitude,
          mapParams.caseLatitude
        )
      );
      //mark符号
      let markerSymbol = new window.hmap.style.Icon({
        opacity: 1.0, //设置marker的透明度，可以为[0,1]区间内的任意值，0表示完全透明，1表示完全不透明
        imgSrc: require("../../assets/images/map/icon-02.png"), //设置marker的图片路径
        size: new window.hmap.basetype.Size(54, 50), //设置marker的大小,单位为像素
      });
      const markerStyle = new window.hmap.style.Style({
        markerSymbols: [markerSymbol],
      });
      let pointFeature = new window.hmap.feature.Vector(point, {}, markerStyle);

      this.vectorLayer.addFeatures([pointFeature]);
    },
    // 添加线
    drawDashLine(mapParams) {
      const line = new window.hmap.geom.Line([
        new window.hmap.geom.Point(
          new window.hmap.basetype.Coordinate(
            mapParams.caseLongitude,
            mapParams.caseLatitude
          )
        ),
        new window.hmap.geom.Point(
          new window.hmap.basetype.Coordinate(
            mapParams.clueLongitude,
            mapParams.clueLatitude
          )
        ),
      ]);
      //this.vectorLayer.removeAllFeatures();
      const lineSymbol = new window.hmap.style.LineSymbol({
        width: 1, //宽度定义为20px
        color: new window.hmap.style.Color(255, 0, 0, 1),
        lineStyle: "dash", //线型，包括'dot'、'dash'、'dashdot'、'longdash'、'longdashdot'和 'solid'，默认为'solid'（实线）。
      });
      const lineStyle = new window.hmap.style.Style({
        lineSymbols: [lineSymbol],
      });
      let lineFeature = new window.hmap.feature.Vector(line, null, lineStyle);
      this.vectorLayer.addFeatures([lineFeature]);
    },
    // 关联案件
    relationCase() {
      let that = this;
      rest
        .get(api.caseIntelligence.relationCaseAndClue, {
          clueId: that.mapParams.clueId,
          caseCode: that.mapParams.caseCode,
          archiveId: that.mapParams.archiveId,
        })
        .done(function (res) {
          if (helper.isSuccess(res)) {
            that.$message.success("关联成功");
            that.showMap = false;
            Bus.$emit("updateClueManage");
          } else {
            that.$message.error(res.msg);
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.peripheryCaseMap {
  .peripheryCaseMap-main {
    .peripheryCaseMap-main-aside {
      p {
        position: relative;
        margin-bottom: 10px;
      }
    }
  }
}
</style>
<style lang="scss">
.peripheryCaseMapPopup {
  position: relative;
  box-shadow: 0 2px 2px 1px #999;
  padding: 5px;
  &:before {
    content: "";
    width: 12px;
    height: 12px;
    position: absolute;
    bottom: -8px;
    left: 63px;
    transform: rotate(-45deg);
    background: #fff;
    border-bottom: 2px solid #999;
    border-left: 2px solid #999;
  }
  .peripheryCaseMapPopup-point {
    background: url("../../assets/images/map/icon-01.png");
    background-size: 100% 100%;
    width: 24px;
    height: 24px;
    display: inline-block;
    position: absolute;
    bottom: -28px;
    left: 63px;
  }
}
.peripheryCaseMapPopupNoPic {
  position: relative;
  .peripheryCaseMapPopupNoPic-point {
    background: url("../../assets/images/map/icon-01.png");
    background-size: 100% 100%;
    width: 24px;
    height: 24px;
    display: inline-block;
    position: absolute;
    bottom: -28px;
    left: 63px;
  }
}
</style>
