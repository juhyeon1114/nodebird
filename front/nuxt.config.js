//nuxt에 대한 설정을 담당하는 파일

module.exports = {
    head: {
        title: 'NodeBird',
    },
    modules : [
        '@nuxtjs/axios',
    ],
    buildModules : [
        '@nuxtjs/vuetify',
    ],
    plugins : [],
    vuetify : {},
    axios: {
        browserBaseURL: 'http://localhost:3085', // client에서 axios보낼 때
        baseURL: 'http://localhost:3085', // 서버에서 axios보낼 때
        https: false,
    },
    server: {
        port: 3080,
    },
}
