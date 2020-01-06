<template>
    <v-container v-if="post">
        <post-card :post="post" />
    </v-container>
    <div v-else>
        게시글이 존재하지 않습니다.
    </div>
</template>

<script>
    import PostCard from '~/components/PostCard';
    
    export default {
        components:{
            PostCard,
        },
        computed: {
            post(){
                return this.$store.state.posts.mainPosts.find(v => v.id === parseInt(this.$route.params.id, 10));
                // this.$route.params.id 가 선택된 id를 가리킨다
                // *** 동적 라우트 매칭
            }
        },
    }
</script>

<style>

</style>