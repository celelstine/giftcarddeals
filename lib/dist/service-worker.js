"use strict";var precacheConfig=[["/index.html","b0eb0bc671e6982d1cbdb989e5a216fe"],["/static/assests/images/feedback.746816d.png","746816d5e6760f7f30c2191ed94f4ef2"],["/static/assests/images/gift_card_blue.047c2a9.png","047c2a99c5a1062c3c1cd8facaa23a44"],["/static/assests/images/itunes-100.9c70adf.png","9c70adf0c47d8692c2dfbd2e187fa383"],["/static/assests/images/itunes-25.f5cbbfc.jpeg","f5cbbfc498c642165a67a6e5ea3f0d54"],["/static/assests/images/itunes-50.668755a.png","668755aaa7d2134f09ea296c002dc429"],["/static/assests/images/itunes-gift-card-15.120f3bf.png","120f3bfbbee7feb2fc50337ac80c33fd"],["/static/assests/images/itunes-gift-card-pile.4728efc.png","4728efc66046e156ea4af0082824ca9d"],["/static/assests/images/sell-gift-cards.7bb1761.jpg","7bb1761cd5d103d0099a0927ddf55748"],["/static/css/app.093081775cd88de7120e61eeeef8596f.css","e0639af37d4ca6f7b529fadb3f1750ef"],["/static/css/app.093081775cd88de7120e61eeeef8596f.css.map","98d2ae8bce8d1ac73d6a53b3ab557d8c"],["/static/favicon.ico","e7c337000538c4c512635ccdabf419fa"],["/static/favicon1.ico","4417583ead939bc6f429c1bbd1770423"],["/static/giftcard.jpg","09d4ee2275808792ac5267955f58bcdf"],["/static/js/app.737d89a34bc6255da910.js","25ddae9dd6ebbe6f9a545312c9eefedb"],["/static/js/app.737d89a34bc6255da910.js.map","ee184c3c57ca183077b84d51fe0e33d9"],["/static/js/manifest.5cdbcf7b7a2ae60baf62.js","67d300e864afda15b4fea1756092bcbd"],["/static/js/manifest.5cdbcf7b7a2ae60baf62.js.map","ecc50eb8eefdbf6a36986ef171b09a94"],["/static/js/vendor.864f353fd68ece233fea.js","ad941ef76fffed36248ca43820dfd8f4"],["/static/js/vendor.864f353fd68ece233fea.js.map","b346d3f8bc4e1711129239511430848b"],["/static/theme.css","8d3e1d51f855d48dfb594ffc7c21e671"]],cacheName="sw-precache-v3-vue-pwa-"+(self.registration?self.registration.scope:""),ignoreUrlParametersMatching=[/^utm_/],addDirectoryIndex=function(e,t){var a=new URL(e);return"/"===a.pathname.slice(-1)&&(a.pathname+=t),a.toString()},cleanResponse=function(e){return e.redirected?("body"in e?Promise.resolve(e.body):e.blob()).then(function(t){return new Response(t,{headers:e.headers,status:e.status,statusText:e.statusText})}):Promise.resolve(e)},createCacheKey=function(e,t,a,s){var c=new URL(e);return s&&c.pathname.match(s)||(c.search+=(c.search?"&":"")+encodeURIComponent(t)+"="+encodeURIComponent(a)),c.toString()},isPathWhitelisted=function(e,t){if(0===e.length)return!0;var a=new URL(t).pathname;return e.some(function(e){return a.match(e)})},stripIgnoredUrlParameters=function(e,t){var a=new URL(e);return a.hash="",a.search=a.search.slice(1).split("&").map(function(e){return e.split("=")}).filter(function(e){return t.every(function(t){return!t.test(e[0])})}).map(function(e){return e.join("=")}).join("&"),a.toString()},hashParamName="_sw-precache",urlsToCacheKeys=new Map(precacheConfig.map(function(e){var t=e[0],a=e[1],s=new URL(t,self.location),c=createCacheKey(s,hashParamName,a,!1);return[s.toString(),c]}));function setOfCachedUrls(e){return e.keys().then(function(e){return e.map(function(e){return e.url})}).then(function(e){return new Set(e)})}self.addEventListener("install",function(e){e.waitUntil(caches.open(cacheName).then(function(e){return setOfCachedUrls(e).then(function(t){return Promise.all(Array.from(urlsToCacheKeys.values()).map(function(a){if(!t.has(a)){var s=new Request(a,{credentials:"same-origin"});return fetch(s).then(function(t){if(!t.ok)throw new Error("Request for "+a+" returned a response with status "+t.status);return cleanResponse(t).then(function(t){return e.put(a,t)})})}}))})}).then(function(){return self.skipWaiting()}))}),self.addEventListener("activate",function(e){var t=new Set(urlsToCacheKeys.values());e.waitUntil(caches.open(cacheName).then(function(e){return e.keys().then(function(a){return Promise.all(a.map(function(a){if(!t.has(a.url))return e.delete(a)}))})}).then(function(){return self.clients.claim()}))}),self.addEventListener("fetch",function(e){if("GET"===e.request.method){var t,a=stripIgnoredUrlParameters(e.request.url,ignoreUrlParametersMatching),s="index.html";(t=urlsToCacheKeys.has(a))||(a=addDirectoryIndex(a,s),t=urlsToCacheKeys.has(a));0,t&&e.respondWith(caches.open(cacheName).then(function(e){return e.match(urlsToCacheKeys.get(a)).then(function(e){if(e)return e;throw Error("The cached response that was expected is missing.")})}).catch(function(t){return console.warn('Couldn\'t serve response for "%s" from cache: %O',e.request.url,t),fetch(e.request)}))}});