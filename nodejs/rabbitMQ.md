# rabbitMq

AMQP 0-9-1 协议，它是 RabbitMQ 支持的协议之一。
What is AMQP 0-9-1?
AMQP 0-9-1 (Advanced Message Queuing Protocol) is a messaging protocol that enables conforming client applications to communicate with conforming messaging middleware brokers.

## install

> https://www.cnblogs.com/fengyumeng/p/11133924.html

由于 rabbitmq 是基于 erlang 语言开发的，所以必须先安装 erlang。

```sh

# 安装  erlang
yum -y install ncurses-devel

mkdir /user/local/erlang

cd /user/local/erlang

wget http://erlang.org/download/otp_src_22.0.tar.gz

tar -zxvf otp_src_22.0.tar.gz

cd otp_src_22.0

./configure --prefix=/usr/local/erlang

make install

echo 'export PATH=$PATH:/usr/local/erlang/bin' >> /etc/profile
source /etc/profile

## 测试
erl


# 安装mq


echo 'export PATH=$PATH:/usr/local/rabbitmq/rabbitmq_server-3.7.15/sbin' >> /etc/profile

启动：

rabbitmq-server -detached


停止：

rabbitmqctl stop


状态：

rabbitmqctl status
rabbitmq-plugins enable rabbitmq_management

rabbitmqctl list_users

rabbitmqctl add_user paul 123456

rabbitmqctl set_user_tags paul administrator


```

## 消息确认机制(ACK)

> https://www.cnblogs.com/lgg20/p/12538903.html

如果在处理消息的过程中，消费者的服务器在处理消息的时候出现异常，那么可能这条正在处理的消息就没有完成消息消费，数据就会丢失。为了确保数据不会丢失，RabbitMQ 支持消息确定-ACK。
