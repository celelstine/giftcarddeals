module.exports = {
  head: {
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { 
        hid: 'description',
        name: 'description', 
        content: `Buy and sell giftcards such as Itunes (USA, Australian and
        Canadian), Amazon, Steam cards and more. We exchange giftcards for cash` 
      },
      { 
        hid: 'keywords',
        name: 'keywords', 
        content: `Buy giftcards, buy itunes card, buy ssteam card, buy amazon card` 
      }
    ],
    link: [
      { 
        rel: 'stylesheet',
        href: 'https://www.w3schools.com/w3css/4/w3.css' 
      },
      { 
        rel: 'stylesheet',
        href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css' 
      },
      { 
        rel: 'stylesheet',
        href: '/static/theme.css' 
      },
      { 
        rel: 'shortcut icon',
        href: '/static/favicon.ico',
        type: "image/x-icon"
      },
      { 
        rel: 'icon',
        href: '/static/favicon.ico',
        type: "image/x-icon"
      },
      { 
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Karma' 
      },
      { 
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=IBM+Plex+Sans+Condensed' 
      },
      {
        rel: 'stylesheet',
        href: 'https://use.fontawesome.com/releases/v5.0.10/css/all.css',
        integrity:"sha384-+d0P83n9kaQMCwj8F4RJB66tzIwOKmrdb46+porD/OvrJ+37WqIM7UoBtwHO6Nlg",
        crossorigin: 'anonymous'
      }
    ],
    title: 'ExchangeZone9ja: ItunesCard',
  },
  srcDir: 'src/',
  generate: {
    dir: 'lib/dist/'
  },
  loading: '~/components/loading.vue'
}
