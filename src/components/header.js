import React, { Component } from 'react';
import {View, TouchableHighlight, Image, AsyncStorage, Alert} from 'react-native'
import {responsiveHeight, responsiveWidth} from 'react-native-responsive-dimensions'
import {Images} from '../theme'
import {ifIphoneX} from 'react-native-iphone-x-helper'

export default class Header extends Component {
    render() {
      return(
        <View style={{...ifIphoneX({height: 80}, {height: 60}), width: responsiveWidth(100), backgroundColor: '#000', alignItems: 'center', flexDirection: 'row'}}>
            <TouchableHighlight onPress={()=>{ global.mScreen = 'Home'; this.props.prop.goBack()}} style={{width: responsiveWidth(10), height:40, ...ifIphoneX({marginTop: 40}, {marginTop: 20}), marginLeft: 5}}>
                <Image source={Images.back} style={{width: 30, height: 30, marginTop: 5, tintColor: '#fff'}}></Image>
            </TouchableHighlight>
            <TouchableHighlight onPress={()=>{this.props.prop.navigate('HomeScreen')}} style={{width: responsiveWidth(80), height: 40, ...ifIphoneX({marginTop: 40}, {marginTop: 20}), alignItems: 'center'}}>
                <Image source={Images.home} style={{width: 30, height: 30, marginTop: 5, tintColor: '#fff'}}></Image>
            </TouchableHighlight>
            <TouchableHighlight onPress={()=>{this.props.prop.navigate('MypanelScreen')}} style={{width: responsiveWidth(10), height: 40, ...ifIphoneX({marginTop: 40}, {marginTop: 20}), marginRight: 5}}>
                <Image source={Images.admin} style={{width: 30, height: 30, marginTop: 5, tintColor: '#fff'}}></Image>
            </TouchableHighlight>
        </View>
        );
    }
}