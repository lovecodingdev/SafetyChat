import React, { Component } from 'react';
import {View, TouchableHighlight, Image, AsyncStorage, Alert} from 'react-native'
import { NavigationActions } from 'react-navigation'
import {responsiveHeight, responsiveWidth} from 'react-native-responsive-dimensions'
import {Images} from '../theme'
import {ifIphoneX} from 'react-native-iphone-x-helper'
import firebase from 'react-native-firebase'
import AppData from '../components/AppData'

export default class Header extends Component {
    logout() {
        Alert.alert(
            'Logout',
            'Do you really want to logout?',
            [
                {
                    text: 'Ok', onPress: async () => {
                        let companycode = await AppData.getItem('Companycode')
                        let username = await AppData.getItem('username')
                        console.log("logout companycode", companycode)
                        console.log("logout username",username)
                        firebase.database().ref(companycode+'/users/'+username).remove().then(()=>{
                            console.log("remove user!")
                            AsyncStorage.clear().then(() => this.props.prop.reset([NavigationActions.navigate({ routeName: 'CheckcodeScreen' })], 0))
                        })
                    }
                },
                {
                    text: 'Cancel',
                    onPress: () => console.log('cancel'),
                    style: 'cancel',
                },
            ],
            {cancelable: false},
        )
    }
       
    render() {
      return(
        <View style={{...ifIphoneX({height: 80}, {height: 60}), width: responsiveWidth(100), backgroundColor: '#000', alignItems: 'center', flexDirection: 'row'}}>
            <TouchableHighlight onPress={()=>{this.props.prop.goBack()}} style={{width: responsiveWidth(10), height:40, ...ifIphoneX({marginTop: 40}, {marginTop: 20}), marginLeft: 5}}>
                <Image source={Images.back} style={{width: 30, height: 30, marginTop: 5, tintColor: '#fff'}}></Image>
            </TouchableHighlight>
            <TouchableHighlight onPress={()=>{this.props.prop.navigate('HomeScreen')}} style={{width: responsiveWidth(80), height: 40, ...ifIphoneX({marginTop: 40}, {marginTop: 20}), alignItems: 'center'}}>
                <Image source={Images.home} style={{width: 30, height: 30, marginTop: 5, tintColor: '#fff'}}></Image>
            </TouchableHighlight>
            <TouchableHighlight onPress={this.logout.bind(this)} style={{width: responsiveWidth(10), height: 40, ...ifIphoneX({marginTop: 40}, {marginTop: 20}), marginRight: 5}}>
                <Image source={Images.logout} style={{width: 30, height: 30, marginTop: 5, tintColor: '#fff'}}></Image>
            </TouchableHighlight>
        </View>
        );
    }
}