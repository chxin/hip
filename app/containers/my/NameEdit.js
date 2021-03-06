
'use strict';

import React,{Component} from 'react';

import {connect} from 'react-redux';
import backHelper from '../../utils/backHelper';
import {updateUser} from '../../actions/loginAction';
import NameEditView from '../../components/my/NameEditView';
import Toast from 'react-native-root-toast';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';
import {
  InteractionManager
} from 'react-native';
import PropTypes from 'prop-types';
var dismissKeyboard = require('dismissKeyboard');

class NameEdit extends Component{
  constructor(props){
    super(props);
    this.state={isFetching:false};
  }
  _showToast(){
    Toast.show(localStr('lang_my_des29'), {
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
    });
  }
  _save(text){
    dismissKeyboard();
    text = text.replace(/(^\s*)|(\s*$)/g, "");
    if (!text || text.length===0) {
      this._showToast();
      return;
    }
    if (this.props.user.get('RealName')===text) {
      this.props.navigator.pop();
      return;
    }
    this.setState({isFetching:true});
    this.props.updateUser({
      'Id':this.props.user.get('Id'),
      'Name':this.props.user.get('Name'),
      'RealName':text,
      'Telephone':this.props.user.get('Telephone'),
      'Email':this.props.user.get('Email')});
  }

  componentDidMount() {
    backHelper.init(this.props.navigator,this.props.route.id);
  }
  componentWillReceiveProps(nextProps) {
    // console.warn('componentWillReceiveProps...',nextProps.user.get('RealName'),this.props.user.get('RealName'));
    if (this.props.user && (nextProps.user.get('RealName')!==this.props.user.get('RealName')) ){
      this.setState({isFetching:false});
      InteractionManager.runAfterInteractions(()=>{
        this.props.navigator.pop();
      });
    }
  }

  componentWillUnmount() {
    backHelper.destroy(this.props.route.id);
  }

  render() {
    return (
      <NameEditView
        save={(text)=>this._save(text)}
        user={this.props.user}
        isFetching={this.state.isFetching}
        onBack={()=>{this.props.navigator.pop()}} />
    );
  }
}

NameEdit.propTypes = {
  navigator:PropTypes.object,
  route:PropTypes.object,
  user:PropTypes.object,
  updateUser:PropTypes.func.isRequired,
  onPostingCallback:PropTypes.func,
}

function mapStateToProps(state) {
  return {
    user:state.user.get('user'),
  };
}

export default connect(mapStateToProps,{updateUser})(NameEdit);
