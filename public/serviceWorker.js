const cacheName = "Boiteokng Job Board";

self.addEventListener("install", (e) => {
  e.waitUntil(
    (function () {
      Promise.all([
        getMatchingFiles(
          "./assets/icons",
          /href\s*=\s*['"]([^'"]*\.jpg)['"]/gi
        ),
        getMatchingFiles(
          "./assets/images",
          /href\s*=\s*['"]([^'"]*\.jpg)['"]/gi
        ),
        getMatchingFiles(
          "./assets/agency_icons",
          /href\s*=\s*['"]([^'"]*\.(jpg|jpeg|png))['"]/gi
        ),
        getMatchingFiles("./assets", /href\s*=\s*['"]([^'"]*\.(css|js))['"]/gi),
        getMatchingFiles("/", /href\s*=\s*['"]([^'"]*\.(json))['"]/gi)
      ])
        .then((values) => {
          let cacheItems = ["/"];
          cacheItems = cacheItems.concat(...values);
          let uniqueRequests = [...new Set(cacheItems)];

          caches.open(cacheName).then((cache) => cache.addAll(uniqueRequests));
        })
        .catch((err) => console.error(err));
    })()
  );

  self.skipWaiting();
});

self.addEventListener("active", () => {
  console.log("service worker is active!");
});
self.addEventListener("fetch", () => {
  console.log("service worker ready to fetch data.");
});

function getMatchingFiles(directory, regex) {
  return new Promise(function (resolve, reject) {
    fetch(directory)
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Failed to fetch directory");
        }
        return response.text();
      })
      .then(function (html) {
        // let pattern = /href\s*=\s*['"]([^'"]*\.png)['"]/gi;

        const fileMatches = html.match(regex);

        if (!fileMatches || fileMatches.length === 0) {
          resolve([]);
        }
        const files = fileMatches.map(function (match) {
          return match.replace(/.*href="(.*)"/i, "$1");
        });

        resolve(files);
      })
      .catch(reject);
  });
}
