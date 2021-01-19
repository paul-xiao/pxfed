# scrapy + mysql

scrapy startproject scrapyMysql

## pymysql

安装

pip3 install PyMySQL

## 爬取内容

scrapy shell

```sh
scrapy shell _link_

# 浏览器内查看相应内容
view(respone)

```

> 如何爬取动态页面

1. splash(性能差)
2. selenium/webdriver + platformjs(性能差)
3. 直接分析请求(性能高，难度大)

> api 如何反爬虫

- http?

反爬高手： lagou.com

[什么是 Waf](https://www.cnblogs.com/realjimmy/p/12937247.html)

## 启动

scrapy crawl spider_name

## todos

- scrape
  - splash
  - selenium
  - http
- Data persistence (mysql)
- data analysis (matplotlib,pandas)
