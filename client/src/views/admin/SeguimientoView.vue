<script setup lang="ts">
import { useSeguimiento} from '@/composables/useSeguimiento'
import { useExportSeguimiento} from '@/composables/useExportSeguimiento'

const { error , showHistory, filteredBorrows, returnTool} = useSeguimiento()
const { exportExcel, exportPDF} =useExportSeguimiento()

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
      <div v-if="error" class="alert alert-danger py-2">{{ error }}</div>

      <div class="d-flex justify-content-end mb-3">
        <button
          @click="showHistory = !showHistory"
          class="btn btn-sm btn-outline-dark"
        >
          {{ showHistory ? 'Ver solo activas' : 'Ver historial completo' }}
        </button>
      </div>

      <div class="d-flex justify-content-end mb-3 gap-2">
        <button @click="exportExcel(filteredBorrows)" class="btn btn-sm btn-outline-success">
          <i class="bi bi-file-earmark-excel me-1"></i> Excel
        </button>
        <button @click="exportPDF(filteredBorrows)" class="btn btn-sm btn-outline-danger">
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
              <td>{{ new Date(b.borrowedAt).toLocaleDateString() }}</td>
              <td>
                <span :class="b.status === 'BORROWED' ? 'status-active' : 'status-blocked'">
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
                <span v-else class="text-muted small">Entregado</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped src="/src/styles/Seguimiento.css"></style>
