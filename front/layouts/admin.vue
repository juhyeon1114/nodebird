<template>
    <div>
        <nav>
            <nuxt-link to="/">Home</nuxt-link> <!--router link와 같음-->
            <nuxt-link to="/profile">Profile</nuxt-link>
            <nuxt-link to="/signup">Signup</nuxt-link>
            <nuxt-link to="/admin">Admin</nuxt-link>
        </nav>
        <nuxt /> <!--router vue와 같음-->
    </div>
</template>

<script>
    export default {
        
    }
</script>

<style>

</style>