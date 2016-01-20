---
layout: post
title: web前端之原生DOM&jQuery-DOM编程习题【清华大学】
date: 2015-07-09 22:53:08
type: slider
description: 清华大学web前端之原生DOM&jQuery-DOM编程习题
---
# WEB前端开发

### —— 原生DOM&jQuery-DOM编程习题



## 一、	DOM基础题（40分，每题20分）

1.	编写一个形如 $(arg) 的方法，能根据所传入参数的不同，获取对应的DOM节点，如：

	* var dom = $('#id'); // 传入参数为一个DOM节点的ID
	* var dom = $('.classname'); // 传入参数为一个DOM节点的css class
	* var dom = $('a'); // 传入参数为一个DOM节点的标签类型

	要求在如下浏览器中可正常运行：IE8/9/10/11、Chrome、Firefox、360、搜狗、遨游。

2.	编写一个形如 getOrSetDomAttr(dom,attrName,attrValue) 的方法，根据传入参数的不同，获取或设置DOM节点的属性值，如：
	
	* var imgSrc = getOrSetDomAttr(dom,'src'); // 获取图片的src值
	* getOrSetDomAttr(dom,'src','http://www.baidu.com/a.png'); // 设置图片的src值
	
	要求保证该方法的容错性。



## 二、	DOM综合题（60分，二选一）

1.	编写一个自定义的弹层组件，仅实现Alert效果即可，效果可参考[弹框DEMO](http://wilee.me/demo/artDialog/demo.html) ，要求实现以下几个功能点：

	* 弹层内容可任意设置
	* 弹层可拖拽
	* 键盘上按ESC键可关闭弹层
	* 保证如下浏览器中可正常运行：IE8/9/10/11、Chrome、Firefox、360、搜狗、遨游

2. 利用本次DOM课程的相关知识，分析这个简单的网页游戏：[超级玛丽](http://wilee.me/demo/js_game/HTML5超级玛丽/index.html)，酌情给分：

	* 详细说明此游戏的设计与实现原理、所用到的DOM操作、相关事件等
	* 用代码设计出此游戏的雏形，且代码结构清晰
	* 保证游戏可玩且较好地处理DOM节点移除或复用等性能优化相关问题



## 三、	附加题（20分）

利用本次DOM课程的相关知识，完成一个类似于[DEMO](http://www.html5gamedevelopment.org/StateofHTML5GameDevelopment/)的页面，主题是介绍自己的基本信息、爱好、家乡等内容。要求：

* （10分）可以自由发挥，甚至以游戏的形式呈现内容
* （10分）内容丰富，可操作性强、页面兼容移动端设备、运行流畅不卡顿等


** 附：关于课后作业的评分标准 **

1. 功能完全实现（60%，注意按照实现的程度分层次给分）
1. 有较强容错机制，如处理参数的不合法情况等，能完全处理好浏览器兼容性（15%）
1. 代码结构清晰，在重要的function或语句处有必要的注释（10%）
1. 能考虑性能优化，如DocumentFragment的使用、变量或节点的实时delete、内存释放等（10%）
1. 能围绕题目要求的功能，进行一些亮点设计（5%）
