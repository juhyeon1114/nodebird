export const state = () => ({
    me: null,
    followerList : [],
    followingList : [],
});
export const mutations = { //동기적 작업
    setMe(state, payload){
        state.me = payload;
    },
    changeNickname(state, payload){
        state.me.nickname = payload.nickname;
    }
};
export const actions = { //비동기적 작업
    signUp( {commit, state} , payload){
        //context는 {commit, dispatch, state, rootState, getters, rootGetters}로 구조분해 가능.(root가 붙은 것은 index모듈의 것)
        commit('setMe', payload);
    },
    logIn( {commit}, payload){
        commit('setMe', payload);
    },
    logOut( {commit}, payload){
        commit('setMe', null);
    },
    changeNickname({commit},payload){
        commit('changeNickname', payload);
    }
};