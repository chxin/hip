
'use strict';
import React,{Component} from 'react';

import {
  View,
  StyleSheet,
  TextInput,
  Platform,
  Text,
  ScrollView

} from 'react-native';
import PropTypes from 'prop-types';
import Toolbar from '../Toolbar';
import KeyboardSpacer from '../KeyboardSpacer.js';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';

import {GRAY,BLACK} from '../../styles/color.js';
export default class TaskDesEditView extends Component{
  constructor(props){
    super(props);
    var text = this.props.content;
    this.state = {text:text};
  }
  _logChanged(text){
    if (this.props.editable) {
      this.setState({text});
      this.props.dataChanged(text);
    }
  }
  _getContentView(lines,content)
  {
    var maxLength=this.props.maxLength;
    if (!maxLength) {
      maxLength=100000;
    }
    var placeholdText=this.props.placeholdText;
    if (this.props.editable) {
      return(
        <View style={{flex:1}}>
          <TextInput
            style={styles.input}
            autoFocus={this.props.content ? false : true}
            underlineColorAndroid={'transparent'}
            textAlign={'left'}
            multiline={true}
            editable={Platform.OS === 'ios'?this.props.editable:true}
            numberOfLines={lines}
            maxLength={maxLength}
            placeholderTextColor={GRAY}
            textAlignVertical={'top'}
            placeholder={placeholdText}
            onChangeText={(text)=>this._logChanged(text)}
            value={content} />
        </View>
      )
    }else {
      return(
        <View style={{flex:1}}>
          <ScrollView style={{flex:1}}>
            <Text style={styles.input}>
              {content}
            </Text>
          </ScrollView>
        </View>
      )
    }
  }
  render() {
    var lines = 0;
    var content = this.state.text;
    if (!!content) {
      content.split('\n').forEach((item)=>{
        lines++;
      });
    }
    if (lines===0) {
      lines=1;
    }
    var disable = !content || content.length === 0;
    var actions = [{title:localStr('lang_common_finish'),show:'always',disable:disable}];
    if(Platform.OS === 'android'){
      actions = [{title:localStr('lang_common_finish'),show:'always'}];
    }
    if (!this.props.editable) {
      actions=[];
    }
    return (
      <View style={{flex:1,backgroundColor:'white'}}>
        <Toolbar
          title={this.props.title}
          navIcon="back"
          actions={actions}
          onIconClicked={this.props.onBack}
          onActionSelected={[()=>{
            this.props.onSave(content);
          }]}
          />
        {this._getContentView(lines,content)}
        <KeyboardSpacer />
      </View>
    );
  }
}

TaskDesEditView.propTypes = {
  navigator:PropTypes.object,
  title:PropTypes.string,
  content:PropTypes.string,
  user:PropTypes.object,
  onBack:PropTypes.func.isRequired,
  onSave:PropTypes.func.isRequired,
  editable:PropTypes.bool,
  dataChanged:PropTypes.func.isRequired,
}

var styles = StyleSheet.create({
  input:{
    flex:1,
    justifyContent:'flex-start',
    alignItems:'flex-start',
    textAlignVertical:'top',
    fontSize:16,
    color:'#353535',
    padding:0,
    margin:16,
    // height:48,
  },
  button:{
    // marginTop:20,
    height:48,
    flex:1,
    marginHorizontal:16,
    borderRadius:6,

  },
});
