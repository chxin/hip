
'use strict';
import React,{Component} from 'react';
import {
  ListView,
  InteractionManager,
} from 'react-native';
import PropTypes from 'prop-types';
import {Navigator} from 'react-native-deprecated-custom-components';

import {connect} from 'react-redux';
import backHelper from '../../utils/backHelper';

import {loadAlarm,filterDidChanged,firstPage,nextPage,clearFilter} from '../../actions/alarmAction';
import MaintainRecordsView from '../../components/assets/MaintainRecordsView.js';
import AlarmFilter from '../alarm/AlarmFilter';
import AlarmDetail from '../alarm/AlarmDetail';
import notificationHelper from '../../utils/notificationHelper.js';
import Immutable from 'immutable';

class MaintainRecords extends Component{
  constructor(props){
    super(props);
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var data = props.alarm.get('data');
    if (data) {
      data = data.toArray();
      this.state = { dataSource:this.ds.cloneWithRows(data)};
    }else {
      this.state = { dataSource:null};
    }
  }
  _loadAlarms(filter){
    console.warn('filter',filter.toJSON());
    this.props.loadAlarm(filter.toJSON());
  }
  _onPostingCallback(type){
    // InteractionManager.runAfterInteractions(() => {
      this._refreshOnFocus = true;
    // });
  }
  _filterClick(){
    this.props.navigator.push({id:'alarm_filter',component:AlarmFilter,sceneConfig:Navigator.SceneConfigs.FloatFromBottom});
  }
  _gotoDetail(alarmId,fromHex){
    this.props.navigator.push({
      id:'alarm_detail',
      component:AlarmDetail,
      barStyle:'light-content',
      passProps:{
        alarmId:alarmId,
        onPostingCallback:(type)=>{this._onPostingCallback(type)},
        fromHex
      }
    });
  }
  _onRefresh(){
    if (this.props.filter.get('CurrentPage')===1) {
      this._loadAlarms(this.props.filter);
    }else {
      this.props.firstPage();
    }
  }
  _checkPushNotification(){
    var alarmId = notificationHelper.getData('alarm');
    if(alarmId){
      this._gotoDetail(alarmId,true);
    }
  }
  _bindEvent(){
    var navigator = this.props.navigator;
    // console.warn('navigator',navigator);
    if (navigator) {
      var callback = (event) => {
        if(!event.data.route || !event.data.route.id || (event.data.route.id === 'main')){
          if(this._refreshOnFocus){
            this._onRefresh();
            this._refreshOnFocus = false;
          }
        }
      };
      // Observe focus change events from the owner.
      this._listener= navigator.navigationContext.addListener('didfocus', callback);
    }
  }
  componentDidMount() {
    InteractionManager.runAfterInteractions(()=>{
      if(!this.props.alarm.get('data')){
        this._loadAlarms(this.props.filter);
      }
      notificationHelper.register('alarm',()=>this._checkPushNotification());

    });
    // setInterval(()=>this._onRefresh(),10000);
    this._bindEvent();
    // backHelper.init(this.props.navigator,'alarm');
  }
  componentWillReceiveProps(nextProps) {
    var data = nextProps.alarm.get('data');
    var origData = this.props.alarm.get('data');
    // console.warn('componentWillReceiveProps...',data,origData);
    if((data !== origData) && data){// && data.size >= 1){
      this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

      InteractionManager.runAfterInteractions(()=>{
        this.setState({dataSource:this.ds.cloneWithRows(data.toArray())});
      });
    }

    if(this.props.filter !== nextProps.filter){
      //this is a hack for following senario
      //when back from filter page
      //sometimes list is empty
      //but when _loadAlarms included in runAfterInteractions it is fixed
      InteractionManager.runAfterInteractions(()=>{
        this._loadAlarms(nextProps.filter);
      });
    }
  }
  componentWillUnmount() {
    // backHelper.destroy('alarm');
    notificationHelper.resetData('alarm');
    notificationHelper.unregister('alarm');
  }
  render() {
    return (
      <MaintainRecordsView
        loadAlarm={()=>this._loadAlarm()}
        isFetching={this.props.alarm.get('isFetching')}
        listData={this.state.dataSource}
        hasFilter={this.props.hasFilter}
        nextPage={()=>this.props.nextPage()}
        clearFilter={()=>this.props.clearFilter()}
        currentPage={this.props.filter.get('CurrentPage')}
        onRefresh={()=>this._onRefresh()}
        totalPage={this.props.alarm.get('pageCount')}
        onFilterClick={()=>this._filterClick()}
        onRowClick={(rowData)=>this._gotoDetail(String(rowData.get('Id')),false)}/>
    );
  }
}

MaintainRecords.propTypes = {
  navigator:PropTypes.object,
  alarm:PropTypes.object,
  filter:PropTypes.object,
  hasFilter:PropTypes.bool,
  loadAlarm:PropTypes.func,
  firstPage:PropTypes.func,
  nextPage:PropTypes.func,
  clearFilter:PropTypes.func,
  filterDidChanged:PropTypes.func,
}


function mapStateToProps(state) {
  var alarmFilter = state.alarm.alarmFilter;
  return {
    alarm:state.asset.maintainRecordData,
    hasFilter: alarmFilter.get('hasFilter'),
    filter:alarmFilter.get('stable'),
  };
}

export default connect(mapStateToProps,{loadAlarm,filterDidChanged,firstPage,nextPage,clearFilter})(MaintainRecords);
