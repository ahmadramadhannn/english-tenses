// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: 'English Tenses - Learn by Examples',
      meta: [
        { name: 'description', content: 'Learn English tenses through interactive examples with dictionary integration' }
      ],
      htmlAttrs: {
        lang: 'en'
      }
    }
  }
})
