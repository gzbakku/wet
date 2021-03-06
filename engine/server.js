"use strict";

const common = require('./common');
const log = true;
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

module.exports = {

  app:null,

  init : function(port,corsDo,fileSize){

    if(this.app !== null){
      return true;
    }
    if(!fileSize){
      fileSize = '2mb';
    }

    //refer express to the app
    this.app = express();

    //express pugins
    this.app.use(bodyParser.json({limit: fileSize}));
    if(corsDo == true){
      this.app.use(cors());
    }

    let thisPort = 8080;

    if(port){
      thisPort = port;
    }

    //start the server
    this.app.listen(thisPort,()=>{
      common.success('server listening at http://localhost:' + thisPort);
    });

  }

};
