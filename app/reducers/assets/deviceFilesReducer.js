'use strict';


import {
  DEVICE_FILES_REQUEST,
  DEVICE_FILES_SUCCESS,
  DEVICE_FILES_FAILURE,
  FILES_PHOTOS_CHANGED,
  DEVICE_EXIT,
  MAINTANCE_DATAS_RESET,
} from '../../actions/assetsAction.js';

// import {LOGOUT_SUCCESS} from '../../actions/loginAction.js';
import {commonReducer} from '../commonReducer.js';

import Immutable from 'immutable';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';

var defaultState = Immutable.fromJS({
  Pictures:null,
  pageCount:0,
  isFetching:false,
  sectionData:[],
  filter:{
    PageIndex:1,
    PageSize:20,
    Criteria:{
      HierarchyId:1,
      DirId:0,
      SearchKey:null
    }
  }
});


function generateName(pics,hierarchyId,userId) {
  //key image-ticket-log-${ticketId}-${userId}-time
  var time = new Date().getTime();
  return `image-structure-log-${hierarchyId}-${userId}-${time}-${pics.size}`;
}

function infoChanged(state,action1) {

  var {data:{hierarchyId,userId,type,action,value}} = action1;

  if(type === 'init'){
    return initDefaultState(state,action1);
  }
  if(!state) return state; //fast back #14581,must put behind init

  var newState = state;
  if(type === 'content'){
    return newState.set('Content',value);
  }
  else {
    var pics = newState.get('Pictures');
    if(action === 'add'){
      //[{name,uri}]
      value.forEach((item)=>{
        pics = pics.insert(0,
          Immutable.Map({
            PictureId:generateName(pics,hierarchyId,userId),
            uri:item.uri,
            Name:item.filename,
          }));
      })

    }
    else if (action === 'uploaded') {
      console.warn('uploaded');
      var index = pics.findIndex((item)=>item === value);
      pics = pics.update(index,(item)=>item.set('loaded',true));
    }
    else if (action === 'delete'){
      var index = pics.findIndex((item)=>item === value);
      pics = pics.delete(index);
    }
    // console.warn('pics',pics);
    return newState.set('Pictures',pics);
  }
}

function categoryAllDatas(state)
{
  var newState = state;
  var Items = newState.get('Pictures');

  // var listStatus1 = [];
  // var listStatus2 = [];
  // Items.forEach((item)=>{
  //   if (!item.get('SecureTime')) {
      // listStatus1.push(item);
  //   }else{
  //     listStatus2.push(item);
  //   }
  // });
  // var sectionTitle = [];
  // var allDatas = [];
  // sectionTitle.push('toolbar');
  // if (listStatus1.length>0) {
    // allDatas.push(listStatus1);
  // }
  // if (listStatus2.length>0) {
    // allDatas.push(listStatus2);
    // sectionTitle.push(localStr('lang_alarm_already_resolved'));
  // }
  // console.warn('categoryAllDatas',allDatas);
  newState=newState.set('sectionData',null).set('Pictures',Immutable.fromJS(Items));
  return newState;
}

function mergeData(state,action) {
  var response = action.response.Result;
  var newState = state;
  var page = action.body.PageIndex;

  var items = response.Items;
  // items.forEach((item)=>{
  //   item.Status.push({'Timestamp':item.AlarmTime, 'Content':localStr('lang_alarm_create'),User:'self'});
  //   if (!!item.SecureTime) {
  //     item.Status.unshift({'Timestamp':item.SecureTime, 'Content':localStr('lang_alarm_des0'),User:'self'});
  //   }
  // })

  if(page === 1){
    newState = newState.set('Pictures',Immutable.fromJS(response.Items));
  }
  else {
    var oldData = newState.get('Pictures');
    var newList = Immutable.fromJS(response.Items);
    if (oldData) {
      newList = oldData.push(...newList.toArray());
    }

    newState = newState.set('Pictures',newList);
  }
  // console.warn('alarmListReducer...',page,newState.get('Pictures').size);
  newState = categoryAllDatas(newState);
  newState = newState.set('pageCount',response.PageCount);
  newState = newState.set('isFetching',false);

  return newState;
}

function removeData(state,action) {
  var {body:{maintainRecordId}} = action;
  var newState=state;
  var oldData = newState.get('Pictures');
  if (oldData&&oldData.size>0) {
    var index = oldData.findIndex((item)=> item.get('AutoId') === maintainRecordId);
    if(index >= 0){
      oldData=oldData.remove(index);
    }
  }
  newState = newState.set('Pictures',oldData);
  newState = categoryAllDatas(newState);
  return newState;
}

function handleError(state,action) {
  var {Error} = action.error;
  // console.warn('handleError',action);

  switch (Error) {
    case '040001307022':
      action.error = localStr('lang_alarm_des1');
      state=state.set('Pictures',Immutable.fromJS([]));
      break;
  }
  return state.set('isFetching',false).set('Pictures',null);
}

export default commonReducer((state,action)=>{

  switch (action.type) {
    case DEVICE_FILES_REQUEST:
      return state.set('isFetching',true);
    case DEVICE_FILES_SUCCESS:
      return mergeData(state,action);
    case DEVICE_FILES_FAILURE:
      return handleError(state,action);
    case FILES_PHOTOS_CHANGED:
      return infoChanged(state,action);
    case DEVICE_EXIT:
    case MAINTANCE_DATAS_RESET:
      return defaultState;
  }
  return state;
},defaultState);
