"use strict";

const common = require('./common');
const log = true;
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

let app;

module.exports = {

  app:app,

  init : function(port,corsDo,fileSize,baseDir){

    if(this.app !== null){
      return true;
    }
    if(!fileSize){
      fileSize = '2mb';
    }

    //refer express to the app
    app = express();

    //express pugins
    app.use(bodyParser.json({limit: fileSize}));
    if(corsDo == true){
      app.use(cors());
    }
    if(baseDir){
      app.use(express.static(baseDir));
    }

    let thisPort = 8080;

    if(port){
      thisPort = port;
    }

    //start the server
    app.listen(thisPort,()=>{
      common.success('server listening at http://localhost:' + thisPort);
    });

  }

};
