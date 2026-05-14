<script setup>
import { Plus, Minus, RefreshRight } from '@element-plus/icons-vue'
import { useTitle } from '@/composables/useTitle'
import { useCounterStore } from '@/stores/counter'

useTitle('About')

const counterStore = useCounterStore()
</script>

<template>
  <div class="about-view">
    <el-row :gutter="20">
      <el-col :span="24">
        <h1>About Page</h1>
        <p>这是一个使用 Vue Router 和 Pinia 的示例页面。</p>
      </el-col>
    </el-row>

    <el-alert
      title="提示"
      type="info"
      description="此页面展示 Pinia 全局状态管理的用法，计数器值在各页面间共享。"
      show-icon
      :closable="false"
      style="margin-top: 1rem"
    />

    <el-card class="store-demo" shadow="hover">
      <template #header>
        <h2>Pinia Store Demo (Global)</h2>
      </template>

      <el-descriptions :column="1" border>
        <el-descriptions-item label="Store Count">
          <el-tag size="large">{{ counterStore.count }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="Store Double">
          <el-tag type="success" size="large">{{ counterStore.doubleCount }}</el-tag>
        </el-descriptions-item>
      </el-descriptions>

      <el-space class="btn-group" wrap>
        <el-button type="primary" :icon="Plus" @click="counterStore.increment">+1</el-button>
        <el-button type="warning" :icon="Minus" @click="counterStore.decrement">-1</el-button>
        <el-button type="danger" :icon="RefreshRight" @click="counterStore.reset">Reset</el-button>
      </el-space>
    </el-card>
  </div>
</template>

<style scoped>
.about-view {
  width: 100%;
}

h1 {
  color: #42b883;
}

.store-demo {
  margin-top: 1.5rem;
}

.btn-group {
  margin-top: 1rem;
}
</style>
