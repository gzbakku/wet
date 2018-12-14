"use strict";

const router = require('./db/router');
const common = require('./common');

const bank = ['firestore'];

var address = [];
var dbName = null;
var lastType = null;

module.exports = function(name){
  if(name === 'getName'){
    return dbName;
  }
  if(name === 'getAddress'){
    return address;
  }
  if(name === 'getLastType'){
    return lastType;
  }
  if(bank.indexOf(name) < 0){
    return common.error('invalid-db');
  } else {
    dbName = name;
    address = [];
    return {
      init:init,
      collection:collection
    }
  }
}

//------------------------------------------------------------------------------
// address builders

function collection(query){
  address.push({type:'collection',query:query});
  lastType = 'collection';
  return {
    doc:doc,
    where:where,
    get:get,
    delete:del,
    orderBy:orderBy,
    limit:limit
  }
}

function doc(query){
  address.push({type:'doc',query:query});
  lastType = 'doc';
  return {
    collection:collection,
    where:where,
    get:get,
    insert:insert,
    update:update,
    delete:del
  }
}

function where(a,b,c){
  address.push({type:'where',query:[a,b,c]});
  return {
    get:get,
    update:update,
    delete:del,
    where:where,
    orderBy:orderBy,
    limit:limit
  }
}

function orderBy(index,direction){
  address.push({type:'orderBy',query:{index:index,direction:direction}});
  return {
    get:get,
    limit:limit,
    after:after
  }
}

function limit(query){
  address.push({type:'limit',query:query});
  return {
    get:get,
    after:after
  }
}

function after(name){
  address.push({type:'after',query:name});
  return {
    get:get
  }
}

//------------------------------------------------------------------------------
// data processors

function init(config){
  return router[dbName].init(config);
}

function get(){
  return router[dbName].get();
}

function del(){
  return router[dbName].delete();
}

function insert(object){
  return router[dbName].insert(object);
}

function update(object){
  return router[dbName].update(object);
}
