module.exports = {
  title: 'PXFED',
  description: 'Just playing around',
  head: [['link', { rel: 'icon', href: '/favicon.ico' }]],
  themeConfig: {
    logo: '/logo.png',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Esx', link: '/esx/' },
      { text: 'Vue', link: '/vue/' },
      { text: 'Nodejs', link: '/nodejs/' },
      { text: 'Solutions', link: '/solutions/' },
    ],
    lastUpdated: 'Last Updated',
    sidebar: {
      '/esx/': [
        {
          title: 'Esx',
          collapsable: false,
          children: [['', '介绍'], 'es5', 'es6', 'es9'],
        },
      ],
      '/vue/': [
        {
          title: 'Vue',
          collapsable: false,
          children: [
            ['', '介绍'],
            'reactive',
            'diff',
            'keepalive',
            'namespace',
            'ssr',
            'vue_router',
          ],
        },
      ],
      '/nodejs/': [
        {
          title: 'Nodejs',
          collapsable: false,
          children: [
            ['', '介绍'],
            'async_hooks',
            'buffer',
            'child_process',
            'crypto',
            'http',
            'kafka',
            'load_balancing',
            'rabbitMQ',
            'redis',
            'websocket',
          ],
        },
      ],
      '/solutions/': [
        {
          title: 'Solutions',
          collapsable: false,
          children: [['', '介绍'], 'rem', 'app', 'axios', 'im', 'jsdoc'],
        },
      ],
      '/db/': [
        {
          title: 'mysql',
          collapsable: false,
          children: ['mysql'],
        },
      ],
      '/dv/': [
        {
          title: '数据可视化',
          collapsable: false,
          children: [['', '介绍']],
        },
      ],
    },
    smoothScroll: true,
  },
}
