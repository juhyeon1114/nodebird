export const state = () => ({
    hello : 'hello',
});
export const mutations = {
    bye(state){
        state.hello = 'goodbye';
    }
};