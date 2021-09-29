// キャッシュファイルの指定
var CACHE_NAME = "pwa-sample-caches";
var urlsToCache = ["./index.html", "./service_worker.js", "./db.js", "./manifest.json", "./test.html"];

// インストール処理
self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("cached");
      return cache.addAll(urlsToCache);
    })
  );
});


self.addEventListener("sync", (event) => {
  // console.info("sync", event);

  // ここでIndexedDBからデータを取得して、サーバに送信する
  result = fetchData();
  // console.log("request data " + result);
});

const dbName = "sample";
const storeName = "sample_store";
const keyValue = "key";
function fetchData() {
  var openReq = indexedDB.open(dbName);

  var result;
  openReq.onsuccess = function (event) {
    var db = event.target.result;
    var trans = db.transaction(storeName, "readonly");
    var store = trans.objectStore(storeName);
    var getReq = store.get(keyValue);

    getReq.onsuccess = function (event) {
      result = event.target.result;
      console.log(event.target.result);
      return result;
    };
  };
}

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }

      // 重要：リクエストを clone する。リクエストは Stream なので
      // 一度しか処理できない。ここではキャッシュ用、fetch 用と2回
      // 必要なので、リクエストは clone しないといけない
      let fetchRequest = event.request.clone();

      return fetch(fetchRequest).then((response) => {
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }

        // 重要：レスポンスを clone する。レスポンスは Stream で
        // ブラウザ用とキャッシュ用の2回必要。なので clone して
        // 2つの Stream があるようにする
        let responseToCache = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});