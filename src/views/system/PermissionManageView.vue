<script setup>
import { ref, reactive, onMounted } from 'vue'
import {
  getPermissionTree,
  createPermission,
  updatePermission,
  deletePermission,
} from '@/api/permission'
import { ElMessage, ElMessageBox } from 'element-plus'

// ==================== 列表相关 ====================
const tableData = ref([])
const loading = ref(false)
const treeProps = {
  children: 'children',
  hasChildren: 'hasChildren',
}

async function fetchData() {
  loading.value = true
  try {
    const res = await getPermissionTree()
    tableData.value = res.data || []
  } catch (err) {
    ElMessage.error(err?.message || '获取权限列表失败')
  } finally {
    loading.value = false
  }
}

// ==================== 新增/编辑弹窗 ====================
const dialogVisible = ref(false)
const dialogTitle = ref('新增权限')
const isEdit = ref(false)
const submitLoading = ref(false)
const formRef = ref(null)
const currentId = ref(null)

const form = reactive({
  permissionCode: '',
  permissionName: '',
  permissionType: 'MENU',
  parentId: null,
  sortOrder: 0,
  path: '',
  icon: '',
  description: '',
})

const rules = {
  permissionCode: [
    { required: true, message: '请输入权限编码', trigger: 'blur' },
    { pattern: /^[A-Z][A-Z0-9_]{1,49}$/, message: '大写字母开头，只能包含大写字母/数字/下划线，2-50位', trigger: 'blur' },
  ],
  permissionName: [{ required: true, message: '请输入权限名称', trigger: 'blur' }],
  permissionType: [{ required: true, message: '请选择权限类型', trigger: 'change' }],
}

// 父级权限下拉选项（过滤掉按钮级别，因为按钮不能作为父节点）
const parentOptions = ref([])

function buildParentOptions(tree) {
  const options = [{ id: null, permissionName: '无（顶级）' }]
  function walk(list, depth = 0) {
    list.forEach((node) => {
      if (node.permissionType !== 'BUTTON') {
        options.push({
          id: node.id,
          permissionName: '—'.repeat(depth) + ' ' + node.permissionName,
        })
      }
      if (node.children && node.children.length > 0) {
        walk(node.children, depth + 1)
      }
    })
  }
  walk(tree)
  return options
}

function handleAdd() {
  isEdit.value = false
  dialogTitle.value = '新增权限'
  currentId.value = null
  Object.assign(form, {
    permissionCode: '',
    permissionName: '',
    permissionType: 'MENU',
    parentId: null,
    sortOrder: 0,
    path: '',
    icon: '',
    description: '',
  })
  formRef.value?.resetFields()
  parentOptions.value = buildParentOptions(tableData.value)
  dialogVisible.value = true
}

function handleEdit(row) {
  isEdit.value = true
  dialogTitle.value = '编辑权限'
  currentId.value = row.id
  Object.assign(form, {
    permissionCode: row.permissionCode,
    permissionName: row.permissionName,
    permissionType: row.permissionType,
    parentId: row.parentId ?? null,
    sortOrder: row.sortOrder ?? 0,
    path: row.path || '',
    icon: row.icon || '',
    description: row.description || '',
  })
  formRef.value?.resetFields()
  parentOptions.value = buildParentOptions(tableData.value)
  dialogVisible.value = true
}

async function handleSubmit(formEl) {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (!valid) return
    submitLoading.value = true
    try {
      const data = {
        permissionName: form.permissionName.trim(),
        permissionType: form.permissionType,
        parentId: form.parentId || undefined,
        sortOrder: form.sortOrder,
        path: form.path.trim() || undefined,
        icon: form.icon.trim() || undefined,
        description: form.description.trim() || undefined,
      }
      if (!isEdit.value) {
        data.permissionCode = form.permissionCode.trim()
        await createPermission(data)
      } else {
        await updatePermission(currentId.value, data)
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
  ElMessageBox.confirm(
    `确定要删除权限「${row.permissionName}」吗？若有子权限将一并删除。`,
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    },
  ).then(async () => {
    try {
      await deletePermission(row.id)
      ElMessage.success('删除成功')
      fetchData()
    } catch (err) {
      ElMessage.error(err?.message || '删除失败')
    }
  }).catch(() => {})
}

// ==================== 权限类型标签映射 ====================
const typeTagMap = {
  MENU: { type: 'primary', label: '菜单' },
  BUTTON: { type: 'warning', label: '按钮' },
  API: { type: 'success', label: '接口' },
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
          <span>权限列表</span>
          <el-button type="primary" @click="handleAdd">新增权限</el-button>
        </div>
      </template>

      <el-table
        :data="tableData"
        v-loading="loading"
        row-key="id"
        border
        stripe
        style="width: 100%"
        :tree-props="treeProps"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="permissionName" label="权限名称" min-width="180" />
        <el-table-column prop="permissionCode" label="权限编码" min-width="160" />
        <el-table-column label="类型" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="typeTagMap[row.permissionType]?.type || 'info'" size="small">
              {{ typeTagMap[row.permissionType]?.label || row.permissionType }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="path" label="路由路径" min-width="140" />
        <el-table-column prop="icon" label="图标" width="80" />
        <el-table-column prop="sortOrder" label="排序" width="70" align="center" />
        <el-table-column label="状态" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'" size="small">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="560px" :close-on-click-modal="false">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="权限编码" prop="permissionCode">
          <el-input v-model="form.permissionCode" placeholder="请输入权限编码" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="权限名称" prop="permissionName">
          <el-input v-model="form.permissionName" placeholder="请输入权限名称" />
        </el-form-item>
        <el-form-item label="权限类型" prop="permissionType">
          <el-select v-model="form.permissionType" placeholder="请选择权限类型" style="width: 100%">
            <el-option label="菜单" value="MENU" />
            <el-option label="按钮" value="BUTTON" />
            <el-option label="接口" value="API" />
          </el-select>
        </el-form-item>
        <el-form-item label="上级权限">
          <el-select v-model="form.parentId" placeholder="请选择上级权限" style="width: 100%">
            <el-option
              v-for="opt in parentOptions"
              :key="opt.id"
              :label="opt.permissionName"
              :value="opt.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="路由路径">
          <el-input v-model="form.path" placeholder="请输入前端路由路径" />
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="form.icon" placeholder="请输入图标名称" />
        </el-form-item>
        <el-form-item label="排序号">
          <el-input-number v-model="form.sortOrder" :min="0" :max="9999" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" type="textarea" :rows="2" placeholder="请输入权限描述" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit(formRef)">
          确定
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
