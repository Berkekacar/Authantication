// import {axiosInstance} from "../utils/axios"
// import {useAuthStore} from "../stores/auth"
// import { watchEffect } from "vue"

// export default function useApi(){
//     const authStore = useAuthStore()
//     watchEffect(()=>{
        
//         axiosInstance.interceptors.request.use(
//             (config)=>{
//                 if(!config.headers['Authorization']){
//                     config.headers['Authorization']=`Bearer ${authStore.accesToken}` 
//                 }
//                 return config
//             },
//             (error)=>Promise.reject(error)
//         )

//         axiosInstance.interceptors.response.use(
//             response=>response,
//             async (error)=>{
//                 const prevRequest=error?.config

//                 if((error?.response?.status ===403 || error?.response?.status ===401) && !prevRequest.sent){
//                     prevRequest.sent=true
//                     await authStore.refresh()
//                     prevRequest.headers['Authorization']=authStore.accesToken
//                     return axiosInstance(prevRequest)
//                 }

//                 return Promise.reject(error)
//             }
//         )
//     })


//     return axiosInstance
// }