import React, { Component } from 'react'
import {
  StyleSheet,
  ImageBackground,
  View,
  TextInput,
  ScrollView
} from 'react-native'

import { Container, Button, Label, Text} from 'native-base'
import {Images, Colors} from '../theme'
import { responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions'
import API from '../components/api'
import Header from '../components/header'
import AppData from '../components/AppData'
import Spinner from 'react-native-loading-spinner-overlay'
import firebase from 'react-native-firebase'

export default class Group extends Component {
    constructor(props){
        super(props)
        this.state = {
            notification: '',
            tokens: [],
        };
        this.group = props.navigation.getParam('group');
    }

    async componentDidMount() {
        let tokens = await API.getTokens(this.group.users);
        console.log("Tokens**:", tokens);
        this.setState({tokens})
    }

    async onSend() {
        var {tokens, notification} = this.state;
        await API.sendPushNotification(tokens);
    }

    render() {
        let group = this.group;
        return (
            <Container style={styles.container}>
                <Header prop={this.props.navigation} />
                <View style={styles.view}>
                    <Label style={styles.label}>{group.title} ( Users: {group.users.length} )</Label>
                    <TextInput style={styles.textInput} autoCapitalize='none' value={this.state.notification} onChangeText={text=>this.setState({notification: text})}/>
                    <Button block style={styles.button} onPress={this.onSend.bind(this)}><Text>Send Notification</Text></Button>
                </View>
            </Container>
        );
    }
}
  
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
        backgroundColor: '#484D53',
    },
    view: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
    },
    label: {
        marginBottom: 10,
        marginTop: 30,
        color: '#fff',
        fontSize: 25,
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: '#000',
        marginTop: 5,
        borderWidth: 2,
        borderColor: '#fff',
        width: responsiveWidth(80),
        marginLeft: responsiveWidth(10) - 10,
    },
    textInput: {
        width: responsiveWidth(80),
        marginTop: 30,
        marginBottom: 20,
        borderWidth: 1, 
        borderRadius: 5, 
        borderColor:'#fff',
        padding: 5,
        color: '#fff',
        height: 130,
        textAlignVertical: 'top'
    },
});