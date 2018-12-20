# v-animateText
使用vue自定义指令写的文本特效，基于多页面编写，使用了全局变量VAnimateTime存储定时器，
根据具体项目需求，自行更改为单页面中的自定义指令。源码中有注释。

 * 调用方法：v-animate = "{key:id, value: value}"
 * key:必须为独一无二的key，为了区分全局数组里的定时器
 * value: 可为传文本，也可为表达式，若为表达式需写在模板字符串内``,不可为函数。
 * 传入的表达式实现基于eval()，注意不可传入%/等特殊字符。

# 文本效果如下
![Image text](https://github.com/AnGaoLang/v-animateText/blob/master/v-animate.gif)