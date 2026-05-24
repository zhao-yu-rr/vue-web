<script setup>
import { ref, reactive, onMounted } from 'vue'
import { listUsers, createUser, updateUser, deleteUser } from '@/api/user'
import { listRoles, getUserRoles, assignRoles } from '@/api/role'
import { ElMessage, ElMessageBox } from 'element-plus'

// ==================== 列表相关 ====================
const tableData = ref([])
const total = ref(0)
const loading = ref(false)

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  username: '',
  nickname: '',
  status: null,
})

async function fetchData() {
  loading.value = true
  try {
    const params = { ...queryParams }
    // 移除空值
    Object.keys(params).forEach((key) => {
      if (params[key] === '' || params[key] === null) delete params[key]
    })
    const res = await listUsers(params)
    tableData.value = res.data?.records || res.data?.list || []
    total.value = res.data?.total || 0
  } catch (err) {
    ElMessage.error(err?.message || '获取用户列表失败')
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  queryParams.pageNum = 1
  fetchData()
}

function handleReset() {
  queryParams.username = ''
  queryParams.nickname = ''
  queryParams.status = null
  queryParams.pageNum = 1
  fetchData()
}

function handlePageChange(page) {
  queryParams.pageNum = page
  fetchData()
}

function handleSizeChange(size) {
  queryParams.pageSize = size
  queryParams.pageNum = 1
  fetchData()
}

// ==================== 新增/编辑弹窗 ====================
const dialogVisible = ref(false)
const dialogTitle = ref('新增用户')
const isEdit = ref(false)
const submitLoading = ref(false)
const formRef = ref(null)
const currentId = ref(null)

const form = reactive({
  username: '',
  password: '',
  nickname: '',
  email: '',
  phone: '',
  roleIds: [],
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]{3,20}$/, message: '3-20位，字母/数字/下划线', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度6-20位', trigger: 'blur' },
  ],
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
}

function handleAdd() {
  isEdit.value = false
  dialogTitle.value = '新增用户'
  currentId.value = null
  Object.assign(form, { username: '', password: '', nickname: '', email: '', phone: '', roleIds: [] })
  formRef.value?.resetFields()
  dialogVisible.value = true
}

function handleEdit(row) {
  isEdit.value = true
  dialogTitle.value = '编辑用户'
  currentId.value = row.id
  Object.assign(form, {
    username: row.username,
    password: '',
    nickname: row.nickname,
    email: row.email || '',
    phone: row.phone || '',
    roleIds: [],
  })
  formRef.value?.resetFields()
  dialogVisible.value = true
  // 获取用户已有角色
  fetchUserRoles(row.id)
}

async function fetchUserRoles(userId) {
  try {
    const res = await getUserRoles(userId)
    form.roleIds = (res.data || []).map((r) => r.id)
  } catch {
    form.roleIds = []
  }
}

async function handleSubmit(formEl) {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (!valid) return
    submitLoading.value = true
    try {
      const data = {
        username: form.username.trim(),
        nickname: form.nickname.trim(),
        email: form.email.trim() || undefined,
        phone: form.phone.trim() || undefined,
        roleIds: form.roleIds,
      }
      if (!isEdit.value) {
        data.password = form.password
        await createUser(data)
      } else {
        await updateUser(currentId.value, data)
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
  ElMessageBox.confirm(`确定要删除用户「${row.username}」吗？`, '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      await deleteUser(row.id)
      ElMessage.success('删除成功')
      fetchData()
    } catch (err) {
      ElMessage.error(err?.message || '删除失败')
    }
  }).catch(() => {})
}

// ==================== 角色列表（供选择器使用） ====================
const allRoles = ref([])
async function fetchAllRoles() {
  try {
    const res = await listRoles()
    allRoles.value = res.data || []
  } catch {
    allRoles.value = []
  }
}

// ==================== 初始化 ====================
onMounted(() => {
  fetchData()
  fetchAllRoles()
})
</script>

<template>
  <div class="manage-view">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="queryParams" class="search-form">
        <el-form-item label="用户名">
          <el-input v-model="queryParams.username" placeholder="请输入用户名" clearable />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="queryParams.nickname" placeholder="请输入昵称" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" placeholder="请选择" clearable style="width: 120px">
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格区域 -->
    <el-card class="table-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>用户列表</span>
          <el-button type="primary" @click="handleAdd">新增用户</el-button>
        </div>
      </template>

      <el-table :data="tableData" v-loading="loading" border stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" min-width="120" />
        <el-table-column prop="nickname" label="昵称" min-width="120" />
        <el-table-column prop="email" label="邮箱" min-width="160" />
        <el-table-column prop="phone" label="手机号" width="140" />
        <el-table-column label="状态" width="80" align="center">
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
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="queryParams.pageNum"
        v-model:page-size="queryParams.pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        class="pagination"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
      />
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="560px" :close-on-click-modal="false">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" :disabled="isEdit" />
        </el-form-item>
        <el-form-item v-if="!isEdit" label="密码" prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="form.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="角色分配">
          <el-select v-model="form.roleIds" multiple placeholder="请选择角色" style="width: 100%">
            <el-option
              v-for="role in allRoles"
              :key="role.id"
              :label="role.roleName"
              :value="role.id"
            />
          </el-select>
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

.search-card {
  margin-bottom: 16px;
  flex-shrink: 0;
}

/* 搜索表单响应式：小屏时换行 */
.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 0 12px;
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

/* 表格主体可滚动 */
.table-card :deep(.el-table__inner-wrapper) {
  overflow: auto;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.pagination {
  margin-top: 16px;
  justify-content: flex-end;
  flex-shrink: 0;
}
</style>
