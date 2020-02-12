//nuxt에 대한 설정을 담당하는 파일

module.exports = {
    head: {
        title: 'NodeBird',
        meta: [{
                charset: 'utf-8',
            }, {
                name: 'viewport',
                content: 'width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=yes,viewport-fit=cover',
            }, {
                'http-equiv': 'X-UA-Compatible', content: 'IE=edge',
            }, {
                hid: 'desc', name: 'description', content: 'NodeBird SNS',
            }, {
                hid: 'ogtitle', property: 'og:title', content: 'NodeBird',
            }, {
                hid: 'ogdesc', property: 'og:description', content: 'NodeBird SNS',
            }, {
                hid: 'ogtype', property: 'og:type', content: 'website',
            }, {
                hid: 'ogimage', property: 'og:image', content: 'https://vue.nodebird.com/vue-nodebird.png',
            }, {
                hid: 'ogurl', property: 'og:url', content: 'https://vue.nodebird.com',
            }
        ],
        link: [{
            rel: 'shortcut icon', href: '/vue-nodebird.png'
        }],
    },
    modules : [
        '@nuxtjs/axios',
    ],
    buildModules : [
        '@nuxtjs/vuetify',
        '@nuxtjs/moment', //tree shaking(필요없는 파일들을 처내는 것)을 위함
    ],
    moment: {
        locales: ['ko'],
    },
    build: {
        analyze: false, // true->nuxt가 빌드하는 과정을 볼 수 있음(webpack bundel analyzer)
        extractCSS: true, // css파일을 따로 만듬
        extend(config, { isClient, isServer, isDev }) {
            if (isServer && !isDev) {
                config.devtool = 'hidden-source-map';
            }
            //console.log('webpack', config, isServer, isClient);
        } // 웹팩 설정을 볼 수 있음
    },
    plugins : [],
    vuetify : {},
    axios: {
        browserBaseURL: 'http://localhost:3085', // client에서 axios보낼 때
        baseURL: 'http://localhost:3085', // 서버에서 axios보낼 때
        https: false,
    },
    server: {
        port: process.env.PORT || 3080,
    },
}

/*
compression-webpack-plugin
-> build할 때, gzip파일을 미리 만들어줌
-> 이렇게 하지 않는 경우엔 요청을 받을 때마다 gzip으로 압축하므로 프론트 서버에 무리가 갈 수 있음
*/
