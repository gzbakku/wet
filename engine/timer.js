const uniqid = require('uniqid');
const common = require('./common');

let pool = {};

module.exports = {

  init : function(){
    let uid = uniqid();
    pool[uid] = time();
    return uid;
  },

  calc : function(uid){
    return ((time() - pool[uid]) / 1000);
  }

};

function time(){
  let d = new Date();
  return d.getTime();
}
