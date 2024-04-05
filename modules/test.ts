import { readFile } from 'node:fs/promises'
import { addTemplate, createResolver, defineNuxtModule, updateTemplates } from 'nuxt/kit'

export default defineNuxtModule({
  async setup(_options, nuxt) {
    const rootResolver = createResolver(nuxt.options.rootDir)

    const getAppVueLength = async () => {
      const appVue = rootResolver.resolve('./app.vue')
      const appVueContent = await readFile(appVue, 'utf-8')
      console.log(`got app.vue length: ${appVueContent.length}`)
      return appVueContent.length
    }

    addTemplate({
      filename: 'app-vue-length.ts',
      getContents: async () => `export default ${ await getAppVueLength() }`,
      write: true,
    })
    
    nuxt.hook('builder:watch', async (event, path) => {
      if (!path.endsWith('app.vue')) {
        return
      }
      if (!['add', 'change'].includes(event)) {
        return
      }

      updateTemplates({
        filter: (template) => template.filename === 'app-vue-length.ts',
      })
    })
  }
})
