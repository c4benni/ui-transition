<script setup lang="ts">
import { ref } from 'vue'

import UiTransition from './components/UiTransition/UiTransition.vue'

const show = ref(false);

</script>

<template>

    <div
      style='width:400px;height:400px'
    >
  <UiTransition>
    <div
            v-if="show"
            style="height:100%;width:100%;background:red"
    >
      
    </div>
  </UiTransition>
    </div>


  <button
    @click="show = !show"
  >
    toggle
  </button>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
