
'use strict';
import React,{Component} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import PropTypes from 'prop-types';

import Toolbar from '../Toolbar';
import StatableSelectorGroup from '../alarm/StatableSelectorGroup';
import StatableClickGroup from './StatableClickGroup';
import DateInputGroup from '../ticket/DateInputGroup';
import Button from '../Button';
import {GREEN,} from '../../styles/color.js';
import Loading from '../Loading';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';

export default class MaintainFilterView extends Component{
  constructor(props){
    super(props);
  }
  _renderSeparator(rowId){
    return (
      <View key={rowId} style={styles.sepView}></View>
    )
  }
  _renderRow(rowData){
    if(rowData === 0){
      return (
        <DateInputGroup
          title={localStr('lang_record_des01')}
          startTime={this.props.filter.get('StartTime')}
          endTime={this.props.filter.get('EndTime')}
          onChanged={(type,text)=>{
            this.props.filterChanged(type,text);
          }} />
      );
    }
    else if(rowData === 1){
      var strUsers=this.props.selectUsers.map((item,index)=>{
        var point=', ';
        if (index===(this.props.selectUsers.size-1)) {
          point='';
        }
        return item.get('RealName')+point;
      });
      if (!strUsers||strUsers.size===0) {
        strUsers=null;
      }
      // data={this.props.filter.get('MaintainPersons')}
      return (
        <StatableClickGroup
          title={localStr('lang_record_des02')}
          text={strUsers}
          placeholderText={localStr('lang_record_des03')}
          onRowClick={()=>{
            this.props.onSelectUsers();
          }}
          onChanged={(text)=>this.props.filterChanged('MaintainPersons',text)} />
      );
    }
    else if(rowData === 2){
      var strUsers=this.props.selectParts.map((item,index)=>{
        var point=', ';
        if (index===(this.props.selectParts.size-1)) {
          point='';
        }
        return item.get('RealName')+point;
      });
      if (!strUsers||strUsers.size===0) {
        strUsers=null;
      }
      // data={this.props.filter.get('Parts')}
      return (
        <StatableClickGroup
          title={localStr('lang_record_des04')}
          text={strUsers}
          placeholderText={localStr('lang_record_des05')}
          onRowClick={()=>{
            this.props.onSelectParts();
          }}
          onChanged={(text)=>this.props.filterChanged('Parts',text)} />
      );
    }
    else if(rowData === 3){
      return (
        <StatableSelectorGroup
          title={localStr('lang_record_des06')}
          data={this.props.codes}
          selectedIndexes={this.props.filter.get('FaultJudgeType')}
          onChanged={(index)=>this.props.filterChanged('FaultJudgeType',index)} />
      );
    }else if(rowData === 4){
      if (!this.props.bugResults || this.props.bugResults.length===0) {
        return null;
      }
      return (
        <StatableSelectorGroup
          title={localStr('lang_record_des07')}
          data={this.props.bugResults}
          selectedIndexes={this.props.filter.get('DealResult')}
          onChanged={(index)=>this.props.filterChanged('DealResult',index)} />
      );
    }
    return null;

  }
  componentWillReceiveProps(nextProps) {
  }
  _getListView()
  {
    var views=[0,1,2,3,4].map((item,index)=>{
      return (
        <View style={{}}>
          {this._renderRow(index)}
          {this._renderSeparator(index)}
        </View>
      )
    });
    return views;
  }
  render() {
    var list = null
    if(!this.props.isFetching){
      list = (
        <ScrollView style={{padding:16,paddingBottom:bottomHeight,backgroundColor:'transparent'}}>
          {this._getListView()}
        </ScrollView>
      )
    }
    else {
      list = (<Loading />);
    }
    return (
      <View style={{flex:1,backgroundColor:'white'}}>
        <Toolbar
          title={localStr('lang_record_des08')}
          navIcon="close"
          onIconClicked={this.props.onClose}
          actions={[{
            title:localStr('lang_alarm_filter'),
            show: 'always', showWithText:true}]}
            onActionSelected={[this.props.doFilter]}
          />
        {list}
      </View>
    );
  }
}

MaintainFilterView.propTypes = {
  filter:PropTypes.object,
  codes:PropTypes.array,
  bugCodes:PropTypes.object,
  bugResults:PropTypes.array,
  selectUsers:PropTypes.object,
  selectParts:PropTypes.object,
  doFilter:PropTypes.func.isRequired,
  isFetching:PropTypes.bool.isRequired,
  onClose:PropTypes.func.isRequired,
  filterChanged:PropTypes.func.isRequired,
  onSelectParts:PropTypes.func.isRequired,
  onSelectUsers:PropTypes.func.isRequired,
}

var bottomHeight = 72;

var styles = StyleSheet.create({
  sepView:{
    height:16,
    backgroundColor:'transparent'
  },
  bottom:{
    position:'absolute',
    left:0,
    right:0,
    bottom:0,
    flex:1,
    height:bottomHeight,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'white'
  },
  button:{
    // marginTop:20,
    height:43,
    flex:1,
    marginHorizontal:16,
    borderRadius:6,

  }
});
