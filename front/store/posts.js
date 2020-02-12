import Vue from 'vue';
import throttle from 'lodash.throttle';

export const state = () => ({
    mainPosts: [],
    hasMorePost : true,
    imagePaths : [],
});
const limit = 10;
export const mutations = {
    addMainPost(state, payload){
        state.mainPosts.unshift(payload);
        state.imagePaths = [];
    },
    removeMainPost(state, payload){
        const index = state.mainPosts.findIndex(v => v.id === payload.postId);
        state.mainPosts.splice(index, 1);
    },
    loadComments(state, payload){
        const index = state.mainPosts.findIndex(v => v.id === payload.postId);
        // 실수: state.mainPosts[index].Comments = payload.data;
        Vue.set(state.mainPosts[index], 'Comments', payload.data);
    },
    addComment(state, payload){
        const index = state.mainPosts.findIndex(v => v.id === payload.postId);
        state.mainPosts[index].Comments.unshift(payload);
    },
    loadPost(state, payload){
        state.mainPosts = [payload];
    },
    loadPosts(state, payload){
        if (payload.reset) {
            state.mainPosts = payload.data;
        } else {
            state.mainPosts = state.mainPosts.concat(payload.data);
        }
        state.hasMorePost = payload.length === limit;
    },
    concatImagePaths(state, payload){
        state.imagePaths = state.imagePaths.concat(payload);
    },
    removeImagePath(state, payload){
        state.imagePaths.splice(payload,1);
    },
    likePost(state, payload){
        const index = state.mainPosts.findIndex(v => v.id === payload.postId);
        state.mainPosts[index].Likers.push({
            id: payload.userId,
        })
    }, 
    unlikePost(state, payload){
        const index = state.mainPosts.findIndex(v => v.id === payload.postId);
        const userIndex = state.mainPosts[index].Likers.findIndex(v => v.id === payload.userId);
        state.mainPosts[index].Likers.splice(userIndex, 1);
    }
};
export const actions = {
    add({commit, state}, payload){
        this.$axios.post('/post', {
            content : payload.content,
            image : state.imagePaths,
        }, {
            withCredentials : true,
        })
        .then((res)=>{
            commit('addMainPost', res.data);
        })
        .catch((err)=>{
            console.error(err);
        });
    },
    remove({commit}, payload) {
        this.$axios.delete(`/post/${payload.postId}`, {
            withCredentials:true, 
        })
        .then(()=>{
            commit('removeMainPost', payload);
        })
        .catch((err)=>{
            console.error(err);
        });
    },
    addComment({commit}, payload){
        this.$axios.post(`/post/${payload.postId}/comment`, {
            content: payload.content,
        }, {withCredentials:true})
        .then((res)=>{
            commit('addComment', res.data);
        })
        .catch((err)=>{
            console.error(err);
        });
    },
    loadComments({commit}, payload){
        this.$axios.get(`/post/${payload.postId}/comments`)
        .then((res)=>{
            commit('loadComments', res.data);
        })
        .catch((err)=>{
            console.error(err);
        });
    },
    async loadPost ({commit, state}, payload){
        try {
            const res = await this.$axios.get(`/post/${payload}`);
            commit('loadPost', res.data);
        } catch (err) {
            console.error(err);
        }
    },
    loadPosts: throttle( async function ({commit, state}, payload){
        try {
            if (payload && payload.reset) {
                const res = await this.$axios.get('/posts?limit=10');
                commit('loadPosts', {
                    data: res.data,
                    reset: true,
                });
                return;
            }
            if (state.hasMorePost) {
                const lastPost = state.mainPosts[state.mainPosts.length - 1];
                const res = await this.$axios.get(`/posts?lastId=${lastPost && lastPost.id}&limit=10`);
                commit('loadPosts', res.data);
                return;
            }
        } catch (err) {
            console.error(err);
        }
    }, 1500), // 한번 실행 후, 3초 후에 다시 실행 가능함
    /* throttle: 이벤트를 일정한 주기마다 발생하도록 하는 기술 */
    /* debounce: 이벤트를 그룹화하여 특정시간이 지난 후, 하나의 이벤트만 발생하도록 하는 기술 */
    loadUserPosts: throttle( async function ({commit, state}, payload){
        try {
            if (payload && payload.reset) {
                const res = await this.$axios.get(`/user/${payload.userId}/posts?limit=10`);
                commit('loadPosts', {
                    data: res.data,
                    reset: true,
                });
                return;
            }
            if (state.hasMorePost) {
                const lastPost = state.mainPosts[state.mainPosts.length - 1];
                const res = await this.$axios.get(`/user/${payload.userId}/posts?lastId=${lastPost && lastPost.id}&limit=10`);
                commit('loadPosts', {
                    data: res.data,
                    reset: true,
                });
                return;
            }
        } catch (err) {
            console.error(err);
        }
    }, 1500),
    loadHashtagPosts: throttle( async function ({commit, state}, payload){
        try {
            if (payload && payload.reset) {
                const res = await this.$axios.get(`/hashtag/${payload.hashtag}?limit=10`);
                commit('loadPosts', {
                    data: res.data,
                    reset: true,
                });
                return;
            }
            if (state.hasMorePost) {
                const lastPost = state.mainPosts[state.mainPosts.length - 1];
                const res = await this.$axios.get(`/hashtag/${payload.hashtag}?lastId=${lastPost && lastPost.id}&limit=10`);
                commit('loadPosts', {
                    data: res.data,
                });
                return;
            }
        } catch (err) {
            console.error(err);
        }
    }, 1500),
    uploadImages ({commit}, payload){
        this.$axios.post('/post/images', payload, {
            withCredentials: true,
        })
        .then((res)=>{
            commit('concatImagePaths', res.data);
        })
        .catch((err)=>{
            console.error(err);
        })
    },
    retweet({commit}, payload){
        this.$axios.post(`/post/${payload.postId}/retweet`, {}, {
            withCredentials: true,
        })
        .then((res)=>{
            commit('addMainPost',res.data);
        })
        .catch((err)=>{
            console.error(err);
            alert(err.response.data);
        });
    },
    likePost({commit}, payload){
        this.$axios.post(`/post/${payload.postId}/like`, {}, {
            withCredentials: true,
        })
        .then((res)=>{
            commit('likePost', {
                userId: res.data.userId,
                postId: payload.postId,
            });
        })
        .catch((err)=>{
            console.error(err);
        });
    },
    unlikePost({commit}, payload){
        this.$axios.delete(`/post/${payload.postId}/like`, {
            withCredentials: true,
        })
        .then((res)=>{
            commit('unlikePost', {
                userId: res.data.userId,
                postId: payload.postId,
            });
        })
        .catch((err)=>{
            console.error(err);
        });
    }
};