<template>
    <div id="register">
        <div class="container">
            <div v-if='user' class="card card-body mt-4">
                <h5 class="card-title">Username:{{user.username}}</h5>
                <h6 class="card-subtitle mb-2 text-muted">Email:{{user.email}}</h6>
            </div>
        </div>
    </div>
</template>

<script async setup lang="ts">
import { useAuthStore} from '../../stores/auth';
import { computed,onMounted } from 'vue';

const authStore = useAuthStore()

const user =computed(()=>{
    return authStore.userDetail
})

async function getUser(){
    await authStore.getUser()
}

onMounted(async()=>{
    await getUser()
})



</script>

<style scoped>
#user .card{
    max-width:10000vw;
    margin:auto;
}
</style>