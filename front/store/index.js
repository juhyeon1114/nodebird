export const state = () => ({});
export const mutations = {};

export const actions = {
    nuxtServerInit({commit, dispatch, state}, {req}){
        // 예약된 이름
        // -> SSR핵심 기능
        // -> 모든 페이지에서 페이지가 그려지기 전에 실행됨
        return dispatch('users/loadUser');
    },
    // nuxtServerInit : fetch = 모든 페이지에서 실행 : 단일 페이지에서만 실행
}