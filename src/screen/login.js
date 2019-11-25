import React, { Component } from 'react'
import {
  StyleSheet,
  ImageBackground,
  View,
  TextInput,
  Alert,
} from 'react-native'

import { Container, Content, Button, Icon, Form, Item, Label, Input, Text, Footer} from 'native-base'
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
            token: ''
        }
    }

    async componentDidMount() {
        let enabled = await firebase.messaging().hasPermission()
        if(!enabled) await firebase.messaging().requestPermission()
        //backend token
        var token = await AppData.getItem('token')
        console.log(token)
        if(token != null && token != '') {
            this.props.navigation.replace('HomeScreen')
            return
        }

        let fcm_token = await firebase.messaging().getToken()
        if (fcm_token != null) {
            this.setState({token: fcm_token});
        }
    }

    componentWillUnmount() {
        
    }

    async onLogin() {
        let self = this;
        let {token, name, password} = this.state;
        if(name != '' && password != '') {
            let companycode = await AppData.getItem('Companycode')
            
            this.setState({loading: true})
            let res = await API.login(name, password)
            this.setState({loading: false})
            //firebase user register with token
            console.log(res);
            if(res == true) {
                let role = await AppData.getItem('role')
                if (token != null && token != '') {
                    firebase.database().ref().child(companycode+'/users/'+name).set({token: token, role: role})
                    await firebase.database().ref().child(companycode+'/messages/'+name+'/1234zxcv').set({empty: ''})
                }
                this.props.navigation.replace('HomeScreen')
                // firebase.database().ref().child(companycode+'/users/'+name).set({token: token, role: role}).then(() => {
                //     this.props.navigation.replace('HomeScreen')
                // })
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
        
    // set() {
    //     this.setState({
    //         name: 'testone',
    //         password: 'pTaftZpxlsUvnicyOfneL^7s'
    //     })
    // }

    // set1() {
    //     this.setState({
    //         name: 'zheng',
    //         password: '*(o#f^7AfaA4Kl$ltb)hMY5T'
    //     })
    // }

    // set2() {
    //     this.setState({
    //         name: 'Qing',
    //         password: '5r^tc9*IitHvanU^MUNB%Q)T'
    //     })
    // }
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
                        {/* <Button block primary onPress={this.set.bind(this)}><Text>Set</Text></Button>
                        <Button block primary onPress={this.set1.bind(this)}><Text>Set1</Text></Button> */}
                        {/* <Button block primary onPress={this.set2.bind(this)}><Text>Set2</Text></Button> */}

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