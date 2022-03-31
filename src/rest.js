/* RESTFUL APIs
 - 包含跟服务器交互的常用方法
 @param path 请求的url
 @param data 前端传递给后台的数据对象
 @param params 查询对象，将被parse成类似"?a=1&b=2"的形式拼在path后面
 共包含五种方法：
 Rest#post     - 增
 Rest#delete   - 删
 Rest#put      - 改
 Rest#get      - 查
 Rest#upload   - 上传

 Usage:
 var rest = require('rest');

 rest.post('user/new', {
 name: 'jacket',
 position: 'Frontend Developer'
 }).done(function (res) {
 // Do something...
 });
 */
import Helper from "./helper";
import $ from "jquery";
import envconfig from "./envconfig/envconfig";
import { Message, Loading } from "hui";

function Rest() { }

Rest.prototype = {
  // 增 - POST
  post: function (path, data, params) {
    if (params) path = parse(path, params);
    return doAjax("POST", path, data);
  },
  // 删 - DELETE
  delete: function (path, params, data) {
    if (params) path = parse(path, params);
    return doAjax("DELETE", path, data);
  },
  // 改 - PUT
  put: function (path, data, params) {
    if (params) path = parse(path, params);
    return doAjax("PUT", path, data);
  },
  // 查 - GET
  get: function (path, params) {
    if (params) path = parse(path, params);
    return doAjax("GET", path);
  },
  // 上传 - POST
  upload: function (path, data, params) {
    if (params) path = parse(path, params);
    return uploadHelper(path, data);
  },
  // 上传 - POST
  download: function (path, params, callback) {
    if (params) path = parse(path, params);
    return downloadHelper(path, params, callback);
  },
  // 下载 - POST
  downloadReport: function (path, data) {
    var setting = apiSetting("POST", path);
    setting["async"] = false;
    setting["dataType"] = "text";
    setting["responseType"] = "blob";
    if (data) {
      data = JSON.stringify(data);
      setting["data"] = data;
    }
    return $.ajax(setting)
      .then(res => {
        const blob = new Blob([res], {
          type: `application/msword` //word文档为msword,pdf文档为pdf，msexcel 为excel
        });
        let objectUrl = URL.createObjectURL(blob);
        let link = document.createElement("a");
        let date = new Date();
        let fname = Helper.dateFormat("YYYY-mm-dd HH:MM", date) + `.doc`;
        link.href = objectUrl;
        link.setAttribute("download", fname);
        document.body.appendChild(link);
        link.click();
      })
      .catch(err => {
        console.warn(err);
      });
  }
};

/* 格式化请求路径
 @param path 请求路径
 @param params 查询对象或字符串
 Usage:
 parse('user/query', '?name=j&age=21')
 or
 parse('user/query', { name: 'j', age: '21' })
 将输出：'user/query?name=j&age=21'
 parse('user/:userId/info/:infoId', { userId: 1, infoId: 2 })
 将输出：'user/1/info/2'
 */
function parse(path, params) {
  if (path.charAt(path.length - 1) === "/") {
    path = path.substr(0, path.length - 1);
  }
  if (Helper.isString(params)) return path + "/" + params;
  if (Helper.isNumber(params)) return path + "/" + params;
  if (Helper.isObject(params)) {
    if (/:[a-zA-Z]+/.test(path)) {
      for (let key in params) {
        path = path.replace(new RegExp(":" + key, "g"), params[key]);
      }
    } else {
      var search = "?";
      if (path.indexOf("?") > -1) {
        search = "&";
      }
      var counter = 0;
      for (let key in params) {
        if (counter) search += "&";
        search += key + "=" + params[key];
        counter++;
      }
      return path + search;
    }
  }
  return path;
}

function doAjax(type, path, data, contentType, dataType) {
  var setting = apiSetting(type, path, contentType, dataType);
  if (data) {
    if (type.toLowerCase() === "post" || type.toLowerCase() === "put") {
      data = JSON.stringify(data);
    }
    setting["data"] = data;
    // setting['data'] = JSON.stringify(data)
  }
  return $.ajax(setting);
}

function uploadHelper(path, data) {
  var setting = apiSetting("POST", path);
  setting["data"] = data;
  setting["contentType"] = false;
  setting["processData"] = false;
  return $.ajax(setting);
}

function downloadHelper(path, data, callback) {
  var baseUrl = getBaseUrl();
  var fullUrl = baseUrl + path;
  callback && callback(fullUrl);
}

function getBaseUrl() {
  return envconfig.baseURL;
}

function apiSetting(type, path, contentType, dataType) {
  var baseUrl = getBaseUrl();
  var fullUrl = baseUrl + path;
  let loadingInstance;
  var setting = {
    cache: false,
    url: fullUrl,
    type,
    contentType: "application/json",
    dataType: "json",
    // contentType: contentType || 'application/x-www-form-urlencoded',
    // dataType: dataType || 'json',
    timeout: 1000 * 60,
    crossDomain: true,
    // xhrFields:{
    //   withCredentials:true
    // },
    beforeSend: function (xhr) {
      if (path.indexOf('clueGroup') >= 0) {
        loadingInstance = Loading.service();
        // $('#processing').removeClass('hide');
      }
    },
    complete: function (xhr) {
      if (path.indexOf('clueGroup') >= 0) {
        loadingInstance.close();
        // $('#processing').addClass('hide');
      }
    },
    success: function (res) {
      // if (res.code === '401') {
      //   location.hash = '/signin'
      // }
    },
    error: function (xhr, textStatus) {
      // Message.closeAll();
      if (xhr.status === 404) {
        Message.error("请求404，可能是网络问题！");
      } else if (xhr.status === 500) {
        let msg = xhr.responseJSON.message;
        if (!msg) msg = JSON.parse(xhr.responseText).message;
        let resMsg = msg.match(/[^\x00-\xff]+$/);
        if (resMsg) { resMsg = resMsg[0]; }
        if (resMsg) {
          Message.error(resMsg);
        } else if (/0x11900300/.test(msg)) {
          Message.error("系统错误，请联系管理员！");
        } else Message.error("网络出现问题！");
      } else if (xhr.status === 0) {
        Message.error("网络连接有误，请检查网络！");
      } else if (textStatus === "timeout") {
        Message.warning("请求超时，请刷新重试！");
      } else {
        Message.error("网络连接有误，请检查网络！", 3000);
      }
    }
  };

  if (process.env.NODE_ENV === "development") {
    setting["headers"] = {};
    setting["headers"]["X-Requested-With"] = "XMLHttpRequest";
    setting["headers"]["X-CSRF-TOKEN"] = "35d546d1-b859-40b7-b905-2ec9659066b5";
  } else {
    const token = document
      .getElementsByName("_csrf")[0]
      .getAttribute("content");
    setting["headers"] = {};
    setting["headers"]["X-CSRF-TOKEN"] = token;
    setting["headers"]["X-Requested-With"] = "XMLHttpRequest";
  }

  /* if (Helper.get('token') && Helper.get('token') !== 'null') {
   if (!setting['headers']) setting['headers'] = {}
   setting['headers']['X-Requested-With'] = 'XMLHttpRequest';
   setting['headers']['X-CSRF-TOKEN'] = Helper.get('token')
   }*/
  return setting;
}

const rest = new Rest();

export default rest;
