<script setup lang="ts">

import { RouterView } from 'vue-router'
import { useInactivityTimeout } from '@/composables/useInactivityTimeout'

useInactivityTimeout()

</script>




<template>
<RouterView />
</template>



