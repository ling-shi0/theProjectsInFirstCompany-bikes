import Vue from 'vue';
import Helper from '@/helper';

/* 高亮
  Usage:
    developer.developerName = 'abcdef';
    {{{developer.developerName | highlight('abc')}}}
*/
Vue.filter('highlight', function (value, str) {
  return value.replace(new RegExp('' + str, 'g'), '<span class="text-highlight">' + str + '</span>');
});

/* 显示字数控制
  Usage:
    content:'123456789',
    {{item.content | limit(3, '...')}}
    输出
    123...
*/
Vue.filter('limit', function (value, count, replacement) {
  if (value.length <= count) {
    return value;
  } else {
    return value.substr(0, Number(count)) + replacement;
  }
});

/* 时间格式化
  2016-10-11 16:27:47.0  ->  10月11日 16:27
  Usage:
    {{createTime | dateFormat}}
*/
Vue.filter('dateFormat', function (value) {
  var regex = /(\d{4})\-(\d{2})\-(\d{2})\s(\d{2}):(\d{2})/;
  var m = value.match(regex);
  return m[2] + '月' + m[3] + '日' + ' ' + m[4] + ':' + m[5];
});

//1:是 0:否
Vue.filter('isNo1', function (value) {
  if (value == 1) {
    return '是';
  } else if (value == 0) {
    return '否';
  }
});
//1:是 0:否
Vue.filter('isNo2', function (value) {
  var result = '';
  switch (value) {
    case 1 :
      result = '是';
      break;
    case 0 :
      result = '否';
      break;
    default :
      result = '';
      break;
  }
  return result;
});

//截取字符串
Vue.filter('subStr', function (value, char) {
  return value.substring(value.indexOf(char) + 1);
});

//数字格式化（每三位加一个逗号(,)并保留2位有效数字）
Vue.filter('moneyFormart', function (value, type) {
  if (type == 'thousands') {
    return Helper.moneyFormart((value / 10000).toFixed(2));
  } else {
    return Helper.moneyFormart(value);
  }
});
