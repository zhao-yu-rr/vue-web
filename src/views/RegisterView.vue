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
  nickname: '',
  password: '',
  confirmPassword: '',
  email: '',
  phone: '',
})

const validateConfirmPassword = (rule, value, callback) => {
  if (value !== form.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' },
  ],
  email: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }],
}

const loading = ref(false)

async function handleRegister(formEl) {
  if (!formEl) return

  await formEl.validate(async (valid) => {
    if (!valid) return

    loading.value = true

    try {
      await authStore.register({
        username: form.username.trim(),
        password: form.password,
        nickname: form.nickname.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
      })
      ElMessage.success('注册成功，请登录')
      router.push('/login')
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || '注册失败，请重试'
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
      <h2 class="auth-title">用户注册</h2>
    </template>

    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="top"
      @submit.prevent="handleRegister(formRef)"
    >
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model="form.username"
          placeholder="请输入用户名"
          autocomplete="username"
          clearable
        />
      </el-form-item>

      <el-form-item label="昵称" prop="nickname">
        <el-input
          v-model="form.nickname"
          placeholder="请输入昵称"
          clearable
        />
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input
          v-model="form.password"
          type="password"
          placeholder="请输入密码（不少于6位）"
          autocomplete="new-password"
          show-password
        />
      </el-form-item>

      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input
          v-model="form.confirmPassword"
          type="password"
          placeholder="请再次输入密码"
          autocomplete="new-password"
          show-password
        />
      </el-form-item>

      <el-form-item label="邮箱" prop="email">
        <el-input
          v-model="form.email"
          placeholder="请输入邮箱（选填）"
          autocomplete="email"
          clearable
        />
      </el-form-item>

      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model="form.phone"
          placeholder="请输入手机号（选填）"
          autocomplete="tel"
          clearable
        />
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          size="large"
          :loading="loading"
          class="submit-btn"
          @click="handleRegister(formRef)"
        >
          {{ loading ? '注册中...' : '注 册' }}
        </el-button>
      </el-form-item>
    </el-form>

    <div class="auth-switch">
      已有账号？
      <el-link type="primary" :underline="false" @click="router.push('/login')">
        立即登录
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
