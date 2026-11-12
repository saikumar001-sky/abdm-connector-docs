<script setup>
defineProps({
  method: { type: String, required: true },
  path: { type: String, required: true },
})
</script>

<template>
  <div class="endpoint">
    <span class="method" :class="method.toLowerCase()">{{ method.toUpperCase() }}</span>
    <code class="path">{{ path }}</code>
  </div>
</template>

<style scoped>
.endpoint {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin: 12px 0;
  padding: 10px 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}
.method {
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.04em;
  padding: 2px 8px;
  border-radius: 4px;
  color: #fff;
}
.get { background: var(--api-get); }
.post { background: var(--api-post); }
.put { background: var(--api-put); }
.delete { background: var(--api-delete); }
.path {
  background: transparent !important;
  padding: 0 !important;
  word-break: break-all;
}
</style>
