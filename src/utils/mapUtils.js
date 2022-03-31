import Vue from 'vue';
import DragCircle from '@/components/map/DragCircle.vue'
import Bus from "@/bus";

const mapUtils = {
  vueMarkerCache: {},
  setCenter(map, x, y, roomSize) {
    var lonlat = new HGIS.LonLat(x, y);
    lonlat.transform(
      new HGIS.Projection("EPSG:4326"),
      map.getProjectionObject()
    );
    map.setCenter(lonlat, roomSize || 12);
  },
  addPoint(x, y, pointStyle, vectorLayer, map) {
    //新建一个点Geometry 参数需要点的经度纬度
    var lonlat = new HGIS.LonLat(x, y);
    lonlat.transform(
      new HGIS.Projection("EPSG:4326"),
      map.getProjectionObject()
    );
    var point = new HGIS.Geometry.Point(Number(lonlat.lon), Number(lonlat.lat));
    //将几何对象转化为是矢量要素类
    let pointVector = new HGIS.Feature.Vector(point, {}, pointStyle);
    //将矢量要素类放入图层中
    vectorLayer.addFeatures(pointVector);
  },
  
  addLineString(points, lineStyle, vectorLayer, map) {
    let tracePoints = [];
    for (let i in points) {
      var pt = new HGIS.Geometry.Point(
        Number(points[i].longitude),
        Number(points[i].latitude)
      ).transform(map.displayProjection, map.getProjectionObject());
      tracePoints.push(pt);
    }
    var lineString = new HGIS.Geometry.LineString(tracePoints);
    let lineStringVector = new HGIS.Feature.Vector(lineString, {}, lineStyle);
    vectorLayer.addFeatures(lineStringVector);
  },

  addPopCard(map, id, lonlat, size, dom, showClose, windowclose) {
    var transLonlat = new HGIS.LonLat(lonlat.longitude, lonlat.latitude);
    transLonlat.transform(
      new HGIS.Projection("EPSG:4326"),
      map.getProjectionObject()
    );
    var anchor = {
      size: new HGIS.Size(0, 0),
      offset: new HGIS.Pixel(0, 0)
    };
    // 设置弹框的大小
    var popSize = new HGIS.Size(size.width, size.height);
    //声明普通弹框
    var popup = new HGIS.Popup.InfoWindow(
      id,
      transLonlat,
      popSize,
      "",
      dom,
      anchor,
      showClose,
      windowclose
    );
    map.addPopup(popup);
    return popup;
  },

  addMarker(markersLayer, x, y, iconpath, map, newSize, newOffset) {
    //Marker的大小
    var size = new HGIS.Size(
      (newSize && newSize.w) || 25,
      (newSize && newSize.h) || 30
    );
    //Marker相对于添加坐标点的偏移量 像素单位
    var offset = new HGIS.Pixel(
      -(newOffset && newOffset.w) || -5,
      -(newOffset && newOffset.h) || -5
    );
    //marker的坐标位置
    var lonlat = new HGIS.LonLat(x, y);
    lonlat.transform(
      new HGIS.Projection("EPSG:4326"),
      map.getProjectionObject()
    );
    //marker使用的ico图标
    var icon = new HGIS.Icon(iconpath, size, offset);
    var marker = new HGIS.Marker(lonlat, icon);
    //添加marker到markers图层上面
    markersLayer.addMarker(marker);
  },

  addCircle(center, radius, layer) {
    let circleCenter = new HGIS.Geometry.Point(
      center.lon,
      center.lat
    );
    let circle = new HGIS.Utils.createCircle(circleCenter, radius); // 第一个参数为圆心的位置,第二个参数为圆的半径
    let circleVector = new HGIS.Feature.Vector(circle);
    layer.addFeatures(circleVector);
  },

  addMarkers(param, map) {
    const layers = {};
    param = Object.assign(
      {
        type: "default", // 如果不需要设置显示隐藏，使用默认值即可
        offsetX: 0, // 默认值为（0,0）,单位是像素，代表偏移量，默认定位在html的（0,0）的位置
        offsetY: 0,
        html: null, // 必传，marker显示的div
        x: undefined, // 必传，代表经纬度
        y: undefined,
        clickEvent: null, // marker的点击事件，如果不需要注册点击就可以不传入
        clickEventParam: null, // clickEventParam marker的点击事件返回的参数，如果不需要可以不传入
        isCenter: false, // 默认false, 居中定位
        isTransform: true, // 是否转换坐标系
        mouseMoveEvent: null
      },
      param
    );
    const type = param.type;
    if (!layers.hasOwnProperty(type)) {
      layers[type] = new HGIS.Layer.GraphicLayer(type);
      layers[type].id = type;
      layers[type].visible = true;
      map.addLayer(layers[type]);
    }
    const layer = layers[type];
    const id = param.id;
    const offset = new HGIS.Pixel(param.offsetX, param.offsetY);
    let lonlat = new HGIS.LonLat(param.x, param.y);
    if (param.isTransform) {
      lonlat = lonlat.transform(
        map.displayProjection,
        map.getProjectionObject()
      );
    }
    if (layer.markers.hasOwnProperty(id)) {
      const marker = layer.markers[id];
      layer.removeMarker(marker);
    }
    const icon = new HGIS.Symbolizer.HtmlIcon(
      param.html,
      new HGIS.Size(0, 0),
      offset
    );
    icon.display(layer.visible);
    const marker = new HGIS.Marker.MarkerEx(lonlat, icon);
    marker.id = id;
    if (param.clickEvent) {
      marker.clickEventParam = param.clickEventParam;
      marker.events.register("click", marker, e => {
        param.clickEvent(e.object.clickEventParam);
      });
    }
    layer.markerLayer.setZIndex(800)
    layer.addMarker(marker);
    if (param.isCenter) {
      map.setCenter(lonlat);
    }
    return { layer, marker };
  },

  addVueMarker(component, propsData, mapParam, map, domId, needCache) {
    mapParam = Object.assign(
      {
        id: +new Date(), // 唯一值
        type: 'default', // 如果不需要设置显示隐藏，使用默认值即可
        offsetX: 0, // 默认值为（0,0）,单位是像素，代表偏移量，默认定位在html的（0,0）的位置
        offsetY: 0,
        html: null, // 必传，marker显示的div
        color: null, // 点位颜色
        num: null, // 点位标号
        x: undefined, // 必传，代表经纬度
        y: undefined,
        clickEvent: null, // marker的点击事件，如果不需要注册点击就可以不传入
        clickEventParam: null, // clickEventParam marker的点击事件返回的参数，如果不需要可以不传入
        isCenter: false, // 默认false, 居中定位
        isTransform: true, // 是否转换坐标系
        mouseMoveEvent: null
      },
      mapParam
    );
    let markerLayer = this.addMarkers(mapParam, map);
    const orbitTemplate = Vue.extend(component);
    // eslint-disable-next-line new-cap
    const infoContent = new orbitTemplate({
      propsData: { propsData }
    });
    infoContent.$mount(`#${domId}`);
    if (needCache) {
      this.vueMarkerCache[domId] = markerLayer
    }
  },
  /**
   * @description: 拖拽按钮移动事件
   * @param {*} map
   * @param {*} layer
   * @param {*} center
   * @param {*} dragPan
   * @return {*}
   * @author: wangXiaoMing
   */
  dragBtnMouseMove(map, layer, center, dragPan) {
    //圆
    this.deactiveMapMove(map);
    layer.removeAllFeatures();
    let tempLayer = document.getElementById('mapOperationProxyLayer')
    tempLayer.style.pointerEvents = 'auto'
    let newDistance = 3000;
    tempLayer.addEventListener('mousemove', (e) => {
      let lonlat = map.getLonLatFromPixel({ x: e.offsetX, y: e.offsetY });
      let distance = HGIS.Utils.caculateDistance(lonlat, center)
      layer.removeAllFeatures();
      this.addCircle(center, distance, layer);
      this.vueMarkerCache['draggableCircleWrap'].layer.removeMarker(this.vueMarkerCache['draggableCircleWrap'].marker)
      lonlat.transform(
        map.getProjectionObject(),
        new HGIS.Projection("EPSG:4326")
      );
      newDistance = distance;
      this.addVueMarker(
        DragCircle,
        {
          distance,
          mouseMoveFun: () => { dragPan.deactivate(); this.dragBtnMouseMove(map, layer, center, dragPan) }
        },
        {
          x: lonlat.lon,
          y: lonlat.lat,
          html: `<div id="draggableCircleWrap"></div>`
        },
        map,
        'draggableCircleWrap', true)
    })
    tempLayer.addEventListener('mouseup', () => {
      document.getElementById('mapOperationProxyLayer').style.pointerEvents = 'none'
      dragPan.activate()
      let newTempCenter = new HGIS.LonLat(center.lon, center.lat);
      newTempCenter.transform(
        map.getProjectionObject(),
        new HGIS.Projection("EPSG:4326")
      );
      Bus.$emit('dragCircleDistance', { newDistance, center: { lon: newTempCenter.lon, lat: newTempCenter.lat } })
      tempLayer.removeEventListener("mouseup")
      tempLayer.removeEventListener("mousemove")
    })
  },
  /**
   * @description: 拖拽圆实现
   * @param {*} map
   * @param {*} center
   * @param {*} dragPan
   * @return {*}
   * @author: wangXiaoMing
   */
  addDragBtn(map, center, dragPan) {
    center = new HGIS.LonLat(center.lon, center.lat);
    center.transform(
      new HGIS.Projection("EPSG:4326"),
      map.getProjectionObject()
    );
    const nativeCenter = new HGIS.LonLat(center.lon, center.lat)
    let vectorLayer = map.getLayersByName('dragCircleLayerWrap')[0];
    if (!vectorLayer) {
      vectorLayer = new HGIS.Layer.Vector("dragCircleLayerWrap");
      map.addLayer(vectorLayer)
    }
    if (this.vueMarkerCache['draggableCircleWrap']) {
      this.vueMarkerCache['draggableCircleWrap'].layer.removeMarker(this.vueMarkerCache['draggableCircleWrap'].marker);
    }
    vectorLayer.removeAllFeatures();
    this.addCircle(center, 3000, vectorLayer);
    center.lon += 3000;
    center.transform(
      map.getProjectionObject(),
      new HGIS.Projection("EPSG:4326")
    );
    this.addVueMarker(
      DragCircle,
      {
        mouseMoveFun: () => { 
          dragPan.deactivate(); 
          this.dragBtnMouseMove(map, vectorLayer, nativeCenter, dragPan) 
        }
      },
      {
        x: center.lon,
        y: center.lat,
        html: `<div id="draggableCircleWrap"></div>`
      },
      map,
      'draggableCircleWrap', true)
  },
  /**
   * @description: 坐标经纬度转换
   * @param {*}
   * @return {*}
   * @author: wangXiaoMing
   */
  translocation() {
    const args = Array.prototype.slice.call(arguments);
    const map = args[0];
    let lonlat;
    if (Array.isArray(args[1])) {
      lonlat = new HGIS.LonLat(...args[1]);
    } else {
      lonlat = new HGIS.LonLat(args[1], args[2]);
    }
    lonlat.transform(
      map.getProjectionObject(),
      new HGIS.Projection("EPSG:4326")
    );
    return {
      lon: Number(lonlat.lon), lat: Number(lonlat.lat)
    }
  },
  /**
   * @description: 向地图上加图标点位等 不是加DOM 而是加feature 不聚合的情况下 (后记 ： 最后发现这种方法还是在加一个svgDOM的感觉)
   * @param {*} points 加点的经纬度坐标Arr和图标
   * @param {*} map 地图对象
   * @param {*} layer 画层
   * @return {*}
   * @author: wangXiaoMing
   */
  addFeaturesIntoMap(points, layer, map) {
    points.forEach((item) => {
      let size = item.cluster ? new HGIS.Size(80, 32) : new HGIS.Size(28, 36);
      let offset = new HGIS.Pixel(-(size.w / 2), -(size.h / 2));
      let lonlat = new HGIS.LonLat(item.lon, item.lat);
      lonlat.transform(
        new HGIS.Projection("EPSG:4326"),
        map.getProjectionObject()
      );
      if (item.cluster) {
        /** 聚合情况的数字标注 */
        const text = new HGIS.Symbolizer.ImageTextIcon({
          text: item.count,
          imgUrl: item.pic,
          imgWidth: 80,
          imgHeight: 32,
          textPosition: 'middle',
          textBackgroundColor: 'rgba(0,0,0,0)',
          textColor: '#fff',
          fontFamily: '"Microsoft Yahei"',
          textBgPadding: '0',
          fontSize: '16px'
        }, size, offset)
        const marker = new HGIS.Marker.MarkerEx(lonlat, text);
        layer.addMarker(marker)
      } else {
        /** 非聚合情况的标注 */
        let icon = new HGIS.Icon(item.pic, size, offset);
        icon.imageDiv.title = item.info.name;
        let marker = new HGIS.Marker(lonlat, icon);
        layer.addMarker(marker);
      }
    })
  },

  addSingleMark(
    map, layer, pic, lon, lat, markerSize = { w: 32, h: 32 }, info,
    markerOffset = { w: -(markerSize.w / 2), h: -(markerSize.h / 2)}
    ) 
    {
    let size = new HGIS.Size(markerSize.w, markerSize.h);
    let offset = new HGIS.Pixel(markerOffset.w, markerOffset.h);
    let lonlat = new HGIS.LonLat(lon, lat);
    lonlat.transform(
      new HGIS.Projection("EPSG:4326"),
      map.getProjectionObject()
    );
    let icon = new HGIS.Icon(pic, size, offset);
    icon.imageDiv.title = info;
    let marker = new HGIS.Marker(lonlat, icon);
    layer.addMarker(marker);
  },
  activateMapMove(map) {
    let dragPan = map.getControlsByClass("HGIS.Control.DragPan")[0];
    dragPan.activate();
  },
  deactiveMapMove(map) {
    let dragPan = map.getControlsByClass("HGIS.Control.DragPan")[0];
    dragPan.deactivate();
  },

  // 地图中搜索框清空后 拖曳圆标志消失
  removeDragBtn(map) {
    let vectorLayer = map.getLayersByName('dragCircleLayerWrap')[0];
    this.vueMarkerCache['draggableCircleWrap'].layer.removeMarker(this.vueMarkerCache['draggableCircleWrap'].marker);
    vectorLayer.removeAllFeatures();
  },
};
export default mapUtils;
