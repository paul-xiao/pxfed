# nginx

## default

```sh
#   http rewrite to https
server {
    listen 80;
    server_name *.irealtime.cn;
    rewrite ^(.*) https://irealtime.cn$1 permanent;  #非https默认跳转到首页

    if ($http_host ~* "^(.*?)\.irealtime\.cn$") {    #正则表达式
        set $domain $1;                              #设置变量
    }
    location / {
        proxy_redirect          off;
        proxy_set_header        Host $host;
        proxy_set_header        X-Real-IP $remote_addr;
        proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
        #root   /usr/share/nginx/html;
        #index  index.html index.htm;
        if ($domain ~* "console") {
        proxy_pass              http://127.0.0.1:8081;      #域名中有console，转发到8081端口
        }
        proxy_pass              http://127.0.0.1:8080;  # 本地程序代理
    }

    error_page   500 502 503 504  /50x.html;

    location = /50x.html {
        root   /usr/share/nginx/html;
    }

}
#webiste
server {
    listen   8080;
    server_name webiste;
    root     /home/web/website;
    index index.html;

    location / {
             try_files $uri $uri/ @router;
             index index.html;
         }

    location @router {
            rewrite ^.*$ /index.html last;
        }
}
# console
server {
    listen       8081;
    server_name  console;
    root         /home/web/customer;

    location / {
    }

    location ^~ /api/ {
        rewrite  ^/api/(.*)$  /$1  break;  # 重写路径将  api 替换为空
        proxy_pass http://127.0.0.1:3000;

    }

    error_page 404 /404.html;
    location = /404.html {
    }

    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
    }
}

```

## https

```sh
 #   https
    server {
        listen   443 ssl http2;
        server_name irealtime.cn;

        ssl_certificate "/home/crt/fullchain.crt";
        ssl_certificate_key "/home/crt/private.pem";
        ssl_protocols TLSv1.1 TLSv1.2;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE;
        ssl_prefer_server_ciphers on;
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 10m;

        location / {
            proxy_pass http://127.0.0.1:8080;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header   X-Forwarded-Proto $scheme;
        }
    }
#   https
    server {
        listen   443 ssl http2;
        server_name console.irealtime.cn;

        ssl_certificate "/home/crt/fullchain.crt";
        ssl_certificate_key "/home/crt/private.pem";
        ssl_protocols TLSv1.1 TLSv1.2;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE;
        ssl_prefer_server_ciphers on;
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 10m;

        location / {
            proxy_redirect off;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_pass http://127.0.0.1:8081;
        }

    }


```
