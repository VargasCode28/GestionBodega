import { ref } from "vue";
import { useRouter } from "vue-router";
import { login } from "@/services/authService";
import { useAuthStore } from "@/stores/auth.store";
import  type {AxiosError} from "axios";



export function useLogin() {
    const router = useRouter()
    const authStore = useAuthStore()



    const email = ref('')
    const password = ref('')
    const errorMessage = ref('')
    const isLoading = ref(false)




    const handleSubmit = async () => {
        errorMessage.value = ''


        if (!email.value || !password.value) {
            errorMessage.value = 'Todos los campos son obligatorios'
            return
        }



        isLoading.value = true



        try {
            await authStore.login(email.value, password.value)

            
            const {token, user} = await login(email.value, password.value)

            localStorage.setItem('token', token)
            localStorage.setItem('user', JSON.stringify(user))

            router.push(user.role ===  'ADMIN' ? '/admin': '/worker')

        }catch (err) {
            const axiosError = err as AxiosError<{message: string}>
            errorMessage.value =
            axiosError.response?.data?.message ?? 'Credenciales incorrectas'

        } finally {
            isLoading.value = false
        
    }
}


return {
    email,
    password,
    errorMessage,
    isLoading,
    handleSubmit
    }
}
