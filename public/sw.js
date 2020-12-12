self.addEventListener('install', e => {
  console.log('install', e)
  self.skipWaiting()
})

self.addEventListener('activate', e => {
  console.log('activate', e)
  return self.clients.claim()
})

self.addEventListener('fetch', e => {
  // console.log('fetch', e)
})
