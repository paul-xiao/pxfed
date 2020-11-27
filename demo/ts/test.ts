// const hello : string = "hola!"
// console.log(hello)

let a: any    //任意
let b: number //数字
let c: boolean //boolean
let d: any[] = [] //数组
let e: Array<any> = [] //数组
let f: [string, number] //元组: 元组类型用来表示已知元素数量和类型的数组，各元素的类型不必相同，对应位置的类型需要相同。
enum Color {Red, Green, Blue} // 枚举
let g: Color = Color.Blue;
//void
function hello(): void {
    alert('void')
}
// other: null | undefined | never

var h = 1
const i = 2
let j = 3 

let myMap = new Map([
    ["key1", "value1"],
    ["key2", "value2"]
]); 

interface IPerson { 
    firstName:string, 
    lastName:string, 
    sayHi: ()=>string 
} 
 
var customer:IPerson = { 
    firstName:"Tom",
    lastName:"Hanks", 
    sayHi: ():string =>{return "Hi there"} 
} 


 