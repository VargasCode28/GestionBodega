<script setup lang="ts">

import { ref, onMounted} from 'vue'
import axios from 'axios';



const workers = ref<any[]>([])
const name = ref('')
const email = ref('')
const password = ref('')
const error = ref('')


const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
})


const loadWorkers = async () => {
    const res = await api.get('/users')
    workers.value = res.data
}



const createWorker = async () => {
    try{
        await api.post('/users', {
            name: name.value,
            email: email.value,
            password: password.value
        })

        name.value = email.value = password.value = ''
        loadWorkers()
    } catch {
        error.value = 'Error al crear trabajador'
    }
}


const toggleWorker = async (id: string) => {

    await api.put(`/users/${id}/toggle`)
    loadWorkers()
}

onMounted(loadWorkers)



</script>



<template>
    <h1>Panel Administrador</h1>


    <section>
        <h3>Crear trabajador</h3>
        <input v-model="name" placeholder="Nombre" />
        <input v-model="email" placeholder="Correo" />
        <input v-model="password" placeholder="Contraseña"/>
        
        <button @click="createWorker">Crear</button>
        <P v-if="error">{{ error }}</P>
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
    </tr>
  </tbody>
</table>


    </section>


</template>