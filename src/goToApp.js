/*
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-03-02 15:32:45
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-03-05 16:02:29
 */
/* eslint-disable */
function goToApp(param) {
  if (top == window) {
    window.open(param.url + (param.param ? "?" + param.param : ""));
    return false;
  }
  let CONTEXTPATH = JSON.stringify("iface");
  // 门户新开页 top.window.goToApp()
  let _url =
    param.url.substr(0, 4) === "http"
      ? param.url
      : `${location.protocol}//${location.hostname}:${location.port}/${CONTEXTPATH}-web/index.do${param.url}`;
  let _port = location.port;
  let _protocol = location.protocol;
  if (!location.port) {
    _url =
      param.url.substr(0, 4) === "http"
        ? param.url
        : `${location.protocol}//${location.hostname}/${CONTEXTPATH}-web/index.do${param.url}`;
  }
  if (CONTEXTPATH === "ivehicleps") {
    if (_protocol === "https:" && !location.port) {
      _port = 443;
    } else if (_protocol === "http:" && !location.port) {
      _port = 80;
    }
    _url =
      param.url.substr(0, 4) === "http"
        ? param.url
        : `${location.protocol}//${location.hostname}:${_port}/ivehicleps-web/web/index.do${param.url}`;
    //location.port ? (_url = param.url.substr(0,4) === "http" ? param.url : `${location.protocol}//${location.hostname}:${location.port}/ivehicleps-web/web/index.do${param.url}`)
    //: ( _url = param.url.substr(0,4) === "http" ? param.url : `${location.protocol}//${location.hostname}/ivehicleps-web/web/index.do${param.url}`);
  }
  let _componentId = _url ? "" : param.componentId || `${CONTEXTPATH}`;
  let _componentMenuId = _url ? "" : param.componentMenuId || "";
  let _param = param.param || "";
  let _reload = param.reload || true;
  let _callback = param.callback || {
    func: "",
    param: {}
  };
  let p = {
    componentId: _componentId,
    componentMenuId: _componentMenuId,
    param: _param,
    url: _url,
    name: param.title,
    callback: _callback,
    reload: _reload
  };
  top.window.goToApp(p);
}
function gotoSearchCar(val, urlParam) {
  const { protocol, hostname: ip, port } = location;
  const url =
    protocol +
    "//" +
    ip +
    ":" +
    port +
    (urlParam ||
      `/erim-web/#/searchCar?faceUrl=`) +
    val.picUrl;
  const name = val.name;
  const param = {
    componentId: "",
    componentMenuId: "",
    param: "",
    url: url,
    name: name,
    title: '电动车以车搜车',
    callback: {
      func: "",
      param: {}
    },
    reload: true
  };
  goToApp(param);
}
export { goToApp, gotoSearchCar };
