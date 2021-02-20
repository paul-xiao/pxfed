# mysql

## 索引

```sql
--创建
CREATE INDEX tagIndex ON user(tag);

-- 查看
show index FROM user

-- 执行

EXPLAIN SELECT * from user WHERE tag = ''

--删除
alter TABLE user drop index tagIndex
```

## 数据插入优化

```js
;(async function() {
  const mysql = require('mysql2/promise')

  const connection = await mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '123456',
    database: 'test',
  })

  let dropSql = 'drop table if exists `test_insert`'
  await connection.query(dropSql)
  let createSql =
    'create table if not exists `test_insert`(id INT NOT NULL AUTO_INCREMENT, name VARCHAR(100) NOT NULL COMMENT "用户名",PRIMARY KEY ( id ));'
  await connection.query(createSql)
  let amount = Number(process.argv[2] || 1000)
  console.log(typeof process.argv[2], amount)
  let dur = 0
  let start = new Date().getTime()
  console.log('insert start')
  let count = 0
  async function* insetGenerator() {
    var i = 0
    while (i < amount) {
      i++
      res = await connection.query(
        'INSERT INTO  `test_insert` ( name) VALUES ( ?);',
        ['paul']
      )
      yield res
    }
  }
  for await (insert of insetGenerator()) {
    count++
    if (count === amount) {
      let end = new Date().getTime()
      dur = (end - start) / 1000
      console.log('insert end')
      console.log('耗时：', dur, 's')
      process.exit()
    }
  }
})()
```

```sql
mysql> select @@innodb_flush_log_at_trx_commit;
mysql> select @@sync_binlog;

mysql> set global innodb_flush_log_at_trx_commit = 2;
Query OK, 0 rows affected (0.00 sec)

mysql> set global sync_binlog = 500;
Query OK, 0 rows affected (0.00 sec)

```
