# diff 算法

## 科普

算法复杂度 Algorithmic Complexity

> 算法复杂度是指算法在编写成可执行程序后，运行时所需要的资源，资源包括时间资源和内存资源

- 时间复杂度： 执行算法所需要的计算工作量。

  按数量级递增排列，常见的时间复杂度有：
  常数阶 O(1),对数阶 O(log2n)(以 2 为底 n 的对数，下同),线性阶 O(n),
  线性对数阶 O(nlog2n),平方阶 O(n^2)，立方阶 O(n^3),...，
  k 次方阶 O(n^k),指数阶 O(2^n)。随着问题规模 n 的不断增大，上述时间复杂度不断增大，算法的执行效率越低。

- 空间复杂度

  空间复杂度(Space Complexity)是对一个算法在运行过程中临时占用存储空间大小的量度，记做 S(n)=O(f(n))。比如直接插入排序的时间复杂度是 O(n^2),空间复杂度是 O(1) 。而一般的递归算法就要有 O(n)的空间复杂度了，因为每次递归都要存储返回信息。一个算法的优劣主要从算法的执行时间和所需要占用的存储空间两个方面衡量。

## virtual dom

VD 只是一个简单的 JS 对象，并且最少包含 tag、props 和 children 三个属性。不同的框架对这三个属性的命名会有点差别，但表达的意思是一致的。它们分别是标签名（tag）、属性（props）和子元素对象（children）特点是将页面的状态抽象为 JS 对象的形式，配合不同的渲染工具，使跨平台渲染成为可能。如 React 就借助 VD 实现了服务端渲染、浏览器渲染和移动端渲染等功能。此外，在进行页面更新的时候，借助 VD，DOM 元素的改变可以在内存中进行比较，再结合框架的事务机制将多次比较的结果合并后一次性更新到页面，从而有效地减少页面渲染的次数，提高渲染效率

```js

{
    tag: "div",
    props: {},
    children: [
        "Hello World",
        {
            tag: "ul",
            props: {},
            children: [{
                tag: "li",
                props: {
                    id: 1,
                    class: "li-1"
                },
                children: ["第", 1]
            }]
        }
    ]
}

```

## patch

> https://segmentfault.com/a/1190000008782928
> https://calendar.perfplanet.com/2013/diff/

diff 的过程就是调用 patch 函数，就像打补丁一样修改真实 dom。

```js
function sameVnode(oldVnode, vnode) {
  return vnode.key === oldVnode.key && vnode.sel === oldVnode.sel
}

function patch(oldVnode, vnode) {
  if (sameVnode(oldVnode, vnode)) {
    //两个节点是否值得比较
    patchVnode(oldVnode, vnode)
  } else {
     // 当不值得比较时，新节点直接把老节点整个替换了
    const oEl = oldVnode.el
    let parentEle = api.parentNode(oEl)
    createEle(vnode)
    if (parentEle !== null) {
      api.insertBefore(parentEle, vnode.el, api.nextSibling(oEl))
      api.removeChild(parentEle, oldVnode.el)
      oldVnode = null
    }
  }
  return vnode
}

patchVnode (oldVnode, vnode) {
    const el = vnode.el = oldVnode.el
    let i, oldCh = oldVnode.children, ch = vnode.children
    if (oldVnode === vnode) return //没有变化 不修改
    if (oldVnode.text !== null && vnode.text !== null && oldVnode.text !== vnode.text) {
        api.setTextContent(el, vnode.text) //文本节点的比较
    }else {
        updateEle(el, vnode, oldVnode)
        if (oldCh && ch && oldCh !== ch) {
            updateChildren(el, oldCh, ch) // 比较子节点
        }else if (ch){
            createEle(vnode) //添加子节
        }else if (oldCh){
            api.removeChildren(el) //删除子节点
        }
    }
}

updateChildren (parentElm, oldCh, newCh) {
    let oldStartIdx = 0, newStartIdx = 0
    let oldEndIdx = oldCh.length - 1
    let oldStartVnode = oldCh[0]
    let oldEndVnode = oldCh[oldEndIdx]
    let newEndIdx = newCh.length - 1
    let newStartVnode = newCh[0]
    let newEndVnode = newCh[newEndIdx]
    let oldKeyToIdx
    let idxInOld
    let elmToMove
    let before
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
            if (oldStartVnode == null) {   //对于vnode.key的比较，会把oldVnode = null
                oldStartVnode = oldCh[++oldStartIdx]
            }else if (oldEndVnode == null) {
                oldEndVnode = oldCh[--oldEndIdx]
            }else if (newStartVnode == null) {
                newStartVnode = newCh[++newStartIdx]
            }else if (newEndVnode == null) {
                newEndVnode = newCh[--newEndIdx]
            }else if (sameVnode(oldStartVnode, newStartVnode)) {
                patchVnode(oldStartVnode, newStartVnode)
                oldStartVnode = oldCh[++oldStartIdx]
                newStartVnode = newCh[++newStartIdx]
            }else if (sameVnode(oldEndVnode, newEndVnode)) {
                patchVnode(oldEndVnode, newEndVnode)
                oldEndVnode = oldCh[--oldEndIdx]
                newEndVnode = newCh[--newEndIdx]
            }else if (sameVnode(oldStartVnode, newEndVnode)) {
                patchVnode(oldStartVnode, newEndVnode)
                api.insertBefore(parentElm, oldStartVnode.el, api.nextSibling(oldEndVnode.el))
                oldStartVnode = oldCh[++oldStartIdx]
                newEndVnode = newCh[--newEndIdx]
            }else if (sameVnode(oldEndVnode, newStartVnode)) {
                patchVnode(oldEndVnode, newStartVnode)
                api.insertBefore(parentElm, oldEndVnode.el, oldStartVnode.el)
                oldEndVnode = oldCh[--oldEndIdx]
                newStartVnode = newCh[++newStartIdx]
            }else {
               // 使用key时的比较
                if (oldKeyToIdx === undefined) {
                    oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx) // 有key生成index表
                }
                idxInOld = oldKeyToIdx[newStartVnode.key]
                if (!idxInOld) {
                    api.insertBefore(parentElm, createEle(newStartVnode).el, oldStartVnode.el)
                    newStartVnode = newCh[++newStartIdx]
                }
                else {
                    elmToMove = oldCh[idxInOld]
                    if (elmToMove.sel !== newStartVnode.sel) {
                        api.insertBefore(parentElm, createEle(newStartVnode).el, oldStartVnode.el)
                    }else {
                        patchVnode(elmToMove, newStartVnode)
                        oldCh[idxInOld] = null
                        api.insertBefore(parentElm, elmToMove.el, oldStartVnode.el)
                    }
                    newStartVnode = newCh[++newStartIdx]
                }
            }
        }
        if (oldStartIdx > oldEndIdx) {
            before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].el
            addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx)
        }else if (newStartIdx > newEndIdx) {
            removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx)
        }
}
```
