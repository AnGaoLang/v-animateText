/** 
 * v-animate = "{key:id, value: value}"
 * key:必须为独一无二的key，为了区分定时器
 * value: 可为传文本，也可为表达式，若为表达式需写在模板字符串内``,不可为函数
*/
!function(Vue) {
  window.VAnimateTime = []; // 全局的定时器id储存数组，以指令的参数为独一无二的key
  window.evil = function (fn) { // 代替eavl方法执行字符串，会将"2018-02-12"自动转换
    var Fn = Function;
    return new Function("return " + fn)();
  };
  Vue.directive('animate', function (el, binding) {
    let oldValue = binding.oldValue ? evil(binding.oldValue.value) : null; // 初始化时判断值是否存在
    let currentValue = evil(binding.value.value); // 执行字符串内的js
    // 传入的值存在，且被更新,才会进行处理
    if (oldValue !== currentValue) {
      let key = binding.value.key;
      // 判断定时器数组里是否已经初始化储存了相应的定时器，存在则清空之前的定时器，并从全局数组删除
      for (let h = 0; h < VAnimateTime.length; h++) {
        if (VAnimateTime[h][key]) {
          clearInterval(VAnimateTime[h][key]);
          VAnimateTime.splice(h,1);
        }
      }
      // 将文本字符串分割为数组，数字要转换为字符串才能分割为数组
      var StringArray = currentValue.toString().split('');
      var html = "";
      for (var i = 0; i < StringArray.length; i++) {
        html = html + "<span>" + StringArray[i] + "</span>"
      }
      el.innerHTML = html;
      // 将数字文本字符串分段插入页面后，然后再获取所有子标签
      var childNodeArray = el.childNodes;
      // 单个数字延迟显示的毫秒系数，整个循环为4000毫秒，依次显示数字的动效要大大小于整个循环时间，才能将空余的时间使文本正常显示
      var delay = 200;
      // 每4000毫秒一次循环
      let currentTimer = setInterval( function () {
        for (let j = 0; j < childNodeArray.length; j++) {
          if (childNodeArray[j].nodeType === 1) {
            // 先将文本全部隐藏
            childNodeArray[j].style.visibility = "hidden";
            // 依据索引，依次显示单个文本200，400，600，4000中剩余的时间正常显示全部文本
            setTimeout(function () {
              childNodeArray[j].style.visibility = "visible";
            }, delay * (j+1))
          }
        }
      }, 4000)
      let obj = {};
      obj[key] = currentTimer
      // 键值对中的键位变量时，必须用[]，而不能用. 否则会被转换为字符串，{key: value}中可以也会被转化为字符串
      // 将当前的定时器退出全局数组
      VAnimateTime.push(obj);
    }
  })
}(Vue)
