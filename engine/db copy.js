"use strict";

const router = require('./db/router');
const common = require('./common');

const bank = ['firestore'];

var address = [];
var dbName = null;
var lastType = null;
var batchHolder = [];
var batchExists = false;

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
    //address = [];
    return {
      init:init,
      collection:collection,
      batch:batch
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

function batch(){

  batchExists = true;
  address = [];

  return {
    commit:commit,
    insert:insert,
    update:update,
    delete:del,
  }

  function insert(object){
    batchHolder.push({address:address,opp:'insert',data:object});
    address = [];
    return true;
  }

  function update(object){
    batchHolder.push({address:address,opp:'update',data:object});
    address = [];
    return true;
  }

  function del(){
    batchHolder.push({address:address,opp:'delete'});
    address = [];
    return true;
  }

}

//------------------------------------------------------------------------------
// data processors

function init(config){
  let work = router[dbName].init(config);
  address = [];
  return work;
}

function get(cursor){
  if(batchExists){address=[]; common.error('batch invalidated'); return common.error('commit the batch first');}
  let work = router[dbName].get(cursor);
  address = [];
  return work;
}

function del(){
  if(batchExists){address=[]; common.error('batch invalidated'); return common.error('commit the batch first');}
  let work = router[dbName].delete();
  address = [];
  return work;
}

function insert(object){
  if(batchExists){address=[]; common.error('batch invalidated'); return common.error('commit the batch first');}
  let work = router[dbName].insert(object);
  address = [];
  return work;
}

function update(object){
  if(batchExists){address=[]; common.error('batch invalidated'); return common.error('commit the batch first');}
  let work = router[dbName].update(object);
  address = [];
  return work;
}

function commit(){
  let work = router[dbName].commit(batchHolder);
  address = [];
  batchExists = false;
  return work;
}
