export const state = () => ({
    me: null,
    followerList : [],
    followingList : [],
    hasMoreFollowing: true,
    hasMoreFollower: true,
});

const totalFollowers = 8;
const totalFollowings = 6;
const limit = 3;

export const mutations = { //동기적 작업
    setMe(state, payload){
        state.me = payload;
    },
    changeNickname(state, payload){
        state.me.nickname = payload.nickname;
    },
    addFollowing(state, payload){
        state.followingList.push(payload);
    },
    addFollower(state, payload){
        state.followerList.push(payload);
    },
    removeFollowing(state, payload){
        const index = state.followingList.findIndex(v=>v.id === payload.id);
        state.followingList.splice(index,1);
    },
    removeFollower(state, payload){
        const index = state.followerList.findIndex(v=>v.id === payload.id);
        state.followerList.splice(index,1);
    },
    loadFollowings(state, payload){
        const diff = totalFollowings - state.followingList.length;
        const fakeUsers = Array(diff > limit ? limit : diff).fill().map(v=>({
            id: Math.random().toString(),
            nickname: Math.floor(Math.random() * 1000),
        }));
        state.followingList = state.followingList.concat(fakeUsers);
        state.hasMoreFollowing = fakeUsers.length === limit;
    },
    loadFollowers(state, payload){
        const diff = totalFollowers - state.followerList.length;
        const fakeUsers = Array(diff > limit ? limit : diff).fill().map(v=>({
            id: Math.random().toString(),
            nickname: Math.floor(Math.random() * 1000),
        }));
        state.followerList = state.followerList.concat(fakeUsers);
        state.hasMoreFollower = fakeUsers.length === limit;
    },
};
export const actions = { //비동기적 작업
    signUp( {commit, state} , payload){
        // context는 {commit, dispatch, state, rootState, getters, rootGetters}로 구조분해 가능.
        // (root가 붙은 것은 index모듈의 것)
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
    },
    addFollowing({commit},payload){
        commit('addFollowing', payload);
    },
    addFollower({commit},payload){
        commit('addFollower', payload);
    },
    removeFollowing({commit},payload){
        commit('removeFollowing', payload);
    },
    removeFollower({commit},payload){
        commit('removeFollower', payload);
    },
    loadFollowings({commit, state},payload){
        if(state.hasMoreFollowing){
            commit('loadFollowings', payload);
        }
    },
    loadFollowers({commit, state},payload){
        if(state.hasMoreFollower){
            commit('loadFollowers', payload);
        }
    }

};