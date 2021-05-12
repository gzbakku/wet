"use strict";

const common = require('./common');
const log = true;
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

module.exports = {

  app:null,

  init : function(port,corsDo,fileSize,baseDir){

    return new Promise((resolve,reject)=>{

      if(this.app !== null){
        resolve();
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
      if(baseDir){
        this.app.use(express.static(baseDir));
      }

      //start the server
      this.app.listen(port,()=>{
        resolve();
        common.success('server listening at http://localhost:' + port);
      });

    });

  }

};
