# 滚动渐入

```css
section{
    opacity: 0;
    transform: scale(0.8);
    transition: 0.3s all ease-out;
}
```

```js
 mounted() {
    this.eles = Array.from(document.querySelectorAll("section"));
    window.addEventListener("scroll", this.handleScroll);
    this.handleScroll(); //init
  },
  methods: {
    handleScroll() {
      const isElemVisible = (el) => {
        var rect = el.getBoundingClientRect();
        var elemTop = rect.top + 100; // 100 = buffer
        var elemBottom = rect.bottom;
        return elemTop < window.innerHeight && elemBottom >= 0;
      };
      for (let el of this.eles) {
        el.style.opacity = isElemVisible(el) ? 1 : 0;
        el.style.transform = isElemVisible(el) ? "scale(1)" : "scale(0.8)"; //缩放
      }
    },
  },
  beforeDestory() {
    window.removeEventListener("scroll", this.handleFadein);
  },


```