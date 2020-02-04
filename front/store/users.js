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

export const mutations = { //동기적 작업 (state변경)
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
        const index = state.me.Followings.findIndex(v=>v.id === payload.userId);
        state.me.Followings.splice(index,1);
    },
    removeFollower(state, payload){
        const index = state.followerList.findIndex(v=>v.id === payload.id);
        state.followerList.splice(index,1);
    },
    loadFollowings(state, payload){
        if (payload.offset === 0){
            state.followingList = payload.data;
        } else {
            state.followingList = state.followingList.concat(payload.data);
        }
        state.hasMoreFollowing = payload.data.length === limit;
    },
    loadFollowers(state, payload){
        if (payload.offset === 0) {
            state.followerList = payload.data;
        } else {
            state.followerList = state.followerList.concat(payload.data);
        }
        state.hasMoreFollower = payload.data.length === limit;
    },
    following(state, payload){
        state.me.Followings.push({id: payload.userId});
    },
};
export const actions = { //비동기적 작업 (서버통신)
    async loadUser ({state, commit}) {
        try {
            const res = await this.$axios.get('/user', {
                withCredentials: true,
            })
            commit('setMe', res.data);
        } catch (err) {
            console.error(err);
        }
    },
    signUp( {commit, state} , payload){
        // context는 {commit, dispatch, state, rootState, getters, rootGetters}로 구조분해 가능.
        // (root가 붙은 것은 index모듈의 것)
        this.$axios.post('/user', {
            email: payload.email,
            nickname: payload.nickname,
            password: payload.password,
        }, {
            withCredentials : true, // 프론트와 백 사이의 쿠키 저장을 허용 (in axios)
        } ).then((res)=>{
            commit('setMe', res.data);
        }).catch((err)=>{
            console.error(err);
        });
        
    },
    logIn( {commit}, payload){
        this.$axios.post("/user/login", {
            email : payload.email,
            nickname : payload.nickname,
            password : payload.password,
        }, {
            withCredentials : true, // 프론트와 백 사이의 쿠키 저장을 허용(in axios)
        } ).then((res)=>{
            commit('setMe', res.data);
        }).catch((err)=>{
            console.error(err);
        });;
    },
    logOut( {commit}, payload){
        this.$axios.post("/user/logout", {}, {withCredentials : true})
        .then(() => {
            commit('setMe', null);
        }).catch((err) => {
            console.error(err);
        });
    },
    changeNickname({commit},payload){
        this.$axios.patch(`/user/nickname`, {nickname: payload.nickname}, {
            withCredentials:true,
        })
        .then(() => {
            commit('changeNickname', payload);
        }).catch((err) => {
            console.error(err);
        });
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
    loadFollowers({commit, state}, payload){
        if (!payload && payload.offset === 0 && !state.hasMoreFollower) {
            return;
        }
        let offset = state.followerList.length;
        if (payload && payload.offset === 0) {
            offset = 0;
        }
        return this.$axios.get(`/user/${state.me.id}/followers?limit=3&offset=${offset}`, {
            withCredentials: true,
        })
        .then((res)=>{
            commit('loadFollowers', {
                data: res.data,
                offset,
            });  
        })
        .catch((err)=>{
            console.error(err);
        })
    },
    loadFollowings({commit, state}, payload){
        if (!payload && payload.offset === 0 && !state.hasMoreFollowing) {
            return;
        }
        let offset = state.followingList.length;
        if (payload && payload.offset === 0) {
            offset = 0;
        }
        return this.$axios.get(`/user/${state.me.id}/followings?limit=3&offset=${offset}`, {
            withCredentials: true,
        })
        .then((res)=>{
            commit('loadFollowings', {
                data: res.data,
                offset,
            });  
        })
        .catch((err)=>{
            console.error(err);
        })
    },
    follow({ commit }, payload){
        this.$axios.post(`/user/${payload.userId}/follow`, {}, {
            withCredentials: true,
        })
        .then((res)=>{
            commit('following', {
                userId: payload.userId,
            });
        })
        .catch((err)=>{
            console.error(err);
        })
    },
    unfollow({ commit }, payload){
        this.$axios.delete(`/user/${payload.userId}/follow`, { //delete 메소드는 두번째 인덱스에 data를 넣으면 안됨
            withCredentials: true,
        })
        .then((res)=>{
            commit('removeFollowing', {
                userId: payload.userId,
            });
        })
        .catch((err)=>{
            console.error(err);
        })
    },

};