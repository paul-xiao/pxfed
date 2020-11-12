function Person(name) {
  this.name = name
  this.sex = '男'
  this.foo = () => {
    //示例方法
    console.log('foo', this.name)
  }
}

var p1 = new Person('tom')
var p2 = new Person('jerry')

p1.foo()
p2.foo()
