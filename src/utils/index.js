/*
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-04-25 20:27:05
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-06-16 10:23:13
 */

import api from "@/api";
import rest from "@/rest";

// 动态加载 tree
export function loadNode(param) {
  let params = {
    parentIndexCode: param.parentKey ? param.parentKey : "-1",
    resourceType: "CAMERA",
    userId: "admin",
    capabilitySet: "event_face",
    name: param.name, // 关键字
    requestType: 1,
    treeCode: param.treeCode || 0,
  };
  return rest.post(api.clusterAnalysis.asyncTree, params).done((res) => {
    let { data } = res;
    data && data.forEach((item) => {
      item.iconSkin =
        item.icon === "area" || item.icon === "control-unit"
          ? "org"
          : "camera";
      if (item.children && item.children.length > 0)
        changeIconSkin(item.children);
      if (item.iconSkin === "org" && item.hasResNum) {
        item.name = `${item.name} (${item.hasResNum})`;
      }
      item.isLeaf = !item.parent;
    });
    return data || [];
  });
}

function changeIconSkin(arr) {
  arr.forEach((item) => {
    item.iconSkin =
      item.icon === "area" || item.icon === "control-unit"
        ? "org"
        : "camera";
    if (item.children && item.children.length > 0)
      changeIconSkin(item.children);
  });
}