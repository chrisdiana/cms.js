---
layout: post
title: 我所理解的登录
date: 2015-06-08 23:32:22
type: slider
---
# 我所理解的登录（Ⅰ）

—— 前端工程师用最精简的代码打造最精致的用户体验之路




## 从百度登录功能重构说起




### 背景

* 请求数量巨大
    * 每天500万次调起，服务于百度10亿+用户；
    * 每天主动登录用户数300万，注册用户数20万
* 服务于70+产品线
    * 环境不同：基础库（jQuery，Tangram），多语言，安全性 ...
    * 使用场景不同：弹框+内嵌
    * 客户端不同：PC，PC客户端，iPad Webapp...
* 整套组件包含几乎所有的帐号相关的操作
    * 登录页/框
    * 注册页/框
    * 验证组件
    * 补填用户名
    * 帐号绑定
    * ...



### 老版的百度登录框/页

* 老版的百度登录框：

![QQ20141105-1@2x](http://bizfe.meilishuo.com/md-imgs/aab20e60016265126b05400f058cbc37.png)

* 老版的百度登录页：[百度搜藏](http://cang.baidu.com/)



### 新版的百度登录框/页

* 新版的百度登录框：

![百度登录框](http://bizfe.meilishuo.com/md-imgs/721eedb31a61662184bcfccf3ee579c2.png)

* 新版的百度登录页：[登录百度帐号](http://passport.baidu.com/)



### 几点思考

#### 用户体验是不是被过度放大了？

> ** 可用性 ** —— 当没钱的时候，穿一身破衣服，能保暖就行，这是基本需求；

> ** 易用性 ** —— 当有些钱了，就希望穿一身好看衣服，这样能显得整个人更好看，这就是基本体验了；

> ** 好用性 ** —— 当有闲钱了，就开始买一些简单的首饰，涂脂抹粉画眼线，这就是增强体验；

> ** 品牌价值 ** —— 当非常有钱了，开始穿金戴银，貂皮大衣，这时候你要彰显的是品位，这就是品牌需求了

引自：[【知乎】用户体验是不是被过度放大了](http://www.zhihu.com/question/19562401)



#### 登录的基本特征

* 保障帐号安全（Security）
* 可操作（Accessibility）
* 效率（Efficiency）



#### 现在的美丽说登录页

[https://account.meilishuo.com/user/login](https://account.meilishuo.com/user/login)



## 百度登录框改进思路

** 站在用户的角度，与技术结合，做更富有情感的产品。 ** 

### 一段代码的价值

* 使用for属性规定 label 与哪个表单元素绑定。
```HTML
<input type="checkbox" name="is_remember" id="is_remember"/>
<label for="is_remember">是否记住登录状态</label>
```
    * 扩大热点区域，使操作更方便 



* placeholder
```HTML
<input type="text" name="username" id="username" placeholder="用户名/手机号/邮箱"/>
```
```JavaScript
_isSupportPlaceholder:function(){
	return 'placeholder' in document.createElement('input')
}
```
    * 用户在没有任何输入的情况下默认提示文案；
    * 如果是低端浏览器，可以通过`_isSupportPlaceholder`方法来判断是否支持`placeholder`；如果不支持，可以用DOM模拟placeholder



* tabindex
```HTML
<input type='text' name="username" tabindex="1">
<input type='text' name="password" tabindex="2">
<input type='submit' value="提交" tabindex="3">
```



* 三态（默认状态，hover,focus）的样式处理
```CSS
input{background:#}
input:hover{background:#}
input:focus{background:#}
```
    * 不同的状态，给予用户不同的反馈



* 提交时密码输入有误或为空，清空密码表单值，自动聚焦到密码表单
```JavaScript
ele.value = "";
ele.focus();
```
    * 减少用户操作成本，代码可以完成的就不需要用户操作



* 当前状态提醒，“登录中...”
```JavaScript
ele.value = "登录中"
```
    * 异步提交数据期间，用户应该得到反馈；被告知正在发送数据。



* 超时提醒
```JavaScript
setTimeout(function(){
    if(!isLogin){
        showMsg('可能是网络原因登录超时，请稍候再试。')
    }
},5000)
```
    * 如果在打开页面到用户操作期间，用户网络的出问题；异步登录请求将没有任何返回，此时，如果等待超时则予以提示



* 大小写锁定提示
```JavaScript
var isShift = e.shiftKey || (keyCode == 16) || false
if (((keyCode >= 65 && keyCode <= 90) && !isShift) || ((keyCode >= 97 && keyCode <= 122) && isShift)) {
    //do something here
}
```
    * 如果用户开启了大写锁定提示，则予以提示



### 更多思路

* autosuggest

    * 输入邮箱/历史纪录的自动提示

* 开放回调方法
    * 用户在未登录的情况下操作被中断，弹出登录框用登录成功后应该继续用户之前的操作



* 校验器
    * 输入达到某个字符数时校验
    * blur时，字段格式校验
    * 提交表单时，整体校验

* 所有连接加上当前用户名/邮箱/手机号
    * “尚未注册”，“找回密码？”，“查看帮助”，链接带上用户名，然后在目的页自动填充



* 只有当用户的连续输错三次密码才会提示输入验证码，并且提示用户在多长时间内修改过密码
    * 与风控策略有关，避免每次登录都输入验证码。

* 验证码输入错误，自动更新验证码，验证码表单清空，自动聚焦到验证码表单
    * 减少用户操作成本

* ...



## 下期预告

> 我所理解的登录

> ——面对精致的需求如何构建高复用，易维护，高性能的代码

> ### 挑战

> * 服务于70+用户产品线：基础库不一，交互需求不同，客户端不同
> * 更新迭代：缓存机制
> * 国际化：多语言支持
> * 安全：RSA加密，POST/HTTPS,TOKEN
> * 反作弊：用户行为数据收集

> ### 思考

> ... 



# 我所理解的登录（Ⅱ）

—— 如何为适配产品需求选择更合适的技术架构



## 需求场景
* 交互统一性，维度：不同产品线，不同客户端
* 安全性保障
* 可复用，高性能，易维护



## 如何构建一套架构实现所有的功能？

### 功能点

登录，弹框登录，注册，绑定手机号，补填用户名等



### DEMO

登录：

http://passport.baidu.com/passApi/html/loginMerge.html

注册：

http://passport.baidu.com/passApi/html/reg.html

弹框登录：

http://passport.baidu.com/passApi/html/dia-noimg.html

弹框登录iPad版：

http://passport.baidu.com/passApi/html/loginPad_uni.html



## 思路

### iframe实现功能页面，产品线嵌套

> 提供给产品线一个页面，使产品线通过iframe嵌套实现登录

#### 特征

> 优点

* 实现成本低
* 每套功能都有一个页面，管理方便
* 独立的页面实现，安全性更高

> 缺点

* 产品线订制灵活度不高，UI/callback等无法满足产品线需求
* 不能抓取到当前页面的信息
* 产品线接入成本高



### 提供JS Api

> 提供JS Api生成DOM实现业务逻辑

#### 特征

> 优点

* 产品线订制灵活度高
* 与当前页面灵活交互
* 产品线接入成本底

> 缺点

* 实现成本高



## 需要考虑哪些技术点？
* 基础库
* 命名空间
* 面向对象的实现
* 设计模式
* 唯一元素ID
* CSS选择器冲突
* 跨域的POST,https请求
* 数据统计
* 多语言支持
* 多端适配
* 加密方案
* ...



## 架构
### 线上部署
Server

Template

CDN



### 代码结构

* 基础库 jQuery，Tangram，Underscope ...
* 基类
    * base.js getId, placeholder, event ..
    * validate.js 
    * suggestion.js    
    * crypt.js
    * dialog.js
    * fastclick.js
* 业务逻辑（module）
* 业务钩子（hook）
* 性能及用户行为统计（analysis）



### 业务逻辑维度

* 登录
* 登录弹框
* 注册
* 绑定手机号
* 验证手机号
* 补填用户名
* ...



### 功能维度
* 基础业务逻辑（module）
* 弹框等交互逻辑(uni)
* 网络层（network）
* 语言包（lang）,unicode
* 统计（analysis）
* 业务钩子(hook)
* 配置（config）
* 基础组件（lib）
* 依赖管理（login.js,uni_login.js...）
* 资源配置（wrapper.js，uni_wrapper.js）



### 打包编译
* 产品线入口文件(wrapper.js , uni_wrapper.js)
* 业务功能文件（login.js, login_tangram.js文件）
* 样式静态资源（login.css, login.png）



## 改进点
* 本地开发麻烦
* 没有测试用例（所有的功能手动测试）
* 没有CSS文件，image文件的自动打包功能







