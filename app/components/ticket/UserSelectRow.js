'use strict'
import React,{Component} from 'react';

import {
  View,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';

import Text from '../Text';
import TouchFeedback from '../TouchFeedback';
import Icon from '../Icon.js';
import {BLACK,GRAY,GREEN} from '../../styles/color';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';

export default class UserSelectRow extends Component{
  constructor(props){
    super(props);
  }
  _getNavIcon(){
    var {rowData} = this.props;
    if(!!rowData.get('isSelect')){
      return (
        <View style={styles.selectView}>
          <Icon type='icon_check' size={10} color='white' />
        </View>
      )
    }else {
      return (
        <View style={styles.unSelectView}>
        </View>
      )
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    if(nextProps.rowData.get(this.props.selKey) === this.props.rowData.get(this.props.selKey)
        && nextProps.rowData.get('isSelect') === this.props.rowData.get('isSelect')){
      return false;
    }
    return true;
  }
  _prefixInteger(num, n) {
    return (Array(n).join(0) + num).slice(-n);
  }
  _formatValue(value)
  {
    if (!value) {
      value=0;
    }
    // return this._prefixInteger(value,3);
    return value;
  }
  render(){
    var {rowData} = this.props;
    return (
      <View style={{flex:1,backgroundColor:'white'}}>
        <TouchFeedback style={{flex:1}} onPress={()=>{
              this.props.onRowClick(rowData);
            }}>
          <View style={styles.rowContent}>
            {this._getNavIcon()}
            <View style={{flex:1}}>
              <Text numberOfLines={1} style={styles.titleText}>
                {this.props.rowData.get(this.props.selKey)}
              </Text>
            </View>
            <View style={{flexDirection:'row'}}>
              {this.props.rowData.get('InProcessTicketCount')===null?null:<Text numberOfLines={1} style={styles.subTitleText}>
                {localStr('lang_ticket_going')+' : '+this._formatValue(this.props.rowData.get('InProcessTicketCount'))}
              </Text>}
              {this.props.rowData.get('NotStartedTicketCount')===null?null:<Text numberOfLines={1} style={styles.subTitleText}>
                {localStr('lang_ticket_not_start')+' : '+this._formatValue(this.props.rowData.get('NotStartedTicketCount'))}
              </Text>}
            </View>
          </View>
        </TouchFeedback>
      </View>
    );
  }
}

UserSelectRow.propTypes = {
  user:PropTypes.object,
  onRowClick:PropTypes.func.isRequired,
  rowData:PropTypes.object.isRequired,
  selKey:PropTypes.string.isRequired,
  sectionId:PropTypes.number,
  rowId:PropTypes.number,
}

var styles = StyleSheet.create({
  rowContent:{
    height:49,
    flexDirection:'row',
    // justifyContent:'space-between',
    alignItems:'center',
    backgroundColor:'white',
    paddingHorizontal:16,
  },
  titleText:{
    marginLeft:16,
    fontSize:17,
    color:BLACK
  },
  subTitleText:{
    marginLeft:16,
    fontSize:13,
    color:BLACK,
    width:75,
  },
  selectView:{
    width:18,
    height:18,
    borderRadius:10,
    backgroundColor:GREEN,
    justifyContent:'center',
    alignItems:'center'
  },
  unSelectView:{
    width:18,
    height:18,
    borderRadius:10,
    borderColor:GRAY,
    borderWidth:1,
    // marginRight:16,
    justifyContent:'center',
    alignItems:'center'
  },
});
