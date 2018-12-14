"use strict";

const common = require('./common');
const sanitize = require('htmlspecialchars');
const log = false;

module.exports = function doThis(item){

  let type = getType(item);

  if(type == 'object'){
    return processObject(item);
  }  else if(type == 'array'){
    return processArray(item);
  } else if(type == 'string'){
     return processString(item);
  } else {
    return item;
  }

}

function getType(object){

  common.tell('procesing-type',log);

  if(object == null){
    return null;
  }

  let type = typeof(object);

  if(type !== 'object'){
    return typeof(object);
  }

  if(!object.length){
    return 'object';
  } else {
    return 'array';
  }

}

function processString(string){

  common.tell('procesing-string',log);

  return sanitize(string);

}

function processArray(array){

  common.tell('procesing-array',log);

  if(!array.length){
    return array;
  }

  if(array.length == 0){
    return array;
  }

  let make = [];

  for(var i=0;i<array.length;i++){

    let item = array[i];

    let type = getType(item);

    if(type == 'string'){
      make.push(processString(item));
    } else if(type == 'array'){
      make.push(processArray(item));
    } else if(type == 'object'){
      make.push(processObject(item));
    } else {
      make.push(item);
    }

  }

  return make;

}

function processObject(object){

  common.tell('procesing-object',log);

  //sec checks
  if(!Object.keys(object)){
    return object;
  }

  let keys = Object.keys(object);

  if(!keys.length){
    return object;
  }

  if(keys.length == 0){
    return object;
  }

  let make = {};

  for(var i=0;i<keys.length;i++){

    let key = keys[i];
    let value = object[key];
    let type = getType(value);

    if(type == 'string'){
      make[key] = processString(value);
    } else if(type == 'object'){
      make[key] = processObject(value);
    } else if(type == 'array'){
      make[key] = processArray(value);
    } else {
      make[key] = value;
    }

  }

  return make;

}
