<script setup>
import { computed } from 'vue'
import { useRoute, RouterView } from 'vue-router'
import { HomeFilled, InfoFilled } from '@element-plus/icons-vue'

const route = useRoute()

const activeMenu = computed(() => route.path)

const menuItems = [
  { index: '/', title: 'Home', icon: HomeFilled },
  { index: '/about', title: 'About', icon: InfoFilled },
]
</script>

<template>
  <el-container class="default-layout">
    <el-header class="layout-header" height="auto">
      <el-menu
        :default-active="activeMenu"
        mode="horizontal"
        :ellipsis="false"
        router
        class="nav-menu"
      >
        <div class="nav-brand">Vue Web</div>
        <div class="nav-spacer" />
        <el-menu-item
          v-for="item in menuItems"
          :key="item.index"
          :index="item.index"
        >
          <el-icon><component :is="item.icon" /></el-icon>
          <span>{{ item.title }}</span>
        </el-menu-item>
      </el-menu>
    </el-header>

    <el-main class="layout-main">
      <RouterView />
    </el-main>

    <el-footer class="layout-footer" height="auto">
      <el-divider />
      <p>&copy; {{ new Date().getFullYear() }} Vue Web App. Powered by Element Plus.</p>
    </el-footer>
  </el-container>
</template>

<style scoped>
.default-layout {
  min-height: 100vh;
}

.layout-header {
  padding: 0;
}

.nav-menu {
  display: flex;
  padding: 0 2rem;
}

.nav-brand {
  display: flex;
  align-items: center;
  font-size: 1.2rem;
  font-weight: bold;
  color: #409eff;
  padding: 0 1rem;
}

.nav-spacer {
  flex: 1;
}

.layout-main {
  flex: 1;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  padding: 1.5rem 2rem;
}

.layout-footer {
  text-align: center;
  padding: 0 2rem 1rem;
  color: #909399;
  font-size: 0.875rem;
}
</style>
