/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://shining-star.app',
  generateRobotsTxt: true,
  exclude: ['/admin/*', '/portal/*', '/auth/*', '/api/*'],
  alternateRefs: [
    {
      href: 'https://shining-star.app/en',
      hreflang: 'en',
    },
    {
      href: 'https://shining-star.app/es',
      hreflang: 'es',
    },
    {
      href: 'https://shining-star.app/ru',
      hreflang: 'ru',
    },
    {
      href: 'https://shining-star.app/uk',
      hreflang: 'uk',
    },
    {
      href: 'https://shining-star.app/kk',
      hreflang: 'kk',
    },
  ],
}
