const common = require('./common');
const jwt = require('jsonwebtoken');
const fs = require('fs');

module.exports = {

  keys:{
    private:null,
    public:null
  },

  loadKeys : function(private,public){

    if(private == null){
      return common.error('not_found-private_key');
    }

    let checkPrivate = fs.existsSync(private);

    if(checkPrivate == false){
      return common.error('invalid_path-private_key');
    }

    let privateKey = fs.readFileSync(private,'utf8');

    this.keys.private = privateKey;

    if(public == null){
      return true;
    }

    let checkPublic = fs.existsSync(public);

    if(checkPublic == false){
      return common.error('invalid_path-private_key');
    }

    let publicKey = fs.readFileSync(public,'utf8');

    this.keys.public = publicKey;

    return true;

  },

  createToken : function(payload,secret,signOptions){

    if(secret == null){
      if(this.keys.private == null){
        return common.error('not_found,private_key');
      } else {
        secret = this.keys.private;
      }
    }
    if(payload == null){
      return common.error('not_found-payload');
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

    return new Promise((resolve,reject)=>{

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

  verify : function(token,secret,signOptions){

    if(secret == null){
      if(this.keys.public == null){
        return common.error('not_found,public_key');
      } else {
        secret = this.keys.public;
      }
    }
    if(token == null){
      return common.error('not_found-token');
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
        if(signOptions.expiresIn){
          if(typeof(signOptions.expiresIn) == 'string'){
            options['expiresIn'] = signOptions.expiresIn;
          }
        }
      }
    }

    return new Promise((resolve,reject)=>{

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

  },

  verifyRequest : function(req,secret,signOptions){

    return new Promise(async (resolve,reject)=>{

      let error;

      if(req == null || req == undefined){
        error = 'not_found-req_object';
        reject(error);
      }

      if(secret == null || secret == undefined){
        error = 'not_found-public_key';
        reject(error);
      }

      if(typeof(secret) !== 'string'){
        error = 'invalid-public_key_data_type';
        reject(error);
      }

      if(typeof(req) !== 'object'){
        error = 'invalid-req_object_data_type';
        reject(error);
      }

      if(!req.header('x-wet-token')){
        error = 'not_found-x_wet_token';
        reject(error);
      }

      let token = req.header('x-wet-token');

      this.verify(secret,token,signOptions)
      .then((decoded)=>{

        if(!decoded.ip){
          error = 'no_valid_ip_found';
          reject(error);
        }

        if(decoded.ip !== req.ip){
          error = 'ip_spoofing';
          reject(error);
        }

        if(decoded.ip == req.ip){
          resolve(decoded);
        }

      })
      .catch((error)=>{
        reject(error);
      });

    });

  }

};
