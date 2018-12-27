"use strict";

const common = require('./common');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const log = false;

function verify(token,secret,signOptions){

  common.tell('verifying jwt',log);

  return new Promise((resolve,reject)=>{

    let error;

    if(secret == null){
      if(keys.public == null){
        error = 'not_found-public_key';
        reject(error);
      } else {
        secret = keys.public;
      }
    }
    if(token == null){
      error = 'not_found-token';
      reject(error);
    }

    let options = {
      algorithm :  "RS256",
      expiresIn : '1h',
    };

    if(signOptions){
      if(typeof(signOptions) == 'object'){
        //check issuer
        if(signOptions.issuer){
          if(typeof(signOptions.issuer) == 'string'){
            options['issuer'] = signOptions.issuer;
          }
        }
        //check expier in
        if(signOptions.expiresIn){
          if(typeof(signOptions.expiresIn) == 'string'){
            options['expiresIn'] = signOptions.expiresIn;
          }
        }
      }
    }

    jwt.verify(token,secret,options,(decoded,err)=>{

      if(decoded){
        let error = decoded;
        reject(decoded);
      } else {
        let data = err;
        resolve(data);
      }
    });

  });

}

let keys = {
  private:null,
  public:null
};

module.exports = {

  keys:keys,

  readKeys : function(privateKeyLocation,publicKeyLocation){

    if(!privateKeyLocation || !publicKeyLocation){
      return common.error('not_found-location-private/public-keys');
    }

    let checkPrivate = fs.existsSync(privateKeyLocation);
    if(!checkPrivate){
      return common.error('invalid_path-private_key');
    }
    let privateKey = fs.readFileSync(privateKeyLocation,'utf8');

    let checkPublic = fs.existsSync(publicKeyLocation);
    if(!checkPublic){
      return common.error('invalid_path-private_key');
    }
    let publicKey = fs.readFileSync(publicKeyLocation,'utf8');

    return loadKeys(private,public);

  },

  loadKeys : function(private,public){

    if(!privateKey || !publicKey){
      return common.error('not_found-private_key/public_key');
    }

    keys.private = private;
    keys.public = public;

    return common.success('auth keys loaded');

  },

  createToken : function(payload,secret,signOptions){

    common.tell('creating auth token',log);

    return new Promise((resolve,reject)=>{

      let error;

      if(secret == null){
        if(this.keys.private == null){
          error = 'not_found-private_key';
          reject(error);
        } else {
          secret = this.keys.private;
        }
      }
      if(payload == null){
        error = 'not_found-payload';
        reject(error);
      }

      let options = {
        algorithm :  "RS256",
        expiresIn : 3600,
      };

      if(signOptions){
        if(typeof(signOptions) == 'object'){
          //check issuer
          if(signOptions.issuer){
            if(typeof(signOptions.issuer) == 'string'){
              options['issuer'] = signOptions.issuer;
            }
          }
          //check expier in
          if(signOptions.hasOwnProperty('expiresIn') == true){
            if(typeof(signOptions.expiresIn) == 'string'){
              options['expiresIn'] = signOptions.expiresIn;
            }
          }
        }
      }

      jwt.sign(payload, secret, options,(token,err)=>{

        if(token){
          let error = token;
          reject(error);
        } else {
          token = err;
          resolve(token);
        }
      });

    });

  },

  verify : verify,

  verifyRequest : function(req,secret,signOptions){

    common.tell('verifying request',log);

    return new Promise(async (resolve,reject)=>{

      let error;

      if(!secret && keys.public == null){
        error = 'not_found-public_key';
        reject(error);
      }

      if(!req && typeof(req) !== 'object'){
        error = 'invalid-req_object_data_type';
        reject(error);
      }

      if(!req.header('td-wet-token')){
        error = 'not_found-x_wet_token';
        reject(error);
      }

      if(typeof(req.body) !== 'object'){
        error = 'invalid-req_body';
        reject(error);
      }

      let token = req.header('td-wet-token');

      verify(token,secret,signOptions)
      .then((decoded)=>{

        /*
        if(!decoded.ip){
          error = 'no_valid_ip_found';
          reject(error);
        }

        if(decoded.ip !== req.ip){
          error = 'ip_spoofing';
          reject(error);
        } else {
          resolve(decoded);
        }
        */

        resolve(decoded);

      })
      .catch((error)=>{
        reject(error);
      });

    });

  }

};
