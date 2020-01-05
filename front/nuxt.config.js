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
    vuetify : {

    },
}
