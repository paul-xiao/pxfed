// 闭包
// function foo() {
//   var a = 1
//   console.log(a)
//   return function() {
//     console.log(a)
//   }
// }

// var b = foo()

// b()

// function foo(a) {
//   return function(b, c) {
//     console.log(a)
//     console.log(b)
//     console.log(c)
//   }
// }

// var b = foo(1) //携带函数作用域，占用内存

// b(2, 3) //1 2 3

function showHelp(help) {
  document.getElementById('help').innerHTML = help
}

function setupHelp() {
  var helpText = [
    { id: 'email', help: 'Your e-mail address' },
    { id: 'name', help: 'Your full name' },
    { id: 'age', help: 'Your age (you must be over 16)' },
  ]

  for (var i = 0; i < helpText.length; i++) {
    var item = helpText[i]
    document.getElementById(item.id).onfocus = function() {
      showHelp(item.help)
    }
  }
}

setupHelp()
