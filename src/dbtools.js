import _ from "lodash";
let firebase = require("firebase");
require("firebase/firestore");

const dbtools = {

  fireabaseDB: null,

  slug(str) {
    return str.toLowerCase()
        .replace(/[^\w.\- ]+/g,'')
        .trim()
        .replace(/ +/g,'-')
        .replace(/-+/g,'-');
  },

  uniqueId: async (path, testId)=> {
    let db = await dbtools.connect();
    console.log("got the db for uniqueId: ", `${path}/${testId}`);
    const conflictLimit = 50;
    let count = 0;
    
    const incrementId = (id, count)=> {
      console.log("not uqniue, incrementing");
      return `${testId}_${count}`;
    };

    const promiseToFindUniqueId = (resolve, reject) => {
      const checkExists = (id)=> {
        console.log("checking esistence", count);
        db.collection(path).doc(id).get().then((ref)=> {
          console.log("got the ref for id", id);
          if(!ref.exists) {
            resolve(id);
          }
          else if(count > conflictLimit) {
            reject();
          }
          else {
            count++;
            const x = incrementId(id, count);
            checkExists(x);
          }
        });
      }
      checkExists(testId);
    }

    return new Promise(promiseToFindUniqueId);
  },

  init: async ()=> {
    if(!_.isNil(dbtools.fireabaseDB))
      return new Promise((resolve)=>{resolve(dbtools.firebaseDB)});

    let db = firebase.firestore();
    const settings = { timestampsInSnapshots: true };
    db.settings(settings);

    const init = (resolve, reject)=> {
      const enabled = ()=> {
        console.log("enabled persistence");
        dbtools.fireabaseDB = db;
        resolve(db);
      }
      const notEnabled = ()=> {
        console.log("failed to enable persistence");
        dbtools.fireabaseDB = db;
        resolve(db);
      }

      db.enablePersistence().then(enabled, notEnabled);
    }

    return new Promise(init);

  },

  connect: async (timeout)=> {
    // return the maldito database fron initDB
    if(!_.isNil(dbtools.fireabaseDB)) {
      return dbtools.fireabaseDB;
    }

    if(timeout > 5000) {
      console.log("taking too long");
      throw "Failed to connect to Firebase: Timout exceeded";
    }

    const wait = async (t)=>{ 
      return new Promise(resolve => {
        setTimeout(resolve, t);
      });
    }
    timeout = (timeout)?timeout * timeout: 50;
    await wait(timeout);
    return dbtools.connect(timeout);
    
  },



  /**
   * uuid author broofa
   * https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript/2117523#2117523
   */
   /*eslint-disable */
  uuid() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
  },
  /*eslint-enable */


  async get(path, id) {
    let db = await dbtools.connect();
    let p = new Promise((resolve, reject)=>{
        db.collection(path).doc(id).get()
          .then( (doc)=>{            
            if(doc.exists) {
              let record = doc.data();
              record.id = id;
              resolve(this.prep(record));
            }
            else
              reject();
          });
        });

    return p;
  },

  prep(obj) {
    const keys = _.keys(obj);
    // console.log("keys", keys);
    let o2 = {};
    const tsToDate = (k)=> {
      // console.log("key", k);
      const v = obj[k];
      // console.log("v", v);
      if(v && v.toDate) {
        o2[k] = v.toDate();
      }
      else
        o2[k] = v
    }
    _.each(keys, tsToDate);
    return o2;
  },

  findAll(path) {
    return new Promise(
      async (resolve, reject)=>{
        let db = await dbtools.connect();
        let t = [];
        db.collection(path).get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            let record = doc.data();
            record.id = doc.id;
            t.push(this.prep(record));
          });
          resolve(t);
        });
    });
  },

  saveAll(path, t, id) {

    const promiseToSave = async (resolve, reject) => {
      // identify function or obj.id
      if(!id)
        id = (obj)=>{return obj.id};

      const db = await dbtools.connect();
      const batch = db.batch();

      const err = (e)=>{
        console.log(e);
        reject(e);
      }

      const save = (o)=> {
        let ref = db.collection(path).doc(id(o));
        batch.set(ref, o);
      }

      _.each(t, save);


      batch.commit().then(()=>{
        resolve(t)
      }).catch(err);

    }

    return new Promise(promiseToSave);
  },

  deleteAll(path, t, id) {

    const promiseToDelete = async (resolve, reject) => {
      // identify function or obj.id
      const f = (obj)=>{return obj.id};
      id = id || f;

      const db = await dbtools.connect();
      const batch = db.batch();

      const err = (e)=>{
        console.log(e);
        reject(e);
      }

      const deleteObj = (o)=> {
        let ref = db.collection(path).doc(id(o));
        batch.delete(ref);
      }

      _.each(t, deleteObj);


      batch.commit().then(()=>{
        resolve(t)
      }).catch(err);

    }

    return new Promise(promiseToDelete);
  },



  async save(path, data) {
    if(!data.id)
      return this.add(path, data);

    return this.update(path, data);
  },

  async update(path, data) {
    console.log("updating from dbtools", `${path}/${data.id}`);
    console.log("data to update", data);

    let db = await dbtools.connect();
    console.log("got the db");
    let ref = db.collection(path).doc(data.id);
    console.log("got a ref to update", ref);
    data.modified = new Date();
    return new Promise((resolve, reject)=>{
      ref.set(data).then(()=> {
        resolve(data);
      });
    });
  },

  async add(path, data) {
    let db = await dbtools.connect();
    data.created = new Date();
    data.modified = new Date();
    let ref = db.collection(path).doc();
    return new Promise((resolve, reject)=>{
      ref.set(data).then(()=>{
        let obj = {id: ref.id};
        obj = _.merge(obj, data);
        resolve(obj);
      });
    });
  },

  async delete(path, id) {
    let db = await dbtools.connect();
    console.log(path);
    console.log(id);
    let ref = db.collection(path).doc(id);
    const err = (e)=>{
      console.log("error deleting record");
      console.log(e);
    }

    return new Promise((resolve, reject)=>{ref.delete().then(resolve).catch(err);});
  }
};

export default dbtools;
