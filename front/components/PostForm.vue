<template>
    <v-card style="margin-bottom: 20px">
        <v-form ref="form" v-model="valid" @submit.prevent="onSubmitForm">
            <v-textarea
                v-model="content"
                outlined
                auto-grow
                clearable
                :hide-details="hideDetails"
                :success-message="successMessages"
                :success="success"
                :rules="[v => !!v.trim() || '내용을 입력하세요']"
                label="어떤 신기한 일이 있었나요?"
                @input="onChangeTextarea"
            />
            <v-btn type="submit" color="green" absolute right>입력</v-btn>
            <input ref="imageInput" type="file" multiple hidden @change="onChangeImages">
            <v-btn type="button" @click="onClickImageUpload">이미지 업로드</v-btn>
            <div>
                <div v-for="p in imagePaths" :key="p" style="display : inline-block">
                    <img :src="`http://loacalhost:3085/${p}`" :alt="p" style="width : 200px">
                    <div>
                        <button @click="onRemoveImage(i)" type="button">제거</button>
                    </div>
                </div>
            </div>
        </v-form>
    </v-card>
</template>

<script>
    import {mapState} from 'vuex';

    export default {
        data(){
            return {
                valid: false,
                hideDetails: true,
                successMessages: '',
                success: false,
                content: '',
            }
        },
        computed: {
            ...mapState('users', ['me']),
            ...mapState('posts', ['imagePaths']),
        }, 
        methods: {
            onChangeTextarea(value){
                if(value.length){
                    this.hideDetails = true;
                    this.success = false;
                    this.successMessages = "";
                }
            },
            onSubmitForm(){
                if( this.$refs.form.validate() ){
                    this.$store.dispatch('posts/add',{
                        content: this.content,
                    })
                    .then(()=>{
                        this.content = '';
                        this.hideDetails = false;
                        this.success = true;
                        this.successMessages = "게시글 등록 성공!";
                    })
                    .catch(()=>{
                        
                    });
                }
            },
            onClickImageUpload(){
                this.$refs.imageInput.click();
            },  
            onChangeImages(e){
                // image는 주로 form data 형식으로 전송함
                console.log(e.target.files);
                const imageFormData = new FormData();
                // e.target.files (파일의 목록)은 배열이 아닌 객체이므로 아래와 같이 강제적으로 foreach문을 실행시킨다
                [].forEach.call(e.target.files, (f) => {
                    imageFormData.append('image',f); // key 값이 'image' 인 객체로 만듬
                });
                // -> { image : [file1, file2] }
                this.$store.dispatch('posts/uploadImages', imageFormData);
            },
            onRemoveImage(index){
                this.$store.commit('posts/removeImagePath', index);
            }
        }
    }
</script>

<style>

</style>