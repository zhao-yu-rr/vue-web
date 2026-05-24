<script setup>
import { ref, defineAsyncComponent } from 'vue'

const activeTab = ref('users')

const UserManageView = defineAsyncComponent(() => import('./UserManageView.vue'))
const RoleManageView = defineAsyncComponent(() => import('./RoleManageView.vue'))
const PermissionManageView = defineAsyncComponent(() => import('./PermissionManageView.vue'))
</script>

<template>
  <div class="system-manage-view">
    <el-tabs v-model="activeTab" type="border-card">
      <el-tab-pane label="用户管理" name="users">
        <KeepAlive>
          <UserManageView v-if="activeTab === 'users'" />
        </KeepAlive>
      </el-tab-pane>
      <el-tab-pane label="角色管理" name="roles">
        <KeepAlive>
          <RoleManageView v-if="activeTab === 'roles'" />
        </KeepAlive>
      </el-tab-pane>
      <el-tab-pane label="权限管理" name="permissions">
        <KeepAlive>
          <PermissionManageView v-if="activeTab === 'permissions'" />
        </KeepAlive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped>
.system-manage-view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* tabs 容器填充剩余空间 */
.system-manage-view :deep(.el-tabs) {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* tabs 内容区域可滚动 */
.system-manage-view :deep(.el-tabs__content) {
  flex: 1;
  overflow: auto;
}

/* 每个 tab-pane 撑满高度 */
.system-manage-view :deep(.el-tab-pane) {
  height: 100%;
}
</style>
