<script setup lang="ts">
const props = defineProps<{ msg: string }>()
</script>

<template>
  <div>
    <h1>{{ props.msg }}</h1>
  </div>
</template>
