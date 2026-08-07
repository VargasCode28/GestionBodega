<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';


import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const exportExcel = () => {
  const data = filteredBorrows.value.map(b => ({
    Trabajador: b.user?.name,
    Herramienta: b.tool?.name,
    Fecha: new Date(b.borrowedAt).toLocaleDateString(),
    Estado: b.status
  }))

  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Préstamos')
  XLSX.writeFile(wb, `seguimiento_herramientas_${Date.now()}.xlsx`)
}

const exportPDF = () => {
  const doc = new jsPDF()
  doc.setFontSize(14)
  doc.text('Seguimiento de Herramientas', 14, 15)

  const rows = filteredBorrows.value.map(b => [
    b.user?.name,
    b.tool?.name,
    new Date(b.borrowedAt).toLocaleDateString(),
    b.status
  ])

  autoTable(doc, {
    head: [['Trabajador', 'Herramienta', 'Fecha', 'Estado']],
    body: rows,
    startY: 22
  })

  doc.save(`seguimiento_herramientas_${Date.now()}.pdf`)
}



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







const showHistory = ref(false)


const filteredBorrows = computed(() => {
  return showHistory.value
    ? borrows.value
    : borrows.value.filter(b => b.status === 'BORROWED')
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







<div class="d-flex justify-content-end mb-3">
  <button 
    @click="showHistory = !showHistory"
    class="btn btn-sm btn-outline-dark"
  >
    {{ showHistory ? 'Ver solo activas' : 'Ver historial completo' }}
  </button>
</div>





<div class="d-flex justify-content-end mb-3 gap-2">
  <button @click="exportExcel" class="btn btn-sm btn-outline-success">
    <i class="bi bi-file-earmark-excel me-1"></i> Excel
  </button>
  <button @click="exportPDF" class="btn btn-sm btn-outline-danger">
    <i class="bi bi-file-earmark-pdf me-1"></i> PDF
  </button>

</div>













































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
          <tr v-for="b in filteredBorrows" :key="b._id">

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









<style scoped
src="/src/styles/Seguimiento.css"

>
</style>