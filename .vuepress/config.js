module.exports = {
    title: 'PXFED',
    description: 'Just playing around',
    head: [
        ['link', { rel: 'icon', href: '/favicon.ico' }]
    ],
    themeConfig: {
        logo: '/logo.png',
        nav: [
            { text: 'Home', link: '/' },
            { text: 'Nodejs', link: '/nodejs/' },
            { text: 'Vue', link: '/vue' },
        ],
        lastUpdated: 'Last Updated',
        sidebar: {
            '/nodejs/': [{
                title: 'Nodejs',
                collapsable: false,
                children: [
                    ['', '介绍'],
                    ['async_hooks', '异步钩子'],
                    ['buffer', '缓冲器'],
                    'child_process'
                ]
            }]
        },
        smoothScroll: true
    }
}