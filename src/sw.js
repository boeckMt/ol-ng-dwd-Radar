/*
 *
 *  Air Horner
 *  Copyright 2015 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */

// Version 0.6.2
let version = '0.6.2';

var deferredPrompt;

window.addEventListener('beforeinstallprompt', function(e) {
  console.log('beforeinstallprompt Event fired');
  e.preventDefault();

  // Stash the event so it can be triggered later.
  deferredPrompt = e;

  return false;
});

btnSave.addEventListener('click', function() {
  if(deferredPrompt !== undefined) {
    // The user has had a positive interaction with our app and Chrome
    // has tried to prompt previously, so let's show the prompt.
    deferredPrompt.prompt();

    // Follow what the user has done with the prompt.
    deferredPrompt.userChoice.then(function(choiceResult) {

      console.log(choiceResult.outcome);

      if(choiceResult.outcome == 'dismissed') {
        console.log('User cancelled home screen install');
      }
      else {
        console.log('User added to home screen');
      }

      // We no longer need the prompt.  Clear it up.
      deferredPrompt = null;
    });
  }
});

self.addEventListener('install', e => {
    let timeStamp = Date.now();
    e.waitUntil(
        caches.open('dwdradar').then(cache => {
            return cache.addAll([
                `/`,
                `/favicon.ico?timestamp=${timeStamp}`,
                `/index.html?timestamp=${timeStamp}`,
                `/inline.fdef9ae3021375bfb464.bundle.js?timestamp=${timeStamp}`,
                `/main.e9925642c8164a6ac421.bundle.js?timestamp=${timeStamp}`,
                `/polyfills.61df7d7ec492d95bb0b2.bundle.js?timestamp=${timeStamp}`,
                `/styles.969523354e51e0f22d6c.bundle.css?timestamp=${timeStamp}`,
                `/MaterialIcons-Regular.570eb83859dc23dd0eec.woff2?timestamp=${timeStamp}`
            ])
                .then(() => self.skipWaiting());
        })
    )
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
    console.log(event.request.url);
    event.respondWith(
        caches.match(event.request, { ignoreSearch: true }).then(response => {
            return response || fetch(event.request);
        })
    );
});