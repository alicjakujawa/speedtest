class IndexedDB {

  constructor () {
    this.indexedDb
    this.dbName = 'files'
    this.dbVersion = 4
  }

  createObjectStore (cb) {
    this.dbVersion++
    let request = this.indexedDB.open(this.dbName, this.dbVersion)
    request.onupgradeneeded = event => {
      let contentDB = event.target.result
      contentDB.createObjectStore('files', { keyPath: 'name' })
    }
    request.onsuccess = event => {
      request.result.close()
      cb()
    }
  }

  checkObjectStore (cb) {
    let request = this.indexedDB.open(this.dbName, this.dbversion)
    request.onsuccess = event => {
      let contentDB = event.target.result
      let transaction = contentDB.transaction(['files'], 'readwrite')
      let contentStore = transaction.objectStore('files')
      contentStore.getAll().onsuccess = event => {
        cb(event.target.result[0])
      }
    }
  }

  storeContent (files, cb) {
    this.dbVersion++
    let request = this.indexedDB.open(this.dbName, this.dbVersion)
    request.onerror = event => {
      console.log(event)
    }
    request.onsuccess = event => {
      let contentDB = event.target.result
      let transaction = contentDB.transaction(['files'], 'readwrite')
      transaction.oncomplete = event => {
        console.log('Done! ', event)
      }
      transaction.onerror = event => {
        console.log('Error! ', event)
      }
      let contentStore = transaction.objectStore('files')
      files.forEach((file, i) => {
        let contentStoreRequest = contentStore.put(file, i)
        contentStoreRequest.onsuccess = event => {
          console.log(event, 'Added!')
        }
      })
      // let contentStoreRequest = contentStore.put(files[0], 'file')
      // contentDB.close()
      // contentStoreRequest.onsuccess = event => {
      //   cb(files)
      // }
    }
  }

  dbExists (cb) {
    let dbExists = true
    let request = this.indexedDB.open(this.dbName)
    request.onsuccess = () => {
      request.result.close()
      cb(dbExists)
    }
    request.onupgradeneeded = () => {
      dbExists = false
    }
  }

  init () {
    this.indexedDB = window.indexedDB || window.webkitIndexedDB ||
    window.mozIndexedDB || window.OIndexedDB || window.msIndexedDB
  }

}

export default new IndexedDB()
