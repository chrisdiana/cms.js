title: javascript中element等于string的坑
date: 2012-11-5 19:14:16
tags: Example
---

JS编码中有一个方法的形参需要判断类型：

    var test = function(ele){
        if((typeof ele).toLowerCase() == 'string' || ele==''){
            //do something here
        }else{
        }
    }

正常情况下在传递一个element作为形参去执行这个方法程序应该走到else的分支中去；但是断点发现，一个<a href="" id="test"></a>的节点作为形参却走到了if中的代码，断电发现：

    ele==''
    
竟然为true , console打出来的参数确实是一个element，typeof出来也是object。经大神提示：

    var a = document.createElement('div');
    a.toString = function(){
        return 'test'
    };
    a=='test'//true
    
但是，这个<a href="" id="test"></a>并没有重写toString方法。为何会toString会返回""呢。

    var b = document.createElement('a');
    b.href='http://www.baidu.com';
    b.toString() == 'http://www.baidu.com/';//true
    
这下全都明白了。