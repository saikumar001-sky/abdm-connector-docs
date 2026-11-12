import DefaultTheme from 'vitepress/theme'
import ApiPlayground from './components/ApiPlayground.vue'
import EndpointBadge from './components/EndpointBadge.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('ApiPlayground', ApiPlayground)
    app.component('EndpointBadge', EndpointBadge)
  },
}
