<template>
  <v-container>
    <v-card style="margin-bottom:20px;">
      <v-container>
        {{other.nickname}}
        <v-row>
          <v-col cols="4">{{other.Followings.length}} 팔로잉</v-col>
          <v-col cols="4">{{other.Followers.length}} 팔로워</v-col>
          <v-col cols="4">{{other.Posts.length}} 게시글</v-col>
        </v-row>
      </v-container>
    </v-card>
    <div>
      <post-card v-for="p in mainPosts" :key="p.id" :post="p" />
    </div>
  </v-container>
</template>

<script>
  import PostCard from '~/components/PostCard';

  export default {
    components: {
      PostCard,
    },
    data() {
      return {
        name: 'Nuxt.js',
      }
    },
    computed : {
      other(){
        return this.$store.state.users.other;
      },
      mainPosts() {
        return this.$store.state.posts.mainPosts;
      },
      hasMorePost(){
        return this.$store.state.posts.hasMorePost;
      }
    },
    fetch({ store, params }){
      return Promise.all([
        // Promise.all => 구문 안에 있는 Promise문들이 완전히 수행되는 것을 보장
        store.dispatch('users/loadOther', {
          userId: params.id, //fetch에선 this를 못씀
        }),
        store.dispatch('posts/loadUserPosts', {
          userId: params.id,
          reset: true,
        })
      ])
    },
    mounted(){
      window.addEventListener('scroll', this.onScroll);
    },
    beforeDestroy(){
      window.removeEventListener('scroll', this.onScroll);
    },
    methods : {
      onScroll(){
        if(window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300){
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
