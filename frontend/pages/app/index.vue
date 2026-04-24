<script setup lang="ts">
definePageMeta({ layout: 'app', middleware: 'auth' })
await navigateTo('/app/dogs', { replace: true })
</script>
