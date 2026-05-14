<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <el-container class="auth-layout">
    <el-main class="auth-main">
      <div class="auth-card-wrapper">
        <RouterView />
      </div>
    </el-main>
  </el-container>
</template>

<style scoped>
.auth-layout {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.auth-main {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}

.auth-card-wrapper {
  width: 100%;
  max-width: 420px;
}
</style>
