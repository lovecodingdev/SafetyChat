import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  ImageBackground,
  } from 'react-native';

import {Button} from 'react-native-elements'
import { Container } from 'native-base'

import API from '../components/api'
import {Images} from '../theme'
import {responsiveHeight, responsiveWidth} from 'react-native-responsive-dimensions'
import {AppData} from '../components/AppData'
import {PermissionsAndroid} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay'

export default class checkcode extends Component {
    
    constructor(props){
        super(props)
        this.state = {
           text: '',
           loading: false
        }
    }

    async setCode() {
        if(this.state.text != '') {
            this.setState({loading: true})
            var code = this.state.text.toLowerCase()
            var url = "https://"+code+".myspapp.com/"+"wp-json/aam/v1/"
            console.log(url)
            try {
                let response = await fetch(url, {
                    method: 'GET',
                    headers:{
                    },
                });
                console.log(response.status)
                this.setState({loading: false})
                var responseStatus = response.status
                if (responseStatus == 200) {
                    console.log('startup.fetch: This code works!');
                    await API.setCode(code)
                    await API.setUrl()
                    this.props.navigation.replace('LoginScreen')
                }
                else {
                    console.log('This is not a valid code')
                    alert("That company code didn't work. Let's try again.")
                }
                
            } catch (error) {
                console.log("error", error)
                this.setState({loading: false})
                alert("That company code didn't work. Let's try again.")
            }
        } else {
            alert("Please insert your company code");
        }
    }

    componentDidMount() {
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,).then((res) => console.log('write'))
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,).then((res) => console.log('read'))

    }

    render() {
        return (
            <Container style={styles.container}>
                <ImageBackground source={Images.bg} style={{padding: 30, flex: 1}}>
                    <Text style={{textAlign: 'center', fontSize: 30, color: '#fff', marginTop: responsiveHeight(30)}}>Company Code</Text>
                    <TextInput
                        style={{height: 40, borderColor: 'gray', borderWidth: 1, marginTop: 30, marginBottom: 20, color: '#fff', borderRadius: 10 }}
                        onChangeText={(text) => this.setState({text})}
                        placeholder="Company Code"
                        placeholderTextColor="#fff"
                        value={this.state.text}
                    />
                    <Button title="Enter Code" onPress={this.setCode.bind(this)}></Button>
                </ImageBackground>
                <Spinner
                    visible={this.state.loading}
                ></Spinner>
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
        flex: 1
    },
});