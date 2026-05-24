<script setup>
import {onMounted, reactive, ref, nextTick} from 'vue'
import {createRole, deleteRole, getRolePermissions, listRoles, updateRole} from '@/api/role'
import {assignPermissions, getPermissionTree, removePermissions} from '@/api/permission'
import {ElMessage, ElMessageBox} from 'element-plus'

// ==================== 列表相关 ====================
const tableData = ref([])
const loading = ref(false)

async function fetchData() {
  loading.value = true
  try {
    const res = await listRoles()
    tableData.value = res.data || []
  } catch (err) {
    ElMessage.error(err?.message || '获取角色列表失败')
  } finally {
    loading.value = false
  }
}

// ==================== 新增/编辑弹窗 ====================
const dialogVisible = ref(false)
const dialogTitle = ref('新增角色')
const isEdit = ref(false)
const submitLoading = ref(false)
const formRef = ref(null)
const currentId = ref(null)

const form = reactive({
  roleCode: '',
  roleName: '',
  description: '',
})

const rules = {
  roleCode: [
    {required: true, message: '请输入角色编码', trigger: 'blur'},
    {pattern: /^[A-Z][A-Z0-9_]{1,29}$/, message: '大写字母开头，只能包含大写字母/数字/下划线，2-30位', trigger: 'blur'},
  ],
  roleName: [{required: true, message: '请输入角色名称', trigger: 'blur'}],
}

function handleAdd() {
  isEdit.value = false
  dialogTitle.value = '新增角色'
  currentId.value = null
  Object.assign(form, {roleCode: '', roleName: '', description: ''})
  formRef.value?.resetFields()
  dialogVisible.value = true
}

function handleEdit(row) {
  isEdit.value = true
  dialogTitle.value = '编辑角色'
  currentId.value = row.id
  Object.assign(form, {
    roleCode: row.roleCode,
    roleName: row.roleName,
    description: row.description || '',
  })
  formRef.value?.resetFields()
  dialogVisible.value = true
}

async function handleSubmit(formEl) {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (!valid) return
    submitLoading.value = true
    try {
      const data = {
        roleName: form.roleName.trim(),
        description: form.description.trim() || undefined,
      }
      if (!isEdit.value) {
        data.roleCode = form.roleCode.trim()
        await createRole(data)
      } else {
        await updateRole(currentId.value, data)
      }
      ElMessage.success(isEdit.value ? '编辑成功' : '新增成功')
      dialogVisible.value = false
      fetchData()
    } catch (err) {
      ElMessage.error(err?.message || '操作失败')
    } finally {
      submitLoading.value = false
    }
  })
}

// ==================== 删除 ====================
function handleDelete(row) {
  ElMessageBox.confirm(`确定要删除角色「${row.roleName}」吗？`, '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      await deleteRole(row.id)
      ElMessage.success('删除成功')
      fetchData()
    } catch (err) {
      ElMessage.error(err?.message || '删除失败')
    }
  }).catch(() => {
  })
}

// ==================== 分配权限弹窗 ====================
const permDialogVisible = ref(false)
const permSubmitLoading = ref(false)
const currentRoleId = ref(null)
const currentRoleName = ref('')
const permissionTree = ref([])
const checkedPermissionIds = ref([])
const permTreeRef = ref(null)

async function handleAssignPermission(row) {
  currentRoleId.value = row.id
  currentRoleName.value = row.roleName
  // 获取权限树
  try {
    const treeRes = await getPermissionTree()
    permissionTree.value = treeRes.data || []
  } catch {
    permissionTree.value = []
  }
  // 获取角色已有权限
  try {
    const permRes = await getRolePermissions(row.id)
    const permList = permRes.data || []
    // 只取顶层节点 ID，不递归展开 children，避免父级权限被扩散为全部子权限
    checkedPermissionIds.value = permList.map((node) => node.id)
  } catch {
    checkedPermissionIds.value = []
  }
  // 先打开弹窗让 tree 挂载，再通过 nextTick + setCheckedKeys 精准设置选中
  permDialogVisible.value = true
  await nextTick()
  if (checkedPermissionIds.value.length > 0) {
    permTreeRef.value?.setCheckedKeys(checkedPermissionIds.value)
  }
}

/**
 * 递归收集树中所有节点 ID（含父节点和叶子节点）
 * @deprecated 已改用顶层 ID 映射，避免扩散选中
 */
function collectLeafIds(nodes) {
  const ids = []

  function walk(list) {
    list.forEach((node) => {
      if (node.children && node.children.length > 0) {
        walk(node.children)
      } else {
        ids.push(node.id)
      }
    })
  }

  walk(nodes)
  return ids
}

async function handlePermSubmit() {
  permSubmitLoading.value = true
  try {
    // 从 tree 实例直接获取当前选中节点 key，避免 @check 事件干扰 default-checked-keys
    const checkedKeys = permTreeRef.value?.getCheckedKeys() || []
    await (checkedKeys.length === 0 ? removePermissions({
      roleId: currentRoleId.value
    }) : assignPermissions({
      roleId: currentRoleId.value,
      permissionIds: checkedKeys,
    }))
    ElMessage.success('权限分配成功')
    permDialogVisible.value = false
  } catch (err) {
    ElMessage.error(err?.message || '权限分配失败')
  } finally {
    permSubmitLoading.value = false
  }
}

// ==================== 初始化 ====================
onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="manage-view">
    <el-card class="table-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>角色列表</span>
          <el-button type="primary" @click="handleAdd">新增角色</el-button>
        </div>
      </template>

      <el-table v-loading="loading" :data="tableData" border stripe style="width: 100%">
        <el-table-column label="ID" prop="id" width="80"/>
        <el-table-column label="角色编码" min-width="140" prop="roleCode"/>
        <el-table-column label="角色名称" min-width="140" prop="roleName"/>
        <el-table-column label="描述" min-width="200" prop="description" show-overflow-tooltip/>
        <el-table-column align="center" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'" size="small">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="180">
          <template #default="{ row }">
            {{ row.createTime || row.createdAt }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="220">
          <template #default="{ row }">
            <el-button link size="small" type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button link size="small" type="warning" @click="handleAssignPermission(row)">分配权限</el-button>
            <el-button link size="small" type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :close-on-click-modal="false" :title="dialogTitle" width="500px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="角色编码" prop="roleCode">
          <el-input v-model="form.roleCode" :disabled="isEdit" placeholder="请输入角色编码"/>
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" placeholder="请输入角色名称"/>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" :rows="3" placeholder="请输入角色描述" type="textarea"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button :loading="submitLoading" type="primary" @click="handleSubmit(formRef)">
          确定
        </el-button>
      </template>
    </el-dialog>

    <!-- 分配权限弹窗 -->
    <el-dialog v-model="permDialogVisible" :close-on-click-modal="false" title="分配权限" width="500px">
      <el-form label-width="80px">
        <el-form-item label="角色">
          <el-tag type="primary">{{ currentRoleName }}</el-tag>
        </el-form-item>
        <el-form-item label="权限选择">
          <el-tree
            v-if="permDialogVisible"
            ref="permTreeRef"
            :data="permissionTree"
            :default-expand-all="true"
            :props="{ label: 'permissionName', children: 'children' }"
            check-strictly
            node-key="id"
            show-checkbox
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="permDialogVisible = false">取消</el-button>
        <el-button :loading="permSubmitLoading" type="primary" @click="handlePermSubmit">
          保存
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.manage-view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.table-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

.table-card :deep(.el-card__body) {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.table-card :deep(.el-table) {
  flex: 1;
  min-height: 0;
}

.table-card :deep(.el-table__inner-wrapper) {
  overflow: auto;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
