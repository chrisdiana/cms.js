CMS.js
 The blog using CMS.js doesn't need a database. You can write post in plain words, then CMS.js helps render it into markdown file and then use template to display content in certain format. All the pages are static, this means they are not the query results from the database, so the loading speed is faster. Also it only includes the functions you want to use(unlike WordPress, it has many default functions). Moreover, you can just host the blog in GitHub conveniently and edit your content through it


####What to Use cms.js for and When to Use It?

cms.js is perfect to use on any webpage that does not require dynamic data. It also great for when you want a similar page structure.

Dynamic page can be have slow performance since it’s difficult to config caching, are susceptible to known exploits as this example shows, [Millions of Drupal websites at risk from failure to patch](https://nakedsecurity.sophos.com/2014/10/30/millions-of-drupal-websites-at-risk-from-failure-to-patch/) and can be expensive to scale due to it's complexity

Static site generated from cms.js can be hosted on content delivery network(CDN)  and will improve performance as much as six times faster compared to the same optimized dynamic website. This is especially important on mobile devices and  is cheaper and faster to scale. Because of the simple page structure, static page exploits are easy to find and fix. 