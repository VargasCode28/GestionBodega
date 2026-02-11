<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';





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






const borrows = ref<any[]>([])



const loadBorrows = async () => {
try {
    const res = await api.get('/borrow')
    borrows.value = res.data
} catch {
    error.value = 'Error al cargar préstamos'
}
}




const returnTool = async (id:string) => {
try {
    await api.put(`/borrow/return/${id}`)
    loadBorrows()

} catch {
    error.value = 'Error al devolver herramienta'
}
}







onMounted(() => {

loadBorrows()

setInterval(() => {
    loadBorrows()
}, 5000)
})






</script>



<template>


<div class="card border-0 shadow-sm rounded-4 mt-4">
<div class="card-header bg-white border-0 pt-4 px-4">
    <h5 class="fw-bold mb-0">
    <i class="bi bi-clipboard-check me-2"></i>
    Seguimiento de Herramientas
    </h5>
</div>

<div class="card-body px-4 pb-4">
    <div class="table-responsive">
    <table class="table table-hover align-middle custom-table">
        <thead>
        <tr>
            <th>Trabajador</th>
            <th>Herramienta</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th class="text-end">Acción</th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="b in borrows" :key="b._id">

            <td>{{ b.user?.name }}</td>

            <td>{{ b.tool?.name }}</td>

            <td>
            {{ new Date(b.borrowedAt).toLocaleDateString() }}
            </td>

            <td>
            <span
                :class="b.status === 'BORROWED'
                ? 'status-active'
                : 'status-blocked'"
            >
                {{ b.status }}
            </span>
            </td>

            <td class="text-end">

            <button
                v-if="b.status === 'BORROWED'"
                @click="returnTool(b._id)"
                class="btn btn-success btn-sm"
            >
                Marcar devolución
            </button>

            <span v-else class="text-muted small">
                Entregado
            </span>

            </td>

        </tr>
        </tbody>
    </table>
    </div>
</div>
</div>



</template>









<style scoped>

.admin-container {
  font-family: 'Inter', sans-serif;
  color: #2d3436;
}

.tracking-widest { letter-spacing: 0.15em; }
.x-small { font-size: 0.7rem; }

/* Table Styling */
.custom-table thead th {
  background-color: #f8f9fa;
  text-uppercase: uppercase;
  font-size: 0.75rem;
  font-weight: 700;
  color: #636e72; 
  border: none;
  padding: 1rem;
}

.custom-table tbody td {
  padding: 1.2rem 1rem;
  border-bottom: 1px solid #f1f2f6; 
}

/* Status Badges */
.status-active {
  background: #00c059b4;
  color: #ffffff;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
}

.status-blocked {
  background: #ec0000;
  color: #ffffff;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
}



/* Inputs & Buttons */
.custom-input {
  border: 1px solid #dfe6e9; 
  
  border-radius: 8px;
  padding: 0.6rem 1rem;
  background-color: #fdfdfd; 

}

.custom-input:focus {
  box-shadow: 0 0 0 3px rgba(255, 193, 7, 0.15);
  border-color: #ffc107;
}

.btn-icon {
  background: #dcdcdc; 
  border: none;
  border-radius: 8px;
  width: 36px;
  height: 36px;
  transition: all 0.2s;
}

.btn-icon:hover {
  background: #e9ecef;
  transform: translateY(-2px);
}

.sticky-form {
  position: sticky;
  top: 90px;
}

/* Animation */
.animate-fade-up {
  animation: fadeUp 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Responsivo */
@media (max-width: 1200px) {
  .sticky-form { position: static; }
}


</style>