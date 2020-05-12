import React, { Component } from 'react'
import {
  StyleSheet,
  ImageBackground,
  View,
  TextInput,
  Alert,
} from 'react-native'

import { Container, Button, Label, Text} from 'native-base'
import {Images, Colors} from '../theme'
import { responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions'
//import { MyText, Loader } from "../components";
import API from '../components/api'
import AppData from '../components/AppData'
import Spinner from 'react-native-loading-spinner-overlay'
import firebase from 'react-native-firebase'

export default class login extends Component {
    constructor(props){
        super(props)
        this.state = {
            // name: 'xaolin',
            // password: 'PJ9VfHoye##3tdCg',
            // password: 'MdeB9*fwX8%PA5*WT2g99pVq',
            name: '',
            password: '',
            loading: false,
        }
    }

    async onLogin() {
        let self = this;
        let {name, password} = this.state;
        if(name != '' && password != '') {
            this.setState({loading: true})
            let res = await API.login(name, password)
            this.setState({loading: false})
            //firebase user register with token
            console.log(res);
            if(res == true) {
                let image = await (await firebase.database().ref().child(user.code+'/users/'+name+'/image').once('value')).val();
                global.user.image = image;
                await AppData.setItem('userimage', image);
                console.log("*** Image =", image);
                await firebase.database().ref().child(user.code+'/messages/'+name+'/1234zxcv').set({empty: ''})
                this.props.navigation.replace('HomeScreen')
            } else {
                setTimeout(()=>{
                    self.setError();
                }, 200)
            }
        } else {
            this.setError();
        }
    }

    setError() {
        Alert.alert('Enter name and password correctly.')
    }

    changeCode() {
        this.props.navigation.replace('CheckcodeScreen')
    }
 
    render() {
        return (
            <Container style={styles.container}>
                <ImageBackground source={Images.bg} style={{flex: 1}}>
                    <Text style={{textAlign: 'center', color: '#fff', fontSize: 50, marginTop: responsiveHeight(20)}}>Safety</Text>
                    <View style={{padding: 20}}>        
                        <Label style={{color: '#fff'}}>User Name</Label>
                        <TextInput style={{marginTop: 10, borderWidth: 1, borderRadius: 5, borderColor:'#fff', color: '#fff',fontsize: 6, height: 35 }} autoCapitalize='none' value={this.state.name} onChangeText={text=>this.setState({name: text})}/>
                        
                        <Label style={{color: '#fff', marginTop: 10}}>Password</Label>
                        <TextInput style={{marginTop: 10, marginBottom:30, borderWidth: 1, borderRadius: 5, borderColor:'#fff', color: '#fff', height: 35 }} secureTextEntry={true} value={this.state.password} onChangeText={text=>this.setState({password: text})}/>
                        <Button block primary onPress={this.onLogin.bind(this)}><Text>LogIn</Text></Button>
                        <Button block transparent onPress={this.changeCode.bind(this)} style={{marginTop: 5}}><Text>Company Code?</Text></Button>
                    </View>
                    <Spinner
                        visible={this.state.loading}
                        textContent={''}
                        textStyle={styles.spinnerTextStyle}
                    />
                </ImageBackground>
            </Container>
        );
    }
}
  
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch'
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },

    form: {
        marginVertical: 24,
    }, 

    footer: {
        backgroundColor: '#fff0',
        alignItems: 'center',
        justifyContent: 'center'
    },
    dialog: {
        alignItems: "center",
        top: responsiveHeight(70),
        left: responsiveWidth(50)-40,
        zIndex: 100,
        position: 'absolute'
    },
    dialogNone: {
        display: "none"
    },
});