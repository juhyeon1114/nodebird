<template>
  <div>
    <v-container>
      <v-card style="margin-bottom: 20px">
        <v-container>
          <v-subheader>내 프로필</v-subheader>
          <v-form v-model="valid" @submit.prevent="onChangeNickname">
            <v-text-field
              label="닉네임"
              v-model="nickname"
              :rules="nicknameRules"
              required
            />
            <v-btn dark color="blue" type="submit">수정</v-btn>
          </v-form>
        </v-container>
      </v-card>

      <v-card style="margin-bottom: 20px">
        <v-container>
          <v-subheader>팔로잉</v-subheader>
          <follow-list :users="followingList" :remove="removeFollowing" />
          <v-btn @click="loadMoreFollowings" v-if="hasMoreFollowing" dark color="blue" style="width: 100%">더보기</v-btn>
        </v-container>
      </v-card>

      <v-card style="margin-bottom: 20px">
        <v-container>
          <v-subheader>팔로워</v-subheader>
          <follow-list :users="followerList" :remove="removeFollower" />
          <v-btn @click="loadMoreFollowers" v-if="hasMoreFollower" dark color="blue" style="width: 100%">더보기</v-btn>
        </v-container>
      </v-card>
    </v-container>
  </div>
</template>

<script>
  import FollowList from '~/components/FollowList';

  export default {
    components: {
      FollowList,
    },
    computed : {
      followerList(){
        return this.$store.state.users.followerList;
      },
      followingList(){
        return this.$store.state.users.followingList;
      },
      hasMoreFollowing(){
        return this.$store.state.users.hasMoreFollowing;
      },
      hasMoreFollower(){
        return this.$store.state.users.hasMoreFollower;
      },
    },
    data() {
      return {
        valid: false,
        name: 'Nuxt.js',
        nickname:'',
        nicknameRules: [
          v => !!v || '닉네임을 입력하세요',
        ],
      };
    },
    fetch({store}){
      return Promise.all([
        store.dispatch('users/loadFollowers', {offset: 0}),
        store.dispatch('users/loadFollowings', {offset: 0})
      ])
      
    },
    methods:{
      onChangeNickname(){
        this.$store.dispatch('users/changeNickname',{
          nickname: this.nickname,
        });
      },
      removeFollower(userId){
        this.$store.dispatch('users/removeFollower',{ userId });
      },
      removeFollowing(userId){
        this.$store.dispatch('users/unfollow',{ userId }); // 이름이 같으면 축약 가능
      },
      loadMoreFollowers(){
        this.$store.dispatch('users/loadFollowers');
      },
      loadMoreFollowings(){
        this.$store.dispatch('users/loadFollowings');
      },
    },
    head() {
      return {
        title: '프로필',
      };
    },
    middleware : 'authenticated',
  };
</script>

<style>

</style>
