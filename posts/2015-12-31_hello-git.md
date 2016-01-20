title: GIT入门
date: 2013-09-12 10:24:28
tags: GIT,Github
category: 技术
---

git和svn不同的地方有一个索引的概念，需要把修改点提交到索引，之后在提交索引到仓库。

###github使用好文章推荐


- git入门: [http://rogerdudler.github.io/git-guide/index.zh.html](http://rogerdudler.github.io/git-guide/index.zh.html)
- git详细:[http://www.cnblogs.com/zhangjing230/archive/2012/05/09/2489745.html#gitdefintion](http://www.cnblogs.com/zhangjing230/archive/2012/05/09/2489745.html#gitdefintion) 
- git总结[http://webzhangnan.github.io/2014/03/28/git-%E5%85%A5%E9%97%A8/](http://webzhangnan.github.io/2014/03/28/git-%E5%85%A5%E9%97%A8/)
- first:[http://www.csser.com/board/4f53875c55bdcb545c000d05](http://www.csser.com/board/4f53875c55bdcb545c000d05)
- second: [http://my.oschina.net/meilihao/blog/157716](http://my.oschina.net/meilihao/blog/157716)
- jekyll git page:[搭建一个免费的，无限流量的Blog----github Pages和Jekyll入门](http://www.ruanyifeng.com/blog/2012/08/blogging_with_jekyll.html) 
- 中文介绍jeykyll详细:[http://jekyllcn.com/](http://jekyllcn.com/)
- jekyll模板:[https://github.com/jekyll/jekyll/wiki/Sites](https://github.com/jekyll/jekyll/wiki/Sites)
- jekyll详细1:[http://blog.csdn.net/on_1y/article/details/19259435](http://blog.csdn.net/on_1y/article/details/19259435)
- jekyll详细2:[http://higrid.net/c-art-jeklly_template_data.htm](http://higrid.net/c-art-jeklly_template_data.htm)

###github合作思路

- 相关文章[http://qbaty.iteye.com/blog/865368](http://qbaty.iteye.com/blog/865368)、[http://joshuasabrina.iteye.com/blog/1816597](http://joshuasabrina.iteye.com/blog/1816597)、[http://xiaocong.github.io/blog/2013/03/20/team-collaboration-with-github/](http://xiaocong.github.io/blog/2013/03/20/team-collaboration-with-github/)








###必要的命令

1、语句设置默认。

    git config --global user.name 'conan'    

等语句设置默认。 2、建立仓库。

    git init    

 3、添加修改到索引

    git add .    

conan

 4、提交索引中的修改到仓库

    git commit -m "update"    

5、在加一个-a参数就可以既将修改的内容添加到索引（新增文件时不可以），又提交

    git commit commit -am "add inde and commit"    

6、检查还未提交到索引的修改

    git diff    

7、显示以往提交的记录

    git log --all    

8、显示当前的修改状态，提示修改了什么，或者增加了什么

    git status    

9、修改上一次commit(提交)的解释文本，下面操作是先提交，然后修改解释文本，然后查看log日志

    git commit -m "ready change"
    git commit --amend -m "change commit text"
    git log
    

10、删除一个文件时，无法通过命令“git add .”来添加索引（[柯楠][1]认为十分周全的考虑，避免意外删除）， 可以通过一下2种方式提交

    git add -A . && git commit -m "delete file"    

    git commit -am "delte file"    

11、克隆本地仓库到一个远端仓库

    git clone --bare . ../remote-repository.git     

12、将修改的内容推送到远端仓库（先提交，再推送）

    git commmit -am "read push remote"
    git push ../remote-repository.git
    

13、查看帮助

    git init -help
    git  add -help     

14、为远程仓库地址添加一个短名称（默认克隆源头的仓库短名称是"origin"）

    #设置短名称
    git remote add shortname ../remote-repository.git

修改内容

echo 'change' test01

提交

    git commit -am "update of short name"

使用短名称推送

    git push shortname
    

15、显示已经有的远端仓库

    git remote     

15、克隆一个远端仓库

    git clone https://github.com/webzhangnan/rocket_apps.git    

16、拉取远端仓库的修改

    git pull https://github.com/webzhangnan/rocket_apps.git    

上面的操作将会自动拉取并合并远程(https://github.com/webzhangnan/rocket_apps.git的master分支)和本地的分支。

可以分开操作先拉取

    git fetch https://github.com/webzhangnan/rocket_apps.git    

然后合并

    git merge https://github.com/webzhangnan/rocket_apps.git     

操作。

17、删除新建的还未提交的文件

    git clean -f    

18、还原到老版本 首先显示所有的提交log日志

    git log --all    

然后checkout对应的commit_name就是commit后面那串字符

    git checkout commit_name    

或者使用（这种会浏览版本记录）

    git revert commit_name    

19、标记功能

    git tag version1.6 -m 'version 1.6'      

20、查看所有分支

    git branch -a    

21、创建分支

    git branch newbranch    

22、删除分支

    git branch -d newbranch    

23、合并分支

    git merge newbranch    

或者使用合并工具

    git mergetool     

24、合并多个commit

    git rebase -i HEAD~7    

25、创建补丁

    # Create a new branch
    git branch mybranch

未完待续...

 [1]: http://js250.com
