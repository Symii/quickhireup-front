<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'

const data = ref(null)

onMounted(async () => {
  try {
    const response = await axios.get('https://localhost:5001/api/example')
    data.value = response.data
  } catch (err) {
    console.error(err)
  }
})
</script>

<template>
  <div>
    <h1>API Data:</h1>
    <pre>{{ data }}</pre>
  </div>
</template>
