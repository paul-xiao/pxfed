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
            { text: 'Esx', link: '/esx/' },
            { text: 'Vue', link: '/vue/' },
            { text: 'Nodejs', link: '/nodejs/' },
            { text: 'Solutions', link: '/solutions/' },
           
        ],
        lastUpdated: 'Last Updated',
        sidebar: {
            '/esx/':[{
                title: 'Esx',
                collapsable: false,
                children: [
                    ['', '介绍'],
                    'es6',
                    'es9'
                ]
            }],
            '/vue/':[{
                title: 'Vue',
                collapsable: false,
                children: [
                    ['', '介绍'],
                    
                ]
            }],
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
            '/solutions/':[{
                title: 'Solutions',
                collapsable: false,
                children: [
                    ['', '介绍'],
                ]
            }]          
        },
        smoothScroll: true
    }
}