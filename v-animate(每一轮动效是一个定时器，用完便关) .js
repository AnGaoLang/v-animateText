/** 
 * v-animate = "{key:id, value: value}"
 * key:必须为独一无二的key，为了区分setTimeout,方便断开循环
 * value: 可为传文本，也可为表达式，若为表达式需写在模板字符串内``,不可为函数
*/
!function(Vue) {
  window.VAnimateTime = {}; // 为了区分setTimeout的id储存对象，以指令的参数为独一无二的key
  window.evil = function (fn) { // 代替eavl方法执行字符串，会将"2018-02-12"自动转换
    var Fn = Function;
    return new Function('return ' + fn)();
  };

  Vue.directive('animate', function (el, binding) {
    let oldValue = binding.oldValue ? evil(binding.oldValue.value) : undefined; // 初始化时判断值是否存在
    let currentValue = evil(binding.value.value); // 执行字符串内的js

    // 传入的值存在，且被更新,才会进行处理
    if (oldValue !== currentValue) {
      let key = binding.value.key; // 获取传入的id

      let delay = 200;
      let interval = 5000; // 每一轮动效的间隔
      let character; // 字符tag构成的dom类数组
      
      let StringArray = (currentValue + '').split(''); // 将文本字符串分割为数组，数字要转换为字符串才能分割为数组
      let html = '';
      for (let i = 0; i < StringArray.length; i++) {
        html = html + '<i style="font-style: normal">' + StringArray[i] + '</i>'
      }
      el.innerHTML = html;
      character = el.childNodes; // 将数字文本字符串分段插入页面后，然后再获取所有子标签

      // 当数据更新，函数重复调用时，更新前后的el子元素指向了同一的dom元素，
      // 会造成重复多次的setInterval,可以中间隔一层dom元素,断开引用，则不需要管理一个全局的对象
      // el.innerHTML = '<i style="font-style: normal">' + html + '</i>';
      // let word = el.childNodes;
      // character = word[0].childNodes;

      // 动画初始化函数
      let initAnimateText = function () {
        // 初始化全隐藏
        for (let i = 0; i < character.length; i++) {
          character[i].style.visibility = 'hidden';
        };
        animateText(); // 执行动画
      };

      // 动画主体函数
      let animateText = function () {
        let loopNum = 0; // 当前循环的次数
        let timmer = setInterval(function () { // 动效循环
          if (loopNum >= character.length) { // 循环到最后一个字母dom节点时，退出循环，然后延时递归开始下一轮动效
            clearInterval(timmer);
            let timeOut = setTimeout(function() {
              initAnimateText();
            }, interval);

            // 如果全局setTimeout管理对象里存在相应的id，则清空旧的setTimeout断开递归循环，开始新一轮。
            if (VAnimateTime[key]) {
              clearTimeout(VAnimateTime[key]);
              VAnimateTime[key] = timeOut;
            } else { // 不存在相应id，则写入
              VAnimateTime[key] = timeOut;
            };
          } else {
            character[loopNum].style.visibility = 'visible'; // 正常的动效循环
            loopNum += 1; // 循环次数加一
          };
        }, delay)
      };

      initAnimateText();
    }
  });
}(Vue)
