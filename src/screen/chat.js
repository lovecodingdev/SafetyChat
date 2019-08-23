import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  View,
  ScrollView,
  Platform,
  FlatList,
  TextInput,
  Alert,
  } from 'react-native';
import { Images, Title } from '../theme';
import { Container } from 'native-base';
import { responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions';
import Header from '../components/header'
import API from "../components/api"
import firebase from 'react-native-firebase'
import AppData from '../components/AppData'
import {GiftedChat} from 'react-native-gifted-chat'

export default class chat extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            messages: [],
            selfname: ''
        }

        this.initChat = this.initChat.bind(this)
    }

    componentWillUnmount() {
        this.messageListener()
    }

    initChat() {
        var self = this
        var selfname = this.state.selfname
        var messageList = []
        if(this.toname == '123group') {
            firebase.database().ref(this.companycode+'/groupMessages/'+this.role).once('value', function(snapshot) {
                snapshot.forEach(function(keysnapshot) {
                    var message = keysnapshot.val()
                    console.log(message)
                    messageList.push(message)
                })
                self.setState({messages: messageList.reverse()})
                console.log(self.state.messages)
            })
        } else {
            firebase.database().ref(this.companycode+'/messages/'+selfname+'/'+this.toname).once('value', function(snapshot) {
                snapshot.forEach(function(keysnapshot) {
                    var message = keysnapshot.val()
                    console.log(message)
                    messageList.push(message)
                })
                self.setState({messages: messageList.reverse()})
                console.log(self.state.messages)
            })
        }
    }

    async componentDidMount() {
        //message list init
        this.companycode = await AppData.getItem('Companycode')
        var selfname = await AppData.getItem('username')
        this.role = await AppData.getItem('role')
        this.setState({selfname})
        this.toname = this.props.navigation.getParam('name')
        this.initChat()
        // var messageList = []
        // if(this.toname == '123group') {
        //     firebase.database().ref(this.companycode+'/groupMessages/'+this.role).once('value', function(snapshot) {
        //         snapshot.forEach(function(keysnapshot) {
        //             var message = keysnapshot.val()
        //             console.log(message)
        //             messageList.push(message)
        //         })
        //         self.setState({messages: messageList.reverse()})
        //         console.log(self.state.messages)
        //     })
        // } else {
        //     firebase.database().ref(this.companycode+'/messages/'+selfname+'/'+this.toname).once('value', function(snapshot) {
        //         snapshot.forEach(function(keysnapshot) {
        //             var message = keysnapshot.val()
        //             console.log(message)
        //             messageList.push(message)
        //         })
        //         self.setState({messages: messageList.reverse()})
        //         console.log(self.state.messages)
        //     })
        // }

        //message receive
        this.messageListener = firebase.messaging().onMessage((message) => {
            console.log('----------------screen------------', this.props.navigation.state.routeName)
            if(this.props.navigation.state.routeName == 'ChatScreen') {
                console.log('------------------receive---------------')
                if(this.toname == '123group' && message._data.fromname == this.role) {
                    var temp = JSON.parse(message._data.data)
                    var respond = []
                    respond.push(temp)
                    this.setState(previousState => ({
                        messages: GiftedChat.append(previousState.messages, respond),
                    }))
                } else if(message._data.fromname == this.toname) {
                    var temp = JSON.parse(message._data.data)
                    var respond = []
                    respond.push(temp)
                    this.setState(previousState => ({
                        messages: GiftedChat.append(previousState.messages, respond),
                    }))
                    console.log("----------------------receiving message----------------------", respond)
                    
                } else {
                    Alert.alert(
                        'Notification',
                        'Message from '+message._data.fromname,
                        [
                            {text: 'View', onPress: () => {
                                    this.toname = message._data.fromname
                                    this.initChat()
                                }
                            },
                          {
                            text: 'Cancel',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel',
                          },
                        ],
                        {cancelable: false},
                    )
                }
            } else {
                alert("call from "+message._data.fromname)
            }
        })
    }

    onSend(messages = []) {
        if(this.toname == '123group') {
            var temp = messages
            temp[0].createdAt = new Date()
            firebase.database().ref(this.companycode+'/groupMessages/'+this.role).push(temp[0])
        } else {
            var temp = messages
            temp[0].createdAt = new Date()
            firebase.database().ref(this.companycode+'/messages/'+this.toname+'/'+this.state.selfname).push(temp[0])
            var temp1 = messages
            temp1[0].createdAt = new Date()        
            firebase.database().ref(this.companycode+'/messages/'+this.state.selfname+'/'+this.toname).push(temp1[0])
        }
    }

    render() {
        
        return (
            <Container style={this.state.loading ? styles.loading: styles.container}>
                <Header prop={this.props.navigation} />
                <GiftedChat
                    keyboardShouldPersistTaps='never'
                    renderUsernameOnMessage={true}
                    messages={this.state.messages}
                    onSend={messages => this.onSend(messages)}
                    user={{
                        _id: this.state.selfname,
                        name: this.state.selfname
                    }}
                />
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
        backgroundColor: '#484D53'
    },
   
});