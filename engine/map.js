const uniqid = require('uniqid');
const common = require('./common');
const log = true;

let pool = {};
let loggy = {};

module.exports = {

  init : function(doLog){
    common.tell('map initiated',log);
    let mapId = uniqid();
    pool[mapId] = [];
    if(doLog = true){
      loggy[mapId]
    }
    return mapId;
  },

  tell : function(id,string){
    common.tell('info mapped',log);
    let yolo = '+++ ' + string;
    pool[id].push(yolo);
  },

  warn : function(id,string){
    common.tell('warning mapped',log);
    let yolo = '??? ' + string;
    pool[id].push(yolo);
  },

  error : function(id,string){
    common.tell('error mapped',log);
    let yolo = '!!! ' + string;
    pool[id].push(yolo);
  },

  flush : function(id){
    common.tell('map flushed',log);
    console.log(pool[id]);
    delete pool[id];
  }

};
