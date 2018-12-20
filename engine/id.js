"use strict";

const uniqid = require('uniqid');
const md5 = require('md5');
const shortid = require('shortid');

module.exports = {

  hash : function(string){
    return md5(string.toString());
  },

  random : function(string){
    return md5(uniqid());
  },

  short : function(string){
    return shortid.generate();
  },

};
