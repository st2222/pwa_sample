// キャッシュファイルの指定
var CACHE_NAME = "pwa-sample-caches";
var urlsToCache = ["./"];

// インストール処理
self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("cached");
      return cache.addAll(urlsToCache);
    })
  );
});

// リソースフェッチ時のキャッシュロード処理
self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response ? response : fetch(event.request);
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
