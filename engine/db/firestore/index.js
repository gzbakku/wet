const firebase = require('firebase-admin');
const db = firebase.firestore();

module.exports = {

  get : function(){
    let dbLocal = require('../../db');
    let address = dbLocal('getAddress');
    console.log(address);
  },

  insert : function(){
    let dbLocal = require('../../db');
    let address = dbLocal('getAddress');
    console.log(address);
  },

  update : function(){
    let dbLocal = require('../../db');
    let address = dbLocal('getAddress');
    console.log(address);
  },

  del : function(){
    let dbLocal = require('../../db');
    let address = dbLocal('getAddress');
    console.log(address);
  },

}
