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

        var token = await AppData.getItem('token')
        setTimeout(()=>{
            // if(token != null) {
            //     this.props.navigation.replace('HomeScreen')
            //} else {
                this.props.navigation.replace(screen.toString())
            //}
        }, 2000)
    }

    componentWillUnmount() {
    }

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