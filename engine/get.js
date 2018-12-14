

module.exports = {

  ip : function(req){
    return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  }

}
