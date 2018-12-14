"use strict";

const log = false;
const chalk = require('chalk');
const clog = console.log;

module.exports = {

  tell : function(message,doI){
    if(doI == true || log == true){
      clog(chalk.cyan('>>> ' + message));
    }
    return true;
  },

  error : function(error){
    clog(chalk.red('!!! ' + error));
    return false;
  },

  inform : function(message){
    clog(chalk.blueBright('>>> ' + message));
    return true;
  },

  success : function(message){
    clog(chalk.underline.greenBright('@@@ ' + message));
    return true;
  }

};
