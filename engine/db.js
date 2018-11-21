const router = require('./db/router');
const common = require('./common');

const bank = ['firestore'];

var address = null;
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
    return {
      collection:collection
    }
  }
}

//------------------------------------------------------------------------------
// address builders

function collection(name){
  if(address == null){
    address = 'collection(' + name + ')';
  } else {
    address = address + '.collection(' + name + ')';
  }
  lastType = 'collection';
  return {
    doc:doc,
    where:where,
    get:get,
  }
}

function doc(name){
  address = address + '.doc(' + name + ')';
  lastType = 'doc';
  return {
    collection:collection,
    where:where,
    get:get,
    insert:insert,
    update:update,
    del:del
  }
}

function where(query){
  address = address + '.where(' + query + ')';
  return {
    get:get
  }
}

//------------------------------------------------------------------------------
// data processors

function get(){
  return router[dbName].get();
}

function del(){
  return router[dbName].del();
}

function insert(object){
  return router[dbName].insert(object);
}

function update(object){
  return router[dbName].update(object);
}
