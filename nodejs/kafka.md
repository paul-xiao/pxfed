# kafka

## install

```sh
wget https://mirrors.tuna.tsinghua.edu.cn/apache/kafka/2.6.0/kafka_2.12-2.6.0.tgz

mv kafka_2.12-2.6.0 /usr/local/kafka

cd /usr/local/kafka/kafka_2.12-2.6.0

vim config/server.properties

# zookeeper

wget http://mirror.bit.edu.cn/apache/zookeeper/zookeeper-3.5.8/apache-zookeeper-3.5.8.bin.tar.gz

mv apache-zookeeper-3.5.8 /usr/local/zookeeper/apache-zookeeper-3.5.8
cd /usr/local/zookeeper
mkdir data
cd data
touch myid
echo myid 1

# 修改zoo.cfg
cd /usr/local/zookeeper/apache-zookeeper-3.5.8/conf
vim zoo.cfg
dataDir=/usr/local/zookeeper/data

## 启动zookeeper
cd /usr/local/zookeeper/apache-zookeeper-3.5.8/bin
./zkServer.sh start
```

## kafka

```sh
./kafka-topics.sh --list -zookeeper 127.0.0.1:2181

./kafka-topics.sh --create --zookeeper 127.0.0.1:2181 --replication-factor 1 --partitions 1 --topic topic1
./kafka-topics.sh --create --zookeeper 127.0.0.1:2181 --replication-factor 1 --partitions 1 --topic topic2

./kafka-topics.sh -zookeeper 127.0.0.1:2181 -describe -topic topic1

./kafka-console-producer.sh --broker-list 127.0.0.1:9092 --topic topic1

./kafka-console-consumer.sh  --bootstrap-server 127.0.0.1:9092 --from-beginning --topic topic1
```
