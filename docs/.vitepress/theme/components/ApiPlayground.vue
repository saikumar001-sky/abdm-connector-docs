<script setup>
/**
 * "Try it" console. Sends a real request from the reader's browser to the
 * connector's SANDBOX. Nothing secret is shipped with the docs: the reader
 * pastes their own sandbox access token, which is kept in sessionStorage only.
 *
 * Props:
 *   method  - GET | POST | PUT | DELETE
 *   path    - path below the base URL, may contain {pathParams}
 *   params  - [{ name, in: 'query' | 'path', required, placeholder, description }]
 *   body    - default JSON body (object) for endpoints that take a JSON body
 *   binary  - true when the endpoint returns an image (e.g. ABHA card)
 */
import { computed, onMounted, reactive, ref, watch } from 'vue'

const props = defineProps({
  method: { type: String, default: 'POST' },
  path: { type: String, required: true },
  params: { type: Array, default: () => [] },
  body: { type: Object, default: null },
  binary: { type: Boolean, default: false },
})

const STORAGE_BASE = 'abdm-docs:base-url'
const STORAGE_TOKEN = 'abdm-docs:token'

const open = ref(false)
const baseUrl = ref(import.meta.env.VITE_API_BASE_URL || '')
const token = ref('')
const values = reactive(Object.fromEntries(props.params.map((p) => [p.name, ''])))
const bodyText = ref(props.body ? JSON.stringify(props.body, null, 2) : '')
const loading = ref(false)
const result = ref(null) // { status, ms, json?, text?, imageUrl? }
const error = ref('')

function safeGet(key) {
  try { return sessionStorage.getItem(key) } catch { return null }
}
function safeSet(key, val) {
  try { sessionStorage.setItem(key, val) } catch { /* storage blocked */ }
}

onMounted(() => {
  baseUrl.value = safeGet(STORAGE_BASE) || baseUrl.value
  token.value = safeGet(STORAGE_TOKEN) || ''
})
watch(baseUrl, (v) => safeSet(STORAGE_BASE, v))
watch(token, (v) => safeSet(STORAGE_TOKEN, v))

const missing = computed(() =>
  props.params.filter((p) => p.required && !String(values[p.name] ?? '').trim()).map((p) => p.name),
)

const url = computed(() => {
  let path = props.path
  const query = new URLSearchParams()
  for (const p of props.params) {
    const v = String(values[p.name] ?? '').trim()
    if (!v) continue
    if (p.in === 'path') path = path.replace(`{${p.name}}`, encodeURIComponent(v))
    else query.append(p.name, v)
  }
  const qs = query.toString()
  return `${baseUrl.value.replace(/\/$/, '')}${path}${qs ? `?${qs}` : ''}`
})

const curl = computed(() => {
  const lines = [`curl -X ${props.method} '${url.value}'`, `  -H 'Authorization: Bearer <ACCESS_TOKEN>'`]
  if (bodyText.value.trim()) {
    lines.push(`  -H 'Content-Type: application/json'`)
    lines.push(`  -d '${bodyText.value.replace(/\s*\n\s*/g, ' ')}'`)
  }
  return lines.join(' \\\n')
})

async function send() {
  error.value = ''
  result.value = null
  if (!baseUrl.value) return (error.value = 'Enter the sandbox base URL first.')
  if (missing.value.length) return (error.value = `Missing required: ${missing.value.join(', ')}`)

  let body
  if (bodyText.value.trim()) {
    try { body = JSON.stringify(JSON.parse(bodyText.value)) } catch { return (error.value = 'Body is not valid JSON.') }
  }

  loading.value = true
  const started = performance.now()
  try {
    const res = await fetch(url.value, {
      method: props.method,
      headers: {
        ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      body,
    })
    const ms = Math.round(performance.now() - started)
    const type = res.headers.get('content-type') || ''
    if (type.includes('image/')) {
      result.value = { status: res.status, ms, imageUrl: URL.createObjectURL(await res.blob()) }
    } else if (type.includes('json')) {
      result.value = { status: res.status, ms, json: await res.json() }
    } else {
      result.value = { status: res.status, ms, text: await res.text() }
    }
  } catch (e) {
    error.value = `Request failed: ${e.message}. Check the base URL and that the sandbox allows CORS from this site.`
  } finally {
    loading.value = false
  }
}

const envelopeOk = computed(() => {
  const j = result.value?.json
  return j && typeof j === 'object' && 'status_code' in j ? j.status_code === 200 : null
})
</script>

<template>
  <div class="playground">
    <button class="toggle" @click="open = !open">
      {{ open ? '▾' : '▸' }} Try it against the sandbox
    </button>

    <div v-if="open" class="panel">
      <p class="warn">
        Sandbox only. Use test Aadhaar/ABHA numbers, never real patient data.
        Your token stays in this browser tab.
      </p>

      <label>Base URL
        <input v-model="baseUrl" placeholder="https://sandbox.example.com/authservice/api/v1" />
      </label>
      <label>Access token
        <input v-model="token" type="password" placeholder="Paste a sandbox access_token" autocomplete="off" />
      </label>

      <template v-if="params.length">
        <h4>Parameters</h4>
        <label v-for="p in params" :key="p.name">
          <span>
            <code>{{ p.name }}</code>
            <small>{{ p.in === 'path' ? 'path' : 'query' }}{{ p.required ? ' · required' : '' }}</small>
          </span>
          <input v-model="values[p.name]" :placeholder="p.placeholder || p.description || ''" />
        </label>
      </template>

      <template v-if="body">
        <h4>JSON body</h4>
        <textarea v-model="bodyText" rows="6" spellcheck="false" />
      </template>

      <div class="actions">
        <button class="send" :disabled="loading" @click="send">
          {{ loading ? 'Sending…' : `Send ${method}` }}
        </button>
      </div>

      <details>
        <summary>cURL</summary>
        <pre><code>{{ curl }}</code></pre>
      </details>

      <p v-if="error" class="error">{{ error }}</p>

      <div v-if="result" class="result">
        <div class="meta">
          HTTP {{ result.status }} · {{ result.ms }} ms
          <span v-if="envelopeOk !== null" :class="envelopeOk ? 'ok' : 'bad'">
            · body status_code {{ result.json.status_code }}
          </span>
        </div>
        <img v-if="result.imageUrl" :src="result.imageUrl" alt="API image response" />
        <pre v-else-if="result.json"><code>{{ JSON.stringify(result.json, null, 2) }}</code></pre>
        <pre v-else><code>{{ result.text }}</code></pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
.playground {
  margin: 16px 0 24px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
}
.toggle {
  width: 100%;
  text-align: left;
  padding: 10px 14px;
  font-weight: 600;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-brand-1);
}
.panel { padding: 14px; display: grid; gap: 10px; }
.warn {
  margin: 0;
  font-size: 13px;
  padding: 8px 10px;
  border-radius: 6px;
  background: var(--vp-c-warning-soft);
}
h4 { margin: 8px 0 0; font-size: 14px; }
label { display: grid; gap: 4px; font-size: 13px; }
label small { margin-left: 6px; color: var(--vp-c-text-2); }
input, textarea {
  width: 100%;
  padding: 6px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
}
.actions { display: flex; }
.send {
  padding: 6px 16px;
  border-radius: 6px;
  font-weight: 600;
  color: var(--vp-c-white);
  background: var(--vp-c-brand-1);
}
.send:disabled { opacity: 0.6; }
.error { margin: 0; color: var(--vp-c-danger-1); font-size: 13px; }
.result .meta { font-size: 13px; color: var(--vp-c-text-2); }
.ok { color: var(--vp-c-success-1); }
.bad { color: var(--vp-c-danger-1); }
pre {
  margin: 6px 0 0;
  padding: 10px;
  max-height: 360px;
  overflow: auto;
  border-radius: 6px;
  background: var(--vp-code-block-bg);
  font-size: 12px;
}
img { max-width: 100%; margin-top: 8px; border-radius: 6px; }
</style>
