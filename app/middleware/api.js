

import storage from '../utils/storage';
import {Platform} from 'react-native';
import appInfo from '../utils/appInfo.js';


export var TOKENHEADER = "disco-token";
export var HEADERDEVICEID = "disco-deviceid";

// var _BASEURL = "http://mobile.poptest.energymost.com/pop/v2.8.0/Mobile/api/";

var _BASEURL = 'http://mobiletest.mm.energymost.com/api/';
// var _BASEURL = "http://114.55.26.137/test/hiphop/mobilehost/api/";

//dev
// var _BASEURL = 'http://121.41.53.66/pop/v3.9.0/Mobile/api/';
//xianjing
// var _BASEURL = 'http://10.177.122.73/mobile/api/';
//pro
// var _BASEURL = "http://mobile.fm.energymost.com/api/";

export function getBaseUri() {
  return _BASEURL;
}

var defaultFetch = async function(options){

  // var isProd = await storage.getItem('prod');
  // console.warn('appInfo.get().prod',appInfo.get().prod);
  var baseUrl = _BASEURL;
  if(appInfo.get().prod){
    baseUrl = appInfo.get().prod;
    _BASEURL = baseUrl;
  }


  var token = await storage.getToken();
  storage.createDeviceId();
  var deviceid=await storage.getDeviceId();
  // console.log('token,,,deviceid',token,deviceid);
  var headers = {
    "Content-Type":"application/json",
    'Accept': 'application/json',
  };
  if(token){
    headers[TOKENHEADER] = token;
    headers[HEADERDEVICEID]=deviceid;
  }

  var os = Platform.OS;
  var {versionName} = appInfo.get();
  var userName=await storage.getItem('USERNAMEKEY');
  // console.log('username2',userName);
  var url = baseUrl + options.url + `?platform=${os}&version=${versionName}&username=${userName}`;

  console.log('rockurl:%s',url);
  // console.log(headers);
  // console.log(options);

  return fetch(url,
    {
      method:options.verb,
      headers,
      body: JSON.stringify(options.body)
    })
    .then((response)=>{
      if(response.status === 204){
        return new Promise((resolve)=>{
          resolve({Result:true,Error:'0'});
        })
      }else if(response.status === 403){
        return new Promise((resolve)=>{
          resolve({Result:false,Error:'403'});
        })
      }
      return response.json()
    })
    .then( async (data)=>{
      // console.log(data);
      //62xpDx27yFJgJAoEXF8L/va6pTLra0dNg3hQlwRinFI=

      // console.log('response data');
      // console.log(data);
      if(!token){

        var currentToken = null;

        if(data && data.Result && data.Result.Token){
          currentToken = data.Result.Token;

        }
        if(currentToken){
          return data;
        }
        else{
          //for generate auth code or delete something
          //for upgrade version
          if(data.Result === true || data.Error === '0'){
            return data.Result;
          }
          return Promise.reject(data);
        }

      }
      else {
        if(data && data.Error === '0'){
          return data;
        }
        else{
          return Promise.reject(data);
        }
      }
    });
}



export default (store) => (next) => (action) => {
  // console.log(action);
  let {url,body,types} = action;
  console.log('url:%s',url);
  if (typeof url === 'undefined') {
    return next(action);
  }


  const [requestType, successType, failureType] = types;
  next(Object.assign({}, action, { type: requestType }));

  return defaultFetch({url,body,verb:body?'post':"get"}).then((data)=>{
    next(Object.assign({},action,{type:successType,response:data}));
  },(error)=>{
    // console.log('error');
    // console.log(error);
    // var newError = {};
    // if(error.Error === '-1'){
    //   newError = {errorCode:'-1'};
    // }
    // else{
    //   newError = {
    //     errorCode:error.Error.substr(7),
    //     args:error.Message
    //   };
    // }

    // console.warn('error',Object.getOwnPropertyNames(error),error['message']);
    // if(Object.getOwnPropertyNames(error))

    // console.log(newError);
    next(Object.assign({},action,{type:failureType,error}));
  });

};
