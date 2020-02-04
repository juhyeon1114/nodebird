<template>
  <v-container>
    <post-form v-if="me" />
    <div>
      <post-card v-for="p in mainPosts" :key="p.id" :post="p" />
    </div>
  </v-container>
</template>

<script>
  import PostCard from '~/components/PostCard';
  import PostForm from '~/components/PostForm';

  export default {
    components: {
      PostCard,
      PostForm,
    },
    data() {
      return {
        name: 'Nuxt.js',
      }
    },
    computed : {
      me(){
        return this.$store.state.users.me;
      },
      mainPosts() {
        return this.$store.state.posts.mainPosts;
      },
      hasMorePost(){
        return this.$store.state.posts.hasMorePost;
      }
    },
    fetch({ store }){
      // 컴포넌트가 마운트되기 전에 스토어에 비동기적으로 데이터를 넣을 때 사용
      return store.dispatch('posts/loadPosts');
    },
    // asyncData(){ // 컴포넌트가 마운트되기 전, 비동기적으로 채워지는 data.
    //   return {}
    // },
    mounted(){
      //this.$store.dispatch('posts/loadPosts');
      window.addEventListener('scroll', this.onScroll);
    },
    beforeDestroy(){
      window.removeEventListener('scroll', this.onScroll);
    },
    methods : {
      /*
        virtualized list
        -> vue-virtual-scroll-list 라이브러리로 구현
      */
      onScroll(){
        if(window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300){
          // window.scrollY = 사용자의 스크롤 위치
          // document.documentElement.clientHeight = 눈에 보이는 화면의 높이
          // document.documentElement.scrollHeight = 스크롤 가장 위 ~ 스크롤 가장 아래 까지의 높이
          if(this.hasMorePost){
            this.$store.dispatch('posts/loadPosts');
          }
        }
      }
    }
  }
</script>

<style>

</style>
