<script setup>
import { computed } from 'vue'
import { useRoute, useRouter, RouterView } from 'vue-router'
import { HomeFilled, Setting, SwitchButton } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const activeMenu = computed(() => route.path)

const allMenuItems = [
  { index: '/', title: '首页', icon: HomeFilled },
  { index: '/system', title: '系统管理', icon: Setting, permission: 'SYSTEM' },
]

/**
 * 根据用户权限过滤可见菜单项
 * 未定义 permission 的项始终可见（如纯展示项）
 */
const menuItems = computed(() =>
  allMenuItems.filter((item) => !item.permission || authStore.hasPermission(item.permission)),
)

/**
 * 退出登录
 */
async function handleLogout() {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
  } catch {
    // 用户取消操作
    return
  }
  await authStore.logout()
  router.push('/login')
}
</script>

<template>
  <el-container class="default-layout">
    <el-header class="layout-header" height="auto">
      <div class="header-container">
        <el-menu
          :default-active="activeMenu"
          mode="horizontal"
          :ellipsis="false"
          router
          class="nav-menu"
        >
          <div class="nav-brand">Vue Web</div>
          <el-menu-item
            v-for="item in menuItems"
            :key="item.index"
            :index="item.index"
          >
            <el-icon><component :is="item.icon" /></el-icon>
            <span>{{ item.title }}</span>
          </el-menu-item>
        </el-menu>
        <div class="header-actions">
          <span class="user-info" v-if="authStore.nickname">{{ authStore.nickname }}</span>
          <el-button type="danger" :icon="SwitchButton" @click="handleLogout" link>退出登录</el-button>
        </div>
      </div>
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
  height: 100%;
}

.layout-header {
  padding: 0;
}

.header-container {
  display: flex;
  align-items: center;
  padding: 0 2rem;
  background-color: #fff;
  border-bottom: 1px solid var(--el-menu-border-color);
}

.nav-menu {
  display: flex;
  flex: 1;
  border-bottom: none !important;
}

.nav-brand {
  display: flex;
  align-items: center;
  font-size: 1.2rem;
  font-weight: bold;
  color: #409eff;
  padding: 0 1rem;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
  background-color: #fff;
}

.user-info {
  font-size: 0.9rem;
  color: #606266;
}

.layout-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1.5rem 2rem;
  overflow: hidden;
}

.layout-footer {
  text-align: center;
  padding: 0 2rem 1rem;
  color: #909399;
  font-size: 0.875rem;
}
</style>
