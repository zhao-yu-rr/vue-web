<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'

const router = useRouter()
const authStore = useAuthStore()

const formRef = ref(null)
const form = reactive({
  username: '',
  password: '',
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
  ],
}

const loading = ref(false)

async function handleLogin(formEl) {
  if (!formEl) return

  await formEl.validate(async (valid) => {
    if (!valid) return

    loading.value = true

    try {
      await authStore.login({
        username: form.username.trim(),
        password: form.password,
      })
      ElMessage.success('登录成功')
      router.push('/')
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || '登录失败，请重试'
      ElMessage.error(msg)
    } finally {
      loading.value = false
    }
  })
}
</script>

<template>
  <el-card class="auth-card" shadow="always">
    <template #header>
      <h2 class="auth-title">用户登录</h2>
    </template>

    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="top"
      @submit.prevent="handleLogin(formRef)"
    >
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model="form.username"
          placeholder="请输入用户名"
          autocomplete="username"
          clearable
        />
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input
          v-model="form.password"
          type="password"
          placeholder="请输入密码"
          autocomplete="current-password"
          show-password
        />
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          size="large"
          :loading="loading"
          class="submit-btn"
          @click="handleLogin(formRef)"
        >
          {{ loading ? '登录中...' : '登 录' }}
        </el-button>
      </el-form-item>
    </el-form>

    <div class="auth-switch">
      还没有账号？
      <el-link type="primary" :underline="false" @click="router.push('/register')">
        立即注册
      </el-link>
    </div>
  </el-card>
</template>

<style scoped>
.auth-card {
  width: 100%;
}

.auth-title {
  text-align: center;
  font-size: 1.5rem;
  color: #303133;
  margin: 0;
}

.submit-btn {
  width: 100%;
}

.auth-switch {
  text-align: center;
  font-size: 0.875rem;
  color: #909399;
  margin-top: 0.75rem;
}
</style>
