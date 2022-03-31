/*
 * @Description:
 * @Version:
 * @Autor: wangXiaoMing
 * @Date: 2021-09-09 14:14:27
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-09-14 10:42:49
 */
const bikeColors = [
  {
    text: '白色',
    backNormalColor: '#FFFFFF',
    backActiveColor: '#FFFFFF',
    fontColor: 'rgba(30,35,55,0.90)',
    needCheck: true
  },
  {
    text: '银色',
    backNormalColor: '#F0F0F0',
    backActiveColor: '#F0F0F0',
    fontColor: 'rgba(30,35,55,0.90)',
    needCheck: true
  }, {
    text: '灰色',
    backNormalColor: '#C5C5C5',
    backActiveColor: '#C5C5C5',
    fontColor: 'rgba(30,35,55,0.90)',
    needCheck: true
  }, {
    text: '黑色',
    backNormalColor: '#000000',
    backActiveColor: '#000000',
    fontColor: '#FFFFFF',
    needCheck: true
  }, {
    text: '红色',
    backNormalColor: '#ED0A0A',
    backActiveColor: '#ED0A0A',
    fontColor: '#FFFFFF',
    needCheck: true
  }, {
    text: '深蓝色',
    backNormalColor: '#103FB6',
    backActiveColor: '#103FB6',
    fontColor: '#FFFFFF',
    needCheck: true
  }, {
    text: '蓝色',
    backNormalColor: '#82B9FF',
    backActiveColor: '#82B9FF',
    fontColor: 'rgba(30,35,55,0.90)',
    needCheck: true
  }, {
    text: '黄色',
    backNormalColor: '#FFE033',
    backActiveColor: '#FFE033',
    fontColor: 'rgba(30,35,55,0.90)',
    needCheck: true
  }, {
    text: '绿色',
    backNormalColor: '#3A8E4B',
    backActiveColor: '#3A8E4B',
    fontColor: '#FFFFFF',
    needCheck: true
  }, {
    text: '棕色',
    backNormalColor: '#7B5E50',
    backActiveColor: '#7B5E50',
    fontColor: '#FFFFFF',
    needCheck: true
  }, {
    text: '粉色',
    backNormalColor: '#FFC3EE',
    backActiveColor: '#FFC3EE',
    fontColor: 'rgba(30,35,55,0.90)',
    needCheck: true
  }, {
    text: '紫色',
    backNormalColor: '#AB7DFF',
    backActiveColor: '#AB7DFF',
    fontColor: '#FFFFFF',
    needCheck: true
  }, {
    text: '深灰色',
    backNormalColor: '#6D6D6D',
    backActiveColor: '#6D6D6D',
    fontColor: '#FFFFFF',
    needCheck: true
  }, {
    text: '青色',
    backNormalColor: '#99FBFF',
    backActiveColor: '#99FBFF',
    fontColor: 'rgba(30,35,55,0.90)',
    needCheck: true
  }, {
    text: '橙色',
    backNormalColor: '#FF8740',
    backActiveColor: '#FF8740',
    fontColor: 'rgba(30,35,55,0.90)',
    needCheck: true
  }, {
    text: '未知',
    backNormalColor: '#FFFFFF',
    backActiveColor: '#FFFFFF',
    fontColor: 'rgba(30,35,55,0.90)',
    needCheck: true
  },
]

const yesNoArr = [
  {
    text: '是',
    backNormalColor: '#FFFFFF',
    backActiveColor: '#2080F7',
    fontColor: 'rgba(30,35,55,0.90)',
    needCenter: true,
    activeFontColor: 'white'
  },
  {
    text: '否',
    backNormalColor: '#FFFFFF',
    backActiveColor: '#2080F7',
    fontColor: 'rgba(30,35,55,0.90)',
    needCenter: true,
    activeFontColor: 'white'
  }, {
    text: '未知',
    backNormalColor: '#FFFFFF',
    backActiveColor: '#2080F7',
    fontColor: 'rgba(30,35,55,0.90)',
    needCenter: true,
    activeFontColor: 'white'
  }
]

const colorValMap = {
  '黑色': 'black',
  '蓝色': 'blue',
  '棕色': 'brown',
  '青色': 'cyan',
  '深蓝色': 'deepBlue',
  '深灰色': 'deepGray',
  '灰色': 'gray',
  '绿色': 'green',
  '橙色': 'orange',
  '粉色': 'pink',
  '紫色': 'purple',
  '红色': 'red',
  '银色': 'silver',
  '未知': 'unknown',
  '黄色': 'yellow',
  '白色': 'white',
  '是': "yes",
  '否': "no",
}

export { bikeColors, yesNoArr, colorValMap }