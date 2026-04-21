<script setup lang="ts">
const authStore = useAuthStore()
authStore.restoreSession()

await navigateTo(authStore.isAuthenticated ? '/app' : '/auth/login')
</script>
