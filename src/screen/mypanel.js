import React, { Component } from 'react'
import {
  StyleSheet,
  ImageBackground,
  Alert,
  View
} from 'react-native'
import { Container, Button, Label, Text} from 'native-base'
import { NavigationActions } from 'react-navigation'
import {Images, Title} from '../theme'
import AppData from '../components/AppData'
import Header from '../components/header'
import BigIcon from '../components/bigicon'
import firebase from 'react-native-firebase'
import api from '../components/api';
import Const from '../Const'
import { responsiveWidth } from 'react-native-responsive-dimensions'

export default class Mypanel extends Component {
    constructor(props){
        super(props)
        mScreen = 'Mypanel'
    }

    onGroup() {
        this.props.navigation.navigate('SelectGroupScreen');
    }

    admin() {
        this.props.navigation.navigate('AdminScreen')
    }

    logout() {
        Alert.alert(
            'Logout',
            'Do you really want to logout?',
            [
                {
                    text: 'Ok', onPress: async () => {
                        
                        firebase.database().ref(user.code+'/users/'+user.name).update({token: ''});
                        console.log("User Logout!")
                        api.setBadge(0);
                        user.name = ''
                        user.role = ''
                        user.password = ''
                        user.code = ''
                        AppData.setItem(Const.CODE_KEY, '');
                        AppData.setItem(Const.USER_KEY, '');
                        AppData.setItem(Const.ROLE_KEY, '');
                        AppData.setItem(Const.PASSWORD_KEY, '');
                        AppData.setItem(Const.IMAGE_KEY, null);
                        this.props.navigation.reset([NavigationActions.navigate({ routeName: 'CheckcodeScreen' })], 0);
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
        var isAdmin = (user.role.toLowerCase().includes('administator') || user.role.toLowerCase().includes('manager'))  ? true : false;
        return (
            <Container style={styles.container}>
                <Header prop={this.props.navigation} />
                <ImageBackground source={Images.bg} style={{flex: 1, padding: 15}}>
                    <BigIcon img={Images.profile} title={Title.profile} onPress={this.onGroup.bind(this)}></BigIcon>
                    { isAdmin == true ? <BigIcon img={Images.admin} title={Title.admin} onPress={this.admin.bind(this)}></BigIcon>:<View></View>}
                    <Button block transparent style={{marginTop: 20}} onPress={this.logout.bind(this)}><Text style={{color: '#fff', fontSize: 20}}>Log Out</Text></Button>
                </ImageBackground>
            </Container>
        );
    }
}
  
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
        backgroundColor: '#484D53'
    },
    button: {
        backgroundColor: '#000',
        marginBottom: 10,
        width: responsiveWidth(100) - 20,
        marginLeft: 10,
        borderWidth: 2,
        borderColor: '#fff'
    },
});