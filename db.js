const dbName = "sample";
const storeName = "sample_store";
const keyValue = "key";
function createDB() {
  var openReq = indexedDB.open(dbName);

  openReq.onupgradeneeded = function (event) {
    //onupgradeneededは、DBのバージョン更新(DBの新規作成も含む)時のみ実行
    console.log("db create or upgrade");
    var db = event.target.result;
    db.createObjectStore(storeName, { keyPath: "id" });
  };
}
function insertData() {
  var openReq = indexedDB.open(dbName);

  openReq.onsuccess = function (event) {
    //onupgradeneededの後に実行。更新がない場合はこれだけ実行
    var data = { id: "key", name: "value" };
    console.log("db open success");
    var db = event.target.result;
    var trans = db.transaction(storeName, "readwrite");
    var store = trans.objectStore(storeName);
    var putReq = store.put(data);

    putReq.onsuccess = function () {
      console.log("put data success");
    };

    trans.oncomplete = function () {
      // トランザクション完了時(putReq.onsuccessの後)に実行
      console.log("transaction complete");
    };
    // 接続を解除する
    db.close();
  };
  openReq.onerror = function (event) {
    // 接続に失敗
    console.log("db open error");
  };
}

