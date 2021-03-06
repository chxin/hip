'use strict';

import {
  ASSET_CUSTOMER_LOAD_REQUEST,
  ASSET_CUSTOMER_LOAD_SUCCESS,
  ASSET_CUSTOMER_LOAD_FAILURE,
  BUILDING_EXPANDED_CHANGE,
  CUSTOMER_ASSET_RESET,
} from '../../actions/assetsAction.js';

import {
  ASSET_SELECT_CHANGED,
  ASSETS_USERS_REQUEST,
  ASSETS_USERS_SUCCESS,
  ASSETS_USERS_FAILURE
}from '../../actions/ticketAction.js';

import {LOGOUT_SUCCESS} from '../../actions/loginAction.js';

import Immutable from 'immutable';

var defaultState = Immutable.fromJS({
  data:null,
  sectionData:Immutable.fromJS([]),
  isFetching:false,
  selectAssets:Immutable.fromJS([]),
  isPosting:1,
});

function updateCountForBuildingsAsset(state)
{
  var sectionData = state.get('sectionData');
  var selectAssets = state.get('selectAssets');
  sectionData.forEach((building,index)=>{
    var arrDatas = building.get('allHierars');
    var sCount = 0;
    selectAssets.forEach((oldItem)=>{
      arrDatas.forEach((item)=>{
        if(oldItem.get('Id')===item.get('Id'))
          sCount++;
      });
    });
    sectionData = sectionData.update(index,(building)=>{
      building = building.set('sCount',sCount);
      return building;
    });
  });

  return state.set('sectionData',sectionData);
}

function updateBuildingsData(state,action) {
  var response = action.response.Result;
  var allElements = [];
  var allSecTitle=[];
  response.forEach((item)=>{
    allElements.push([]);
    item.isExpanded=true;

    var allHierars = [];
    allHierars.push({Id:item.Id,Name:item.Name,showType:2});
    _addSubElementToList(item.Children, allHierars, 3);
    item.allHierars = allHierars;
    allSecTitle.push(item);
  });
  // console.warn('updateBuildingsData...',allSecTitle.length,allSecTitle);
  var newState = state;
  newState = newState.set('sectionData',Immutable.fromJS(allSecTitle));
  newState = newState.set('isFetching',false);
  newState = newState.set('data',Immutable.fromJS(allElements));
  newState = updateCountForBuildingsAsset(newState);
  return newState;
}

function assetsSelectInfoChange(state,action){
  var newState = state;
  var {data:{type,value}} = action;
  if (type==='assetRange') {
    var sectionData = newState.get('sectionData');
    var index = sectionData.findIndex((item)=>item.get('Id')===value.get('Id'));
    sectionData = sectionData.update(index,(item)=>{
      if(!item.get('isExpanded'))
      {
        item = item.set('isExpanded',true);
      }else {
        item = item.set('isExpanded',false)
      }
      return item;
    });
    newState = newState.set('sectionData', sectionData);
  }else if (type==='assetSelect') {
    var {data:{type,value}} = action;
    var {rowData,sectionId,rowId} = value;
    var allElements = newState.getIn(['data',sectionId]);
    allElements = allElements.update(rowId,(item)=>{
      if(item.get('isSelect')===undefined || !item.get('isSelect'))
      {
        item = item.set('isSelect',true);
      }else {
        item = item.set('isSelect',false);
      }
      return item;
    });
    newState = newState.setIn(['data',sectionId], allElements);

    var arr = newState.get('selectAssets');
    var index = arr.findIndex((item)=>item.get('Id')===rowData.get('Id'));
    var isAdd = true;
    if (index!==-1) {
      arr = arr.delete(index);
      isAdd = false;
    }else {
      arr = arr.push(rowData);
      isAdd = true;
    }
    newState = newState.set('selectAssets', arr);

    var sectionData = newState.get('sectionData');
    sectionData = sectionData.update(sectionId,(building)=>{
      var sCount = building.get('sCount') | 0;
      sCount = isAdd?(sCount+1):(sCount-1);
      sCount = sCount<0?0:sCount;
      // console.warn('sCount',sCount);
      return building.set('sCount',sCount);
    });
    newState = newState.set('sectionData', sectionData);

  }else if (type==='assetInit') {
    // console.warn('ready to init assets:',value);
    newState = newState.set('selectAssets',value);
  }
  return newState;
}

function _addSubElementToList(arrObj, arrList, showType){
  arrObj.forEach(function(subEle){
    if (!!subEle) {
      subEle.showType=showType;
      arrList.push(subEle);
      if (!!subEle.Children) {
        _addSubElementToList(subEle.Children, arrList, showType+1)
      }
    }
  });
}

function changeAssetsHierarchyExpanded(state,action) {
  var {data:{buildingId}} = action;
  // let {url,body,types} = action;
  var newState = state;
  var sectionData = newState.get('sectionData');

  var index = sectionData.findIndex((item)=>item.get('Id')===buildingId);
  var res = sectionData.get(index).toJS();
  var allHierars = new Array();
  allHierars.push({Id:res.Id,Name:res.Name,Type:2,showType:2,SubType:res.SubType});
  _addSubElementToList(res.Children, allHierars, 3);
  var arrDatas = Immutable.fromJS(allHierars);

  var selectAssets = state.get('selectAssets');
  selectAssets.forEach((oldItem)=>{
    var index = arrDatas.findIndex((item)=>item.get('Id')===oldItem.get('Id'));
    if (index===-1) {
      return;
    }
    arrDatas = arrDatas.update(index,(item)=>{
      // console.warn(item.get('Name'),index,selectAssets);
      item = item.set('isSelect',true);
      return item;
    });
  });

  var isExpanded = false;
  if (sectionData.size===0) {
    // console.warn('sectionDataqewru',sectionData);
    return newState;
  }

  sectionData = sectionData.update(index,(item)=>{
    if(!item.get('isExpanded'))
    {
      item = item.set('isExpanded',true);
      isExpanded = true;
    }else {
      item = item.set('isExpanded',false);
      isExpanded = false
    }
    return item;
  });
  newState = newState.set('sectionData', sectionData);

  var allElements = newState.getIn(['data',index]);
  allElements = arrDatas;
  if (isExpanded) {
    newState = newState.setIn(['data',index], Immutable.fromJS([]));
  }else {
    newState = newState.setIn(['data',index], allElements);
  }

  newState = newState.set('isFetching', false);

  return newState;
}
function handleError(state,action) {
  // var {Result} = action.error;
  // if(!Result){
  //   action.error = '无相关权限';
  // }

  return state.set('isFetching',false);
}

export default function(state=defaultState,action){

  switch (action.type) {
    case ASSET_CUSTOMER_LOAD_REQUEST:
      return state.set('isFetching',true);
    case ASSET_CUSTOMER_LOAD_SUCCESS:
      return updateBuildingsData(state,action);
    case ASSET_CUSTOMER_LOAD_FAILURE:
      return handleError(state,action);
    case ASSET_SELECT_CHANGED:
      return assetsSelectInfoChange(state,action);
    case BUILDING_EXPANDED_CHANGE:
      return changeAssetsHierarchyExpanded(state,action);
    case ASSETS_USERS_REQUEST:
      return state.set('isPosting',1);
    case ASSETS_USERS_SUCCESS:
      return state.set('isPosting',2);
    case ASSETS_USERS_FAILURE:
      return state.set('isPosting',3);
    case CUSTOMER_ASSET_RESET:
    case LOGOUT_SUCCESS:
      return defaultState;
    default:

  }
  return state;
}
