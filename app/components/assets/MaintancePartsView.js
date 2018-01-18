
'use strict';
import React,{Component} from 'react';

import {
  View,
} from 'react-native';
import PropTypes from 'prop-types';

import Toolbar from '../Toolbar';
import List from '../List.js';
import SelectRow from './MaintanceSelectRow.js';
import Section from '../Section.js';
import Text from '../Text';
import {GRAY} from '../../styles/color';

export default class MaintancePartsView extends Component{
  constructor(props){
    super(props);
  }
  _renderSection(sectionData,sectionId,sectionIndex){
    var sectionTitle = this.props.sectionData.get(sectionId);
    if(!sectionTitle) return null;
    return (
      <Section text={sectionTitle} />
    );
  }
  _renderRow(rowData,sectionId,rowId){
    return (
      <SelectRow selKey='RealName' rowData={rowData} onRowClick={this.props.onRowClick} />
    );
  }
  _getContentView()
  {
    // if (!this.props.data&&!this.props.isFetching) {
    //   return (
    //     <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
    //       <Text style={{fontSize:17,color:GRAY}}>{'请先选择资产范围'}</Text>
    //     </View>
    //   )
    // }else {
      return (
        <List
          isFetching={this.props.isFetching}
          listData={this.props.data}
          hasFilter={false}
          currentPage={1}
          totalPage={1}
          emptyText='无相关信息'
          onRefresh={this.props.onRefresh}
          renderRow={(rowData,sectionId,rowId)=>this._renderRow(rowData,sectionId,rowId)}
          renderSectionHeader={(sectionData,sectionId)=>this._renderSection(sectionData,sectionId)}
        />
      );
    // }
  }
  render() {
    var disable = !this.props.data || !this.props.selectUsers || this.props.selectUsers.size===0;
    var actions = [{title:'完成',show:'always',disable:disable}];
    return (
      <View style={{flex:1,backgroundColor:'white'}}>
        <Toolbar title={this.props.title}
          navIcon="back"
          actions={actions}
          onIconClicked={()=>this.props.onBack()}
          onActionSelected={[()=>{
            this.props.onSave();
          }]}
        />
      {this._getContentView()}
      </View>
    );
  }
}

MaintancePartsView.propTypes = {
  navigator:PropTypes.object,
  title:PropTypes.string,
  onBack:PropTypes.func.isRequired,
  onSave:PropTypes.func.isRequired,
  user:PropTypes.object,
  onRowClick:PropTypes.func.isRequired,
  isFetching:PropTypes.bool.isRequired,
  data:PropTypes.object,
  sectionData:PropTypes.object,
  selectUsers:PropTypes.object,
  onRefresh:PropTypes.func.isRequired,
}
