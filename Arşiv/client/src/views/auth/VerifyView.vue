<template>
    <div id="login">
        <div class="container">
            <div class="card card-body mt-4">
            <h5 class="card-title">Verify Code</h5>
                <form @submit.prevent="submit" >
                <div class="mb-3">
                <label  class="form-label">Email address</label>
                <input v-model="code" type="text" class="form-control" id="code" autocomplete="off">
                </div>          
            <button type="submit" class="btn btn-success">Login</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore, type LoginData } from '../../stores/auth';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const authStore = useAuthStore()
const router = useRouter()

const loginData = reactive<LoginData>({
  email: "",
  password: "",
})

const errorMessage = ref<string>("")

async function submit(){
  router.replace({name: "user"})
   
}

</script>
