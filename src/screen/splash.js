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
        var self = this
        
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
        setTimeout(()=>{
            this.props.navigation.replace(screen.toString());
        }, 2000)
    }

    componentWillUnmount() {
       
    }

    // showAlert(title, body) {
    //     Alert.alert(
    //         title, body,
    //         [
    //             { text: 'OK', onPress: () => console.log('OK Pressed') },
    //         ],
    //         { cancelable: false },
    //     );
    // }

    // async createNotificationListeners() {

    //     this.notificationListener = firebase.notifications().onNotification((notification) => {
    //         const { title, body } = notification;
    //         this.showAlert(title, body);
    //     });
    //     this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
    //         const { title, body } = notificationOpen.notification;
    //         this.showAlert(title, body);
    //     });
    //     /*
    //     * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
    //     * */
    //     const notificationOpen = await firebase.notifications().getInitialNotification();
    //     if (notificationOpen) {
    //         const { title, body } = notificationOpen.notification;
    //         this.showAlert(title, body);
    //     }
    //     /*
    //     * Triggered for data only payload in foreground
    //     * */
    //     this.messageListener = firebase.messaging().onMessage((message) => {
    //         //process data message
    //         console.log(JSON.stringify(message));
    //     });
    // }

    // async checkPermission() {
    //     const enabled = await firebase.messaging().hasPermission()
    //     if (enabled) {
    //         this.getToken();
    //     } else {
    //         this.requestPermission();
    //     }
    // }

    // async getToken() {
    //     let fcmToken = await AppData.getItem('fcmToken');
    //     if (!fcmToken) {
    //         fcmToken = await firebase.messaging().getToken();
    //         if (fcmToken) {
    //             await AppData.setItem('fcmToken', fcmToken);
    //         }
    //     }
    //     console.log('Firebase Token = ', fcmToken);
    // }

    // async requestPermission() {
    //     try {
    //         await firebase.messaging().requestPermission();
    //         this.getToken();
    //     } catch(error) {
    //         console.log('Permission rejected');
    //     };
    // }

    render() {
        return (
            <Container style={styles.container}>
                <ImageBackground source={Images.bg}  style={styles.image}>
                    <Image source={Images.logo} style={{width: responsiveWidth(80), height: 200, flex: 0.7}}></Image>
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