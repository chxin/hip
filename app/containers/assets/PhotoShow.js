
'use strict';

import React,{Component} from 'react';
import {InteractionManager,View,Platform} from 'react-native';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';
import backHelper from '../../utils/backHelper';
import PhotoShowView from '../../components/assets/PhotoShowView';
import {checkFileNameIsImage} from '../../utils/fileHelper.js';
import Immutable from 'immutable';

class PhotoShow extends Component{
  constructor(props){
    super(props);
    // console.warn('PhotoShow',this.props.index);
    this.state = {currIndex:this.props.index};
  }
  _gotoDetail(rowData,rowId){
  }
  _onPageChange(index){
    this.setState({currIndex:String(index)});
  }
  _onRemoveItem()
  {
    // console.warn('will remove item index:',this.state.currIndex,this.props.arrPhotos.size);
    this.props.onRemove(this.props.arrPhotos.get(this.state.currIndex));
    // if(Platform.OS === 'android'){
      // this.props.navigator.pop();
    // }
  }
  componentDidMount() {
    backHelper.init(this.props.navigator,this.props.route.id);
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.arrPhotos !== this.props.arrPhotos){
      console.warn('componentWillReceiveProps',this.state.currIndex,nextProps.arrPhotos.size);
      var nIndex = parseInt(this.state.currIndex);
      if (nIndex >= nextProps.arrPhotos.size) {
        nIndex=nextProps.arrPhotos.size-1;
      }
      // else {
      //   if (nIndex>=1) {
      //     nIndex--;
      //   }
      // }
      this.setState({currIndex:String(nIndex)});
      if (nextProps.arrPhotos.size===1) {
        this.setState({currIndex:'0'});
      }else if (nextProps.arrPhotos.size===0) {
        // if(Platform.OS === 'ios'){
          this.props.navigator.pop();
        // }
      }
    }
  }
  componentWillUnmount() {
    backHelper.destroy(this.props.route.id);
  }
  render() {
    // console.warn('ready to render',this.state.currIndex,this.props.arrPhotos.size);
    // console.warn('photos count',this.props.arrPhotos.size,this.state.currIndex);
    return (
      <PhotoShowView
        data={this.props.arrPhotos}
        index={this.state.currIndex}
        type={this.props.type}
        thumbImageInfo={this.props.thumbImageInfo}
        checkAuth={this.props.checkAuth}
        canEdit={this.props.canEdit}
        onRemoveItem={()=>this._onRemoveItem()}
        onRowClick={(rowData,rowId)=>this._gotoDetail(rowData,rowId)}
        onPageChange={(index)=>this._onPageChange(index)}
        onBack={()=>this.props.navigator.pop()} />
    );
  }
}

PhotoShow.propTypes = {
  navigator:PropTypes.object,
  route:PropTypes.object,
  user:PropTypes.object,
  hierarchyId:PropTypes.number,
  onRemove:PropTypes.func,
  checkAuth:PropTypes.func,
  arrPhotos:PropTypes.object.isRequired,//immutable
  thumbImageInfo:PropTypes.object.isRequired,
  index:PropTypes.string.isRequired,
  type:PropTypes.string.isRequired,
  canEdit:PropTypes.bool,
}

function mapStateToProps(state,ownProps) {
  var ticketLog = state.ticket.ticketLog;
  var assetLog = state.asset.assetLog;
  var Pictures = ownProps.arrPhotos;
  var feedback = state.feedBack;
  var recordLog = state.asset.mRecordDetail;
  var structure = state.asset.strucPhotos;
  if (ownProps.type==='assetLogPhoto') {
    Pictures = assetLog.get('Pictures');
  }else if (ownProps.type === 'ticketLogPhoto') {
    Pictures = ticketLog.get('Pictures');
  }else if (ownProps.type==='feedbackLogPhoto') {
    Pictures = feedback.get('Pictures');
  }else if (ownProps.type==='recordLog') {
    Pictures = recordLog.getIn(['data','RemFiles']);
  }else if (ownProps.type==='structure') {
    Pictures = structure.getIn(['data','Pictures']);
  }
  var arrImages=[];
  Pictures.map((item,index)=>{
    if(checkFileNameIsImage(item.get('FileName')))
    {
      arrImages.push(item);
    }
  });
  return {
    user:state.user.get('user'),
    arrPhotos:Immutable.fromJS(arrImages),
    type:ownProps.type,
  };
}

export default connect(mapStateToProps,{})(PhotoShow);
