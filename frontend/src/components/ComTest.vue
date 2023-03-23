<template>
    <button @click="getTest">get 테스트</button>
    <br>
    {{ get_result }}
    <br>
    <hr>
    <button @click="postTest">post 테스트</button>
    <br>
    <input v-model="user_name" placeholder="이름을 입력하세요.">
    <br>
    {{ post_result }}
</template>

<script>
import axios from 'axios'

export default {
    name: 'App',    
    data: () => ({
        get_result: null,
        post_result: null,
        user_name: null
    }),
    methods: {
        getTest() {
            const instance = this;
            let urlGet = '/api/getTest';
            axios.get(urlGet, {
            })
            .then(function (response) {
                instance.get_result = response.data.result;
            })
            .catch(function (error) {
                alert(error);
            });
        },
        postTest() {
            const instance = this;
            let urlPost = '/api/postTest';
            axios.post(urlPost, {
                name: instance.user_name
            }).then(function (response) {
                console.log(response)
                instance.post_result = response.data.result
            })
            .catch(function (error) {
                alert(error);
            });
        }
    }
}
</script>
  
<style>
</style>

