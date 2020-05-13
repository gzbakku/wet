"use strict";

const firebase = require('firebase-admin');
const common = require('../../common');

module.exports = {

  db : null,

  init : function(cred,db){
    firebase.initializeApp({
      credential: firebase.credential.cert(cred),
      databaseURL: db
    });
    this.db = firebase.firestore();
    const settings = {timestampsInSnapshots: true};
    this.db.settings(settings);
    common.success('db initiated');
    return true;
  },

  processAddress : function(address){

    if(this.db == null || address == null || address == undefined){
      return false;
    }

    let local = this.db;

    for(var i=0;i<address.length;i++){

      let item = address[i];

      if(item.type == 'doc'){
        local = local.doc(item.query);
      } else if(item.type == 'collection'){
        local = local.collection(item.query);
      } else if(item.type == 'where'){
        local = local.where(item.query[0],item.query[1],item.query[2]);
      } else if(item.type == 'after'){
        local = local.startAfter(item.query);
      } else if(item.type == 'before'){
        local = local.endBefore(item.query);
      } else if(item.type == 'orderBy'){
        if(item.query.direction == 'asc'){
          local = local.orderBy(item.query.index,'asc');
        } else {
          local = local.orderBy(item.query.index,'desc');
        }
      } else if(item.type == 'limit'){
        local = local.limit(item.query);
      }

    }

    return local;

  },

  get : function(cursor){

    return new Promise((resolve,reject)=>{

      let dbLocal = require('../../db');
      let address = this.processAddress(dbLocal('getAddress'));
      let last = dbLocal('getLastType');

      if(address == false){
        let error = 'failed-address_builder';
        reject(error);
      }

      let query = address.get();

      if(last == 'doc'){
        return query.then((doc)=>{
          if(cursor){
            resolve(doc);
          } else {
            let data = doc.data();
            resolve(data);
          }
        })
        .catch((error)=>{
          reject(error);
        });
      } else if(last == 'collection'){
        return query.then((querySnapshot)=>{
          let data = [];
          querySnapshot.forEach((doc)=>{
            data.push(doc.data());
          });
          resolve(data);
        })
        .catch((error)=>{
          reject(error);
        });
      } else {
        let error = 'invalid_global_address';
        reject(error);
      }

    });

  },

  insert : function(object){
    return new Promise((resolve,reject)=>{
      let dbLocal = require('../../db');
      let address = this.processAddress(dbLocal('getAddress'));
      return address.set(object)
      .then(()=>{
        resolve();
      })
      .catch((error)=>{
        reject(error);
      });
    });
  },

  update : function(object){
    return new Promise((resolve,reject)=>{
      let dbLocal = require('../../db');
      let address = this.processAddress(dbLocal('getAddress'));
      return address.update(object)
      .then(()=>{
        resolve();
      })
      .catch((error)=>{
        reject(error);
      });
    });
  },

  delete : function(){
    let wrath = require('./wrath');
    let dbLocal = require('../../db');
    let address = this.processAddress(dbLocal('getAddress'));
    let last = dbLocal('getLastType');
    if(last == 'doc'){
      return wrath.clearDoc(address);
    } else if(last == 'collection'){
      return wrath.clearCollection(address);
    }
  },

  commit : function(object){

    return new Promise((resolve,reject)=>{

      let error;

      if(object.length == 0){
        error = 'do something in the batch first';
        reject(error);
      }

      const batch = this.db.batch();

      for(var i=0;i<object.length;i++){

        let holder = object[i];

        let local = this.processAddress(holder.address);

        if(holder.opp == 'insert'){
          batch.set(local,holder.data);
        }
        if(holder.opp == 'update'){
          batch.update(local,holder.data);
        }
        if(holder.opp == 'delete'){
          batch.delete(local);
        }

      }

      return batch.commit()
      .then(()=>{
        resolve();
      })
      .catch((error)=>{
        reject(error);
      });

    });
    //promise ends here

  }

}
