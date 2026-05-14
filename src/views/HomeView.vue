<script setup>
import { Plus, Minus, RefreshRight } from '@element-plus/icons-vue'
import { useTitle } from '@/composables/useTitle'
import { useCounter } from '@/composables/useCounter'

useTitle('Home')

const { count, doubleCount, increment, decrement, reset } = useCounter(0)
</script>

<template>
  <div class="home-view">
    <el-row :gutter="20">
      <el-col :span="24">
        <h1>Home Page</h1>
        <p>欢迎来到 Vue Web 应用!</p>
      </el-col>
    </el-row>

    <el-card class="counter-demo" shadow="hover">
      <template #header>
        <h2>Counter Demo (Local)</h2>
      </template>

      <el-descriptions :column="1" border>
        <el-descriptions-item label="Count">
          <el-tag size="large">{{ count }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="Double">
          <el-tag type="success" size="large">{{ doubleCount }}</el-tag>
        </el-descriptions-item>
      </el-descriptions>

      <el-space class="btn-group" wrap>
        <el-button type="primary" :icon="Plus" @click="increment">+1</el-button>
        <el-button type="warning" :icon="Minus" @click="decrement">-1</el-button>
        <el-button type="danger" :icon="RefreshRight" @click="reset">Reset</el-button>
      </el-space>
    </el-card>
  </div>
</template>

<style scoped>
.home-view {
  width: 100%;
}

h1 {
  color: #42b883;
}

.counter-demo {
  margin-top: 1.5rem;
}

.btn-group {
  margin-top: 1rem;
}
</style>
