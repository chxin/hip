'use strict'

import React,{Component} from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';

import Text from '../Text';
import {GRAY,BLACK,ALARM_RED} from '../../styles/color';
import moment from 'moment';
import Icon from '../Icon.js';
import TouchFeedback from '../TouchFeedback';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';

export default class MaintainRecordRow extends Component{
  constructor(props){
    super(props);
  }
  _getPrimaryContent(data){
    var types=[{'Code':2,'Type':localStr('lang_record_des09')},{'Code':4,'Type':localStr('lang_record_des10')},{'Code':8,'Type':localStr('lang_record_des11')},
    {'Code':16,'Type':localStr('lang_record_des12')},{'Code':32,'Type':localStr('lang_record_des13')},{'Code':1,'Type':localStr('lang_record_des14')}];
    var results=[localStr('lang_record_des15'),localStr('lang_record_des16'),localStr('lang_record_des17')];
    var strJudge='';
    types.forEach((item)=>{
      if (item.Code===data.get('FaultJudgeType')) {
        strJudge=item.Type;
        // if (item.Code===1) {
        //   strJudge=data.get('FaultJudgeText');
        // }
      }
    });
    var strResult='';
    var numRes=data.get('DealResult');
    if (numRes>=1&&numRes<=results.length) {
      strResult=results[numRes-1];
    }
    return (
      <View style={styles.content}>
        <Text numberOfLines={1} style={styles.alarmText}>{data.get('Parts')}</Text>
        <View style={{flexDirection:'row',marginTop:7}}>
          <View style={{flexDirection:'row',alignItems:'center'}}>
            <Text numberOfLines={1} style={[styles.locationText,{marginRight:16}]}>{strJudge}</Text>
          </View>
          <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
            <Text numberOfLines={1} style={[styles.locationText]}>{strResult}</Text>
          </View>
        </View>
      </View>
    )
  }
  _getTime(data){
    var time = moment(data.get('MaintainTime'));
    if(time.isSame(moment(),'day')){
      return time.format('HH:mm');
    }
    else {
      return time.format('MM-DD');
    }
  }
  render(){
    var {rowData} = this.props;
    return (
      <View style={{flex:1,backgroundColor:'white'}}>
        <TouchFeedback onLongPress={()=>this.props.onRowLongPress(rowData)} onPress={()=>this.props.onRowClick(rowData)}>
          <View style={[styles.row,styles.rowHeight]}>
            <View style={styles.rowLeft}>
              {this._getPrimaryContent(rowData)}
            </View>
            <View style={[{paddingTop:16,width:80},styles.rowHeight]}>
              <View style={{flexDirection:'row',justifyContent:'flex-end'}}>
                <Text style={styles.timeText}>{this._getTime(rowData)}</Text>
              </View>
              <View style={{flex:1,marginTop:7}}>
                <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end'}}>
                  <Text numberOfLines={1} style={[styles.timeText,{fontSize:14}]}>{rowData.get('MaintainPerson')}</Text>
                </View>
              </View>
            </View>
          </View>
        </TouchFeedback>
      </View>
    );
  }
}

MaintainRecordRow.propTypes = {
  user:PropTypes.object,
  onRowClick:PropTypes.func.isRequired,
  rowData:PropTypes.object.isRequired,
  onRowLongPress:PropTypes.func.isRequired,
}

var styles = StyleSheet.create({
  rowHeight:{
    height:68
  },
  row:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    backgroundColor:'white',
    padding:16,
    overflow:'hidden'
  },
  rowLeft:{
    flexDirection:'row',
    flex:1,
  },
  content:{
    flex:1,
    // backgroundColor:'red'
  },
  level:{
    width:44,
    height:44,
    borderRadius:22,
    marginRight:16,
    justifyContent:'center',
    alignItems:'center'
  },
  levelText:{
    fontSize:11,
    color:'white'
  },
  unSecuredAlarm:{
    backgroundColor:ALARM_RED
  },
  securedAlarm:{
    backgroundColor:GRAY
  },
  alarmText:{
    fontSize:16,
    color:BLACK
  },
  locationText:{
    fontSize:14,
    color:GRAY,
  },
  timeText:{
    fontSize:12,
    color:GRAY
  },
  iconTicket:{
    width:18,
    height:18,
    // paddingRight:10,
    justifyContent:'center',
    alignItems:'center'
  },
});
