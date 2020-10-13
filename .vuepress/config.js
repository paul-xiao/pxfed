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
            { text: 'Vue', link: '/vue/' },
            { text: 'Solutions', link: '/solutions/' },
            { text: 'Esx', link: '/esx/' },
        ],
        lastUpdated: 'Last Updated',
        sidebar: {
            '/nodejs/': [{
                title: 'Nodejs',
                collapsable: false,
                children: [
                    ['', '介绍'],
                    'async_hooks',
                    'buffer',
                    'child_process'
                ]
            }],
            '/vue/':[{
                title: 'Vue',
                collapsable: false,
                children: [
                    ['', '介绍'],
                    
                ]
            }],
            '/solutions/':[{
                title: 'Solutions',
                collapsable: false,
                children: [
                    ['', '介绍'],
                ]
            }],
            '/esx/':[{
                title: 'Esx',
                collapsable: false,
                children: [
                    ['', '介绍'],
                ]
            }]
        },
        smoothScroll: true
    }
}