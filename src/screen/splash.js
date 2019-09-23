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