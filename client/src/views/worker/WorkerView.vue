<script setup lang="ts">
import { tools, borrowTool, error, loadTools } from '@/composables/useTools'
import { onMounted } from 'vue';

onMounted(() => {
  loadTools()
})

</script>

<template>
  <div class="container py-4">
    <div v-if="error" class="alert alert-danger border-0 shadow-sm d-flex align-items-center rounded-4" role="alert">
      <i class="bi bi-exclamation-octagon-fill fs-4 me-3"></i>
      <div>
        <strong class="d-block">Error de sistema</strong>
        <span class="small">{{ error }}</span>
      </div>
    </div>

    <div class="row g-4 mt-2">
      <div v-for="(tool, index) in tools" :key="tool._id" class="col-12 col-md-6 col-xl-4">
        <div class="card tool-card h-100" :style="{ animationDelay: `${index * 0.1}s` }">
          <div class="card-body p-4">
            <div class="d-flex justify-content-between align-items-start mb-4">
              <div class="icon-container shadow-sm">
                <i class="bi bi-tools fs-4 text-dark"></i>
              </div>
              <span class="badge rounded-pill bg-light text-dark border fw-normal px-3">Activo</span>
            </div>
            <h5 class="fw-bold mb-2">{{ tool.name }}</h5>
            <p class="text-muted small line-clamp">{{ tool.description }}</p>
            <div class="mt-4 d-grid">
              <button @click="borrowTool(tool._id)">Pedir Herramienta</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>