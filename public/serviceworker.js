// This code executes in its own worker or thread
console.log("Service worker loaded...");


self.addEventListener('install', () => {
   console.log("Service worker installed");
	self.skipWaiting();
});

self.addEventListener("activate", event => {
   console.log("Service worker activated");
});

self.addEventListener('push', function (e) {
   const data = e.data.json();
   self.registration.showNotification(
      data.title,
      {
         body: data.body,
      }
   );
})