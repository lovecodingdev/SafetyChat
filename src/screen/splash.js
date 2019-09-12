import React, { Component } from 'react';
import {
  StyleSheet,
  ImageBackground,
  Image,
  } from 'react-native';
import { Images } from '../theme';
import { Container } from 'native-base';
import { responsiveWidth } from 'react-native-responsive-dimensions'
import API from '../components/api'
import firebase from 'react-native-firebase'
import AppData from '../components/AppData';

export default class splash extends Component {

    async componentDidMount() {
        firebase.notifications().setBadge(0)
        //App closed  notification taps
        const notificationOpen = await firebase.notifications().getInitialNotification()
        if (notificationOpen) {
            // App was opened by a notification
            const notification = notificationOpen.notification
            notification._data.group == '1' ? name = '123group' : name = notification._data.fromname
            this.props.navigation.navigate({routeName:'ChatScreen', params: {name: name}, key: 'chat'})
        }

        //token refresh
        // this.onTokenRefreshListener = firebase.messaging().onTokenRefresh(fcmToken => {
        //     // Process your token as required
        //     firebase.database().ref().child(companycode+'/users/'+this.state.name+'/token').set(fcmToken).then(() => {
        //         //alert(fcmToken)
        //         console.log('token refresh')
        //     })
        // })
      
        // Check Company Code
        let con = await API.getConnection();
        var screen = 'CheckcodeScreen'
        if(con == true) {
            if(await API.checkCode() != null) {
                await API.setUrl();    
                screen = 'LoginScreen'
            }
        } else {
            alert('Not Network Connected!')
        }

        //var token = await AppData.getItem('token')
        setTimeout(()=>{
            // if(token != null) {
            //     this.props.navigation.replace('HomeScreen')
            //} else {
            this.props.navigation.replace(screen.toString())
            //}
        }, 3000)
    }

    componentWillUnmount() {
        // this.onTokenRefreshListener()
    }

    render() {
        return (
            <Container style={styles.container}>
                <ImageBackground source={Images.bg}  style={styles.image}>
                    <Image source={Images.logo} style={{width: responsiveWidth(100), height: responsiveWidth(80)}}></Image>
                </ImageBackground>
                
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch'
    },
    image: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
});