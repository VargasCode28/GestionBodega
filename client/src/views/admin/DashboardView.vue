
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'


const workers = ref<any[]>([])
const selectedId = ref<string | null>(null)

const name = ref('')
const email = ref('')
const password = ref('')
const error = ref('')


const api = axios.create({
  baseURL: 'http://localhost:3000/api'
})



api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})




const loadWorkers = async () => {
  try {
    const res = await api.get('/users')
    workers.value = res.data
  } catch {
    error.value = 'Error al cargar trabajadores'
  }
}




const selectWorker = (w: any) => {
  selectedId.value = w._id
  name.value = w.name
  email.value = w.email
}





const createWorker = async () => {
  error.value = ''

  if (!name.value || !email.value || !password.value) {
    error.value = 'Todos los campos son obligatorios'
    return
  }

  try {
    await api.post('/users', {
      name: name.value,
      email: email.value,
      password: password.value
    })

    name.value = ''
    email.value = ''
    password.value = ''

    loadWorkers()
  } catch (err: any) {
    error.value =
      err.response?.data?.message ||
      'Error al crear trabajador'
  }
}


const toggleWorker = async (id: string) => {
  try {
    await api.put(`/users/${id}/toggle`)
    loadWorkers()
  } catch {
    error.value = 'Error al cambiar estado'
  }
}

onMounted(loadWorkers)














//EDIT
const updateWorker =  async () => {
  if (!selectedId.value) return

  try {
    await api.put(`/users/${selectedId.value}`, {
      name: name.value,
      email: email.value
    })

    clearForm()
    loadWorkers()
  }catch {
    error.value = 'Error al editar trabajador'
  }
}


//DELETE

const deleteWorker = async () => {
  if (!selectedId.value) return


  if (!confirm('¿Seguro que deseas eliminar?'))return


  try {
    await api.delete(`/users/${selectedId.value}`)


    clearForm()
    loadWorkers()
  }catch {
    error.value = 'Error al eliminar trabajador'
  }
}



const clearForm = () => {
  selectedId.value = null
  name.value = ''
  email.value = ''
  password.value = ''
  error.value = ''
}

onMounted(loadWorkers)


</script>

<template>
  <h1>Panel Administrador</h1>

  <section>
    <h3>{{ selectedId ? 'Editar trabajador' :'Crear trabajador'}}</h3>


    <input v-model="name" placeholder="Nombre" />
    <input v-model="email" placeholder="Correo" />
    <input 
    v-if="!selectedId"
    v-model="password" 
    type="password" 
    placeholder="Contraseña" 
    />

    <br/><br />

    <button v-if="!selectedId"    @click="createWorker">Crear</button>

    <button v-if="selectedId" @click="updateWorker">Guardar cambios</button>
    <button  v-if="selectedId"  @click="deleteWorker">Eliminar</button>

    <button  v-if="selectedId " @click="clearForm">Cancelar</button>
    
    
    <p v-if="error" style="color:red">{{ error }}</p>
  </section>

  <hr />


  <section>
    <h3>Trabajadores</h3>

    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Email</th>
          <th>Estado</th>
          <th>Acción</th>
        </tr>
      </thead>


      <tbody>
        <tr v-for="w in workers" :key="w._id">
          <td>{{ w.name }}</td>
          <td>{{ w.email }}</td>
          <td>{{ w.active ? 'Activo' : 'Bloqueado' }}</td>
          <td>
            <button @click="toggleWorker(w._id)">
              {{ w.active ? 'Desactivar' : 'Activar' }}
            </button>
          </td>

          <td>
            <button @click="selectWorker(w)">Editar</button>

            <button @click="toggleWorker(w._id)">
              {{ w.active ? 'Desactivar' : 'Activar' }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>
