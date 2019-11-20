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
import OneSignal from 'react-native-onesignal'

export default class splash extends Component {
    constructor(props) {
        super(props)
        
        OneSignal.init("928954ff-21be-4995-a982-9cbd5ff295b2");
        OneSignal.addEventListener("received", this.onReceived);
        OneSignal.addEventListener("opened", this.onOpened);
        OneSignal.addEventListener("ids", this.onIds);
        OneSignal.configure();
    }

    onReceived = notification => {
        console.log("Notification received: ", notification);
    };

    onOpened = openResult => {
        console.log("Message: ", openResult.notification.payload.body);
        console.log("Data: ", openResult.notification.payload.additionalData);
        console.log("isActive: ", openResult.notification.isAppInFocus);
        console.log("openResult: ", openResult);
    };

    onIds = device => {
        console.log("Device info: ", device);
        this.setState({ device });
    };

    async componentDidMount() {
      
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
            this.props.navigation.replace(screen.toString())
        }, 3000)
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