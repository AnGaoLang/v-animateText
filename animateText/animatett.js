(function() {
  // 对英语，分为单词和字母
  (function($) { // a是jquery对象，$(".demo").animatext({mode: "chars"}); 故this指向当前dom元素
    return $.fn.animatext = function(options) {
      var animaText, settings;

       // settings是传入的option和默认option的结合
      settings = $.extend({
        group: !1, // 是都对文字进行分组
        mode: 'chars', // 字母模式(chars)，单词模式(words)
        initDelay: 0, // 设置文字延迟时间
        speed: 200, // 文字动画速度
        timeToRelaunch: 2e3, // 设置两次文字动画之间的时间
        reverse: !1, // 是否反向显示
        infinite: !1, // 是否无限循环显示
        random: !1, // 是否随机显示文字
        onBegin: function() {}, // 两个可用回调
        onSuccess: function() {}
        // group: false,
        // mode: "chars",
        // initDelay: 0,
        // speed: 200,
        // timeToRelaunch: 2000,
        // reverse: false,
        // infinite: false,
        // random: false,
        // onBegin: function() {},
        // onSuccess: function() {}
      }, options);

      // 动画的主体函数
      animaText = function(element) {
        
        var animatedElements, // 动画数组
        animatedElementsBuffer,  // 随机动画数组
        animatedWords,  // 单词层span的jquery对象
        animationInProgress, // 是否在动画中
        checkInView, 
        cutText, // 以<br>分割当前dom对象的文本
        paragraphs, // 段落span层
        randomIndex,  // 随机索引
        j, 
        scale,
        ref, 
        randomIterations,   // 随机的最大值
        doAnimation, // 动画函数
        relaunchAnimation; // 动画初始化
        
        settings.onBegin();// begin回调函数
        animatedElements = []; // 动画数组
        animationInProgress = false; // 是否在动画中
        
        if (settings.group) { // 如果分组，group为true
          $(element).each(function(i, item) { // i为index，item为数组项；遍历当前的jquery对象，并直接推入动画数组
            $(item).css('visibility', 'hidden');
            return animatedElements.push(item);
          });
        } else { // 如果未分组，group为false
          paragraphs = ""; // 段落
          cutText = element.html().split("<br>"); // 获取当前dom元素的文本，并以<br>换行符分割为段落数组

          $(cutText).each(function(i, item) {  // 遍历以<br>分割为数组的html文本，b为index，c为数组项
            
            var cutParagraphs, words; // 被分割的段落、单词
            words = ""; // 单词
            cutParagraphs = item.split(" "); // 在以<br>分割为数组后，再将每一数组项以' '分割为段落片段

            $(cutParagraphs).each(function(i, item) { // 遍历出每一个单词
              var chars, cutWord;

              if (settings.mode === "chars") {
                 // 字母模式
                chars = "";
                cutWord = item.split(""); // 将单词分割为每一个字母
                $(cutWord).each(function(i, item) { // 在单词里遍历每一个字母，返回包裹每一个字母的字母层span
                  return chars += '<span class="char' + (i + 1) + '" aria-hidden="true" style="visibility:hidden; display:inline-block">' + item + '</span>';
                });
                // 将字母层span插入外层的单词层span
                return words += '<span class="word' + (i + 1) + '" aria-hidden="true" aria-label="' + item + '" style="display:inline-block">' + chars + '</span> ';
              } else { 
                // 单词模式，返回包裹每一个单词的单词层span
                return words += '<span class="word' + (i + 1) + '" aria-hidden="true" style="visibility:hidden; display:inline-block">' + item + '</span> ';
              }
            });
            // 将单词层span插入外层的段落层span
            return paragraphs += '<span class="paragraph' + (i + 1) + '" aria-hidden="true" aria-label="' + item + '" style="display:inline-block">' + words + '</span><br>';
          });

          element.attr('aria-label', element.text()); // 加上aria-label语义化属性
          element.html(paragraphs); // 在原html元素里插入整个段落层span
          animatedWords = element.find("span[class^='word']"); // 获取单词层的span

          if (settings.mode === "chars") {
            // 字母模式
            $(animatedWords).each(function(i, item) { // 遍历每一个单词层span
              var thisChars;
              thisChars = $(item).find("span[class^='char']"); // 获取单词层span下的每一个字母层span
              return $(thisChars).each(function(i, item) { 
                // 遍历当前单词层下的每一个字母层span，并推入动画数组
                return animatedElements.push(item);
              });
            });
          } else {
            // 单词模式
            $(animatedWords).each(function(i, item) {
              // 遍历当前单词层，并推入动画数组
              return animatedElements.push(item);
            });
          }
        }

        if (settings.reverse && !settings.random) { 
          // 如果设置了反向且不随机，则将动画数组反向
          animatedElements.reverse();
        }

        if (settings.random) { // 如果设置了随机
          animatedElementsBuffer = [];
          randomIterations = animatedElements.length; // 动画数组的长度
          // 打乱原始动画数组
          for (
            scale = j = ref = randomIterations; 
            ref <= 1 ? j <= 1 : j >= 1; 
            scale = ref <= 1 ? ++j : --j) { // 这里的判断条件没看懂？
            randomIndex = Math.floor(Math.random() * animatedElements.length);
            animatedElementsBuffer.push(animatedElements[randomIndex]); // 随机推入
            animatedElements.splice(randomIndex, 1); // 防止重复删除已被推入的数组项
          }
          animatedElements = animatedElementsBuffer; // 将被打乱的数组赋给动画数组
        }

        // 初始化隐藏当前jquery下的span标签，返回并执行doAnimation()
        relaunchAnimation = function(element) {
          if (settings.group) {
            // 分组
            $(element).each(function(i, item) {
              $(item).css('visibility', 'hidden');
              $(item).removeClass('animated');
              return $(item).removeClass(settings.effect);
            });
          } else {
            // 未分组，将所有当前jquery下的span隐藏。并移除效果和样式
            element.find("span").css('visibility', 'hidden');
            element.find("span").removeClass('animated');
            element.find("span").removeClass(settings.effect);
          }
          return doAnimation();
        };

        // 指定动画
        doAnimation = function() {
          var animation, indexInterval;
          animationInProgress = true; // 动画中
          indexInterval = 0; // 当前循环的次数
           // 循环显示字母层span
          return animation = setInterval(function() {
            if (indexInterval >= animatedElements.length) { // 如果当前循环次数超过字母层span总个数，则清除当前定时器
              clearInterval(animation);
              settings.onSuccess(); // 执行动画结束回调
              // 设置了无限循环，则延迟调用relaunchAnimation开始新一轮循环
              if (settings.infinite) {
                setTimeout(function() {
                  animationInProgress = false;
                  return relaunchAnimation(element);
                }, settings.timeToRelaunch);
              }
            }
            $(animatedElements[indexInterval]).css('visibility', 'visible');
            // 如果指定了动画
            if (settings.effect) {
              $(animatedElements[indexInterval]).addClass('animated ' + settings.effect);
            }
            return indexInterval += 1; // 当前循环的次数加1
          }, settings.speed);

        };
        doAnimation();
        // checkInView = function(element) {
        //   var bounds, elementInView, viewport, win;
        //   element = $(element);
        //   win = $(window);
        //   viewport = {
        //     top: win.scrollTop(),
        //     left: win.scrollLeft()
        //   };
        //   viewport.right = viewport.left + win.width();
        //   viewport.bottom = viewport.top + win.height();
        //   bounds = element.offset();
        //   bounds.right = bounds.left + element.width();
        //   bounds.bottom = bounds.top + element.height();
        //   elementInView = !(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom);
        //   if (elementInView && !animationInProgress) {
        //     return doAnimation();
        //   }
        // };

        // $(window).on("resize scroll", function() {
        //   return checkInView(element);
        // });
        // return $(document).ready(function() {
        //   return setTimeout(function() {
        //     return checkInView(element);
        //   }, settings.initDelay);
        // });
      };

      if (this.length > 0) {
        if (settings.group) {
          return animaText(this);
        } else {
          return $(this).each(function(i, item) { // 未分组，则对每一个jquery对象遍历执行一次animaText();
            return animaText($(item));
          });
        }
      }

    };
  })(window.jQuery || window.Zepto || window.$);

}).call(this);