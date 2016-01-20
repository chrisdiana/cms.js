title: iPad版web页面登录控件用到的几款快捷神器
date: 2013-10-05 17:24:49
tags: Example
---

先献上DEMO，[适配iPad的登录浮层](http://passport.baidu.com/passApi/html/loginPad_uni.html) ;

## 效果

如果使用Chrome打开的话其实可以发现他在PC上的体验也是很不错的。可以对比一下[百度首页](http://www.baidu.com)未登录状态下右上角的登录按钮弹出来的体验几乎一模一样。

开发iPad的登录控件遇到最大的问题是：** 目前PC端已经有一套登录控件，现在要开发的版本必须和当前PC的基本体验保持一致，在不改动当前的基础库的情况下如何保证最优的代码复用，最低的维护成本，最可靠的性能 **

## 需求

基于iPad端web页面的登录浮层应用场景相对于PC来说相对简单一些。但是对比一下PC端的登录控件的功能，真心没有想象钟的那么简单。涉及到的功能主要包括：

* 1.主登录功能
* 2.短信登录功能
* 3.第三方帐号登录功能
* 4.交互细节
* 5.实例化时的配置细节

再对比下开发该应用的场景：

* 1.最快效率开发出最优性能
* 2.优化代码复用情况，最好不要出现，如果某处登录逻辑修改就需要修改两处代码的情况
* 3.尽可能满足现有功能，对性能不做特别要求

就这三条其实就可以知道要怎么做了：** 在现有的PC端上做体验的优化 **

## 实现

优秀的工程离不开便捷的工具和技术，例如：fastclick,iconfont，CSS3的box模型、animate等等。

### 神器一：fastclick

关于FastClick已经有很多内容可以参考了，奉上GIT地址：[https://github.com/ftlabs/fastclick](https://github.com/ftlabs/fastclick);它解决了touch设备上300ms等待是否为dbclick的延迟。

### 神器二：iconfont

retina图标并不是把图片放大为现在的两倍就能解决问题了的，一些单色图标可以使用字体来完美解决；一淘大牛们做的开源工具[http://www.iconfont.cn/](http://www.iconfont.cn/)。

这个的平台可以定制也可以按项目聚类，缺点是如果有UE妹纸的ICON加进来就要先把UE图里的矢量图标转成SVG然后再上传，比用PS直接处理2倍大小的图片相对麻烦些。

### 神器三：beforeorientationchange

在iPad下无法转屏需要500ms的时间，但是标准提供的orientationchange方法只在转屏之后执行；可能有一些动作需要在转屏之前完成，这里通过重力感应获取当前状态实现的beforeorientationchange事件,[https://github.com/webzhangnan/jquery.beforeorientationchange](https://github.com/webzhangnan/jquery.beforeorientationchange)，可以感受一下。

### 神器四：animate.css

这款通过CSS3的animation属性实现的一套动画组件；当然在iPad版本登录中只用到了三套动画，所以就没有整体引入。而是在代码里做了一套简单的封装。这里又一个比较靠谱的方法：

首先定义一套动画，例如：

    @keyframes loginPad_shakeSlideIn {
        0% {
            opacity: 0;
            -webkit-transform: translateY(-2000px);
            -moz-transform: translateY(-2000px);
            -o-transform: translateY(-2000px);
            -ms-transform: translateY(-2000px);
            transform: translateY(-2000px)
        }
    
        80% {
            opacity: .8;
            -webkit-transform: translateY(10px);
            -moz-transform: translateY(10px);
            -o-transform: translateY(10px);
            -ms-transform: translateY(10px);
            transform: translateY(10px)
        }
        100% {
            opacity: 1;
            -webkit-transform: translateY(0px);
            -moz-transform: translateY(0px);
            -o-transform: translateY(0px);
            -ms-transform: translateY(0px);
            transform: translateY(0px)
        }
    }
    
然后就可以通过setTimeout的方法实现动态加载动画:

    var animateActor = function(ele,actor){
        var $ele = $(ele),
            animate = {
            shakeSlideIn:"loginPad_slideInDown .5s linear 0 1 normal forwards"
        }
        $ele.css("-webkit-animation", "");
        setTimeout(function() {
            $ele.css("-webkit-animation", $ele[actor])
        }, 0);
        
        return $ele;
    }

这样做的好处是无论初始状态是什么情况都可以加载动画，而不是通过addClass和removeClass的方式，还可以写出很漂亮的链式表达式：

    animateActor($('#test'),'slideInDown').css({'opacity':'0'})

如果在类里再做封装就更好看了。
    

有了这些工具开发起来便捷很多。