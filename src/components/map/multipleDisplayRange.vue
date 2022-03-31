<template>
  <div class="multipleDisplayRange">
    <div id="multipleDisplayRange" style="width: 100%; height: 300px"></div>
  </div>
</template>

<script>
import $ from "jquery";
import Bus from "@/bus";
import envconfig from "@/envconfig/envconfig";
import mapUtils from "@/utils/mapUtils";
import icon3 from "@/assets/images/map/mapCamera.png";
import icon2 from "@/assets/images/map/icon-02.png";

export default {
  props: ["mapParamsObj"],
  watch: {
    mapParamsObj(val) {
      this.mapParams = val;
    },
  },
  data() {
    return {
      map: null, // 地图对象
      vectorLayer: null, // 图层1
      vectorLayer2: null, // 图层2
      vectorLayer3: null, // 图层3
      mapParams: {}, // 地图数据
      markersLayer: null,
      markersLayer2: null,
    };
  },
  mounted() {
    this.init(this.mapParams);
    Bus.$on("multipleDisplayRange", (data) => {
      this.mapParams = data;
      if (!this.map) {
        this.init(this.mapParams);
      }
      this.addUpdateMarker("update");
      this.addUpdateCircle("update");
      this.updateCenterPoint();
      this.addCaseMarker("update");
    });
  },
  methods: {
    init(data) {
      this.mapParams = data;
      this.$nextTick(() => {
        this.setMapHeight();
        this.initMap();
      });
    },
    initMap() {
      const vm = this;
      this.map = new HGIS.MapEx("multipleDisplayRange", {
        mapLoaded: (object) => {
          vm.map.displayProjection = new HGIS.Projection("EPSG:4326");
          let scale = this.judgeInterval(this.mapParams.centerPoint.distance);
          if (
            this.mapParams.centerPoint &&
            this.mapParams.centerPoint.longitude
          ) {
            mapUtils.setCenter(
              vm.map,
              this.mapParams.centerPoint.longitude.toFixed(6),
              this.mapParams.centerPoint.latitude.toFixed(6),
              scale
            );
            mapUtils.addMarker(
              this.markersLayer,
              this.mapParams.centerPoint.longitude.toFixed(6),
              this.mapParams.centerPoint.latitude.toFixed(6),
              icon3,
              vm.map
            );
          } else {
            mapUtils.setCenter(vm.map, 120.24224, 30.21415, 15);
          }
          this.addUpdateCircle();
          this.addCaseMarker();
        },
      });
      this.vectorLayer = new HGIS.Layer.Vector("Vector");
      this.markersLayer = new HGIS.Layer.Markers("Markers");
      this.markersLayer2 = new HGIS.Layer.Markers("Markers");
      this.map.addLayer(this.vectorLayer);
      this.map.addLayer(this.markersLayer);
      this.map.addLayer(this.markersLayer2);
    },
    // 添加 mark
    addUpdateMarker(type) {
      if (type == "update") {
        this.markersLayer.clearMarkers();
      }
      var lonlat = new HGIS.LonLat(
        this.mapParams.centerPoint.longitude,
        this.mapParams.centerPoint.latitude
      );
      lonlat.transform(
        new HGIS.Projection("EPSG:4326"),
        this.map.getProjectionObject()
      );
      mapUtils.addMarker(
        this.markersLayer,
        (this.mapParams.centerPoint.longitude
          ? this.mapParams.centerPoint.longitude
          : 120.24224
        ).toFixed(6),
        (this.mapParams.centerPoint.latitude
          ? this.mapParams.centerPoint.latitude
          : 30.21415
        ).toFixed(6),
        icon3,
        this.map
      );
      // if (type == "update") {
      //   this.vectorLayer3.removeAllFeatures();
      //   this.vectorLayer3.updateFeatures([pointFeature]);
      // } else {
      //   this.vectorLayer3.addFeatures([pointFeature]);
      // }
    },
    // 添加 圆形面
    addUpdateCircle(type) {
      if (type === "update") {
        this.vectorLayer.removeAllFeatures();
      }
      var lonlat = new HGIS.LonLat(
        this.mapParams.centerPoint.longitude,
        this.mapParams.centerPoint.latitude
      );
      lonlat.transform(
        new HGIS.Projection("EPSG:4326"),
        this.map.getProjectionObject()
      );
      var circleCenter = new HGIS.Geometry.Point(lonlat.lon, lonlat.lat);
      var circle = new HGIS.Utils.createCircle(
        circleCenter,
        this.mapParams.centerPoint.distance
      ); // 第一个参数为圆心的位置,第二个参数为圆的半径
      let style = {
        fill: true, //是否填充
        fillColor: "rgba(239,70,70,0.10)",
        strokeColor: "#EF4646",
        strokeWidth: "1px",
      };
      var circleVector = new HGIS.Feature.Vector(circle, {}, style);
      this.vectorLayer.addFeatures(circleVector);
      this.map.addLayer(this.vectorLayer);
    },
    // 设置地图的高度
    setMapHeight() {
      $("#multipleDisplayRange").css({
        height: this.mapParams.centerPoint.scrollheight + "px",
      });
    },
    // 添加多个案件 mark
    addCaseMarker(type) {
      if (type == "update") {
        this.markersLayer2.clearMarkers();
      }
      this.mapParams.listData.length > 0 &&
        this.mapParams.listData.forEach((item) => {
          mapUtils.addMarker(
            this.markersLayer2,
            item.happenPlaceLon,
            item.happenPlaceLat,
            icon2,
            this.map,
            { w: 50, h: 50 }
          );
        });
    },
    // 拾取函数
    activePick() {
      this.map.event.register(EventType.MAPMOUSEEVENT_CLICK, this.mapClick);
    },
    // 地图事件
    mapClick(event) {
      let mapPixel = event.mapPixel;
      let results = this.map.detectFeaturesAtPixel(mapPixel);
      let object = results[0];

      if (object && object instanceof window.hmap.feature.Vector) {
        let selectfeature = object;
        selectfeature.setHighlight(true);

        this.mapParams.listData.forEach((item) => {
          this.multipleMarker(item, "icon-04"); // 全部清为默认
          if (selectfeature._attributes.code == item.code) {
            Bus.$emit("selectMarker", selectfeature._attributes.code);
            this.$nextTick(() => {
              // 略有问题，共用方法会有 bug
              this.multipleMarker2(item, "icon-05");
            });
          }
        });
      } else {
        this.mapParams.listData.forEach((item) => {
          this.multipleMarker(item, "icon-04");
        });
      }
    },
    // 点击其他的时候，mark 恢复默认
    multipleMarker(item, imgName) {
      this.mapParams.listData.forEach((item) => {
        const point = new window.hmap.geom.Point(
          new window.hmap.basetype.Coordinate(
            +item.happenPlaceLon,
            +item.happenPlaceLat,
            0
          )
        );
        //mark符号
        let markerSymbol = new window.hmap.style.Icon({
          opacity: 1.0,
          imgSrc: require(`../../assets/images/map/${imgName}.png`),
          size: new window.hmap.basetype.Size(32, 44), //设置marker的大小,单位为像素
        });
        const markerStyle = new window.hmap.style.Style({
          markerSymbols: [markerSymbol],
        });
        let ointFeature = new window.hmap.feature.Vector(
          point,
          {
            code: item.code,
          },
          markerStyle
        );

        this.vectorLayer2.updateFeatures([ointFeature]);
      });
    },
    multipleMarker2(item, imgName) {
      const point = new window.hmap.geom.Point(
        new window.hmap.basetype.Coordinate(
          +item.happenPlaceLon,
          +item.happenPlaceLat,
          0
        )
      );
      //mark符号
      let markerSymbol = new window.hmap.style.Icon({
        opacity: 1.0,
        imgSrc: require(`../../assets/images/map/${imgName}.png`),
        size: new window.hmap.basetype.Size(32, 44), //设置marker的大小,单位为像素
      });
      const markerStyle = new window.hmap.style.Style({
        markerSymbols: [markerSymbol],
      });
      let newPointFeature = new window.hmap.feature.Vector(
        point,
        {
          code: item.code,
        },
        markerStyle
      );
      this.vectorLayer2.updateFeatures([newPointFeature]);
    },
    judgeInterval(distance) {
      let arr = [
        0,
        1000,
        3000,
        5000,
        9000,
        30000,
        50000,
        70000,
        130000,
        250000,
        500000,
        1000000,
        2000000,
      ];
      let interval = [];
      arr.reverse().forEach((item, index) => {
        interval.push({
          min: item,
          value: 4 + index,
        });
      });
      for (let i = 0; i < interval.length; i++) {
        if (distance >= interval[i].min) {
          return interval[i].value;
        }
      }
    },
    // 更新地图中心点
    updateCenterPoint() {
      let scale = this.judgeInterval(this.mapParams.centerPoint.distance);
      mapUtils.setCenter(
        this.map,
        (this.mapParams.centerPoint.longitude
          ? this.mapParams.centerPoint.longitude
          : 120.24224
        ).toFixed(6),
        (this.mapParams.centerPoint.latitude
          ? this.mapParams.centerPoint.latitude
          : 30.21415
        ).toFixed(6),
        scale
      );
    },
  },
};
</script>
<style lang="scss" >
#multipleDisplayRange .olControlLayerSwitchEx {
  > img {
    display: none;
  }
}
</style>
