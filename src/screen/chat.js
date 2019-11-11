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

        //this.initChat = this.initChat.bind(this)
        this.onChat = this.onChat.bind(this)
    }

    componentWillUnmount() {
        //this.messageListener()
        this.didFocusSubscription.remove()
        this.willBlurSubscription.remove()
        this.removeNotificationOpenedListener()
    }

    // initChat() {
    //     var self = this
    //     var selfname = this.state.selfname
    //     var messageList = []
    //     var first_message = {
    //         _id : "0001",
    //         createdAt: new Date(),
    //         text: "Hi",
    //         user: {
    //             _id: selfname,
    //             name: selfname
    //         }
    //     }

    //     if(this.toname == '123group') {
    //         firebase.database().ref(this.companycode+'/groupMessages/'+this.role).once('value', function(snapshot) {
    //             snapshot.forEach(function(keysnapshot) {
    //                 var message = keysnapshot.val()
    //                 messageList.push(message)
    //             })
    //             self.setState({messages: messageList.reverse()})
    //         })
    //     } else {
    //         console.log("--------company code------------", this.companycode)
    //         firebase.database().ref(this.companycode+'/messages/'+selfname+'/'+this.toname).once('value', function(snapshot) {
    //             //if(snapshot.exists()){
    //                 snapshot.forEach(function(keysnapshot) {
    //                     var message = keysnapshot.val()
    //                     messageList.push(message)
    //                 })
    //                 self.setState({messages: messageList.reverse()})
    //             //} else {
    //                 //firebase.database().ref(self.companycode+'/messages/'+selfname+'/'+self.toname).push(first_message)
    //                 //firebase.database().ref(self.companycode+'/messages/'+self.toname+'/'+selfname).push(first_message)
    //             //}
    //         })
    //     }

        
    // }

    onChat() {
        firebase.database().ref(this.companycode+'/messages/'+this.state.selfname+'/'+this.toname).on("child_added", (value) => {
            var respond = []
            respond.push(value.val())
            this.setState(previousState => ({
                messages: GiftedChat.append(previousState.messages, respond)
            }))
        })

        firebase.database().ref(this.companycode+'/groupMessages/'+this.role).on('child_added', (value) => {
            var respond = []
            respond.push(value.val())
            this.setState(previousState => ({
                messages: GiftedChat.append(previousState.messages, respond)
            }))
        })
    }

    async componentDidMount() {
        //App in background or foreground   notification taps
        this.removeNotificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
            // Get information about the notification that was opened
            const notification = notificationOpen.notification
            var name = ''
            notification._data.group == '1' ? name = '123group' : name = notification._data.fromname
            this.toname = name
            this.setState({messages: []})
            this.onChat()
            this.props.navigation.navigate({routeName:'ChatScreen', params: {name: name}, key: 'chat'})
        })

        //message list init
        this.companycode = await AppData.getItem('Companycode')
        var selfname = await AppData.getItem('username')
        this.role = await AppData.getItem('role')
        this.setState({selfname})
        this.toname = this.props.navigation.getParam('name')
        this.onChat()

        var messageListener = firebase.messaging().onMessage((message) => {
            var screenFocused = this.props.navigation.isFocused()
            //alert(screenFocused)
            if(screenFocused) {
                console.log('----------------screen------------', this.props.navigation.state.routeName)
                    console.log('------------------receive---------------')
                    if(this.toname == '123group' && message._data.fromname == this.role) {
                        // var temp = JSON.parse(message._data.data)
                        // var respond = []
                        // respond.push(temp)
                        // this.setState(previousState => ({
                        //     messages: GiftedChat.append(previousState.messages, respond),
                        // }))
                    } else if(message._data.fromname == this.toname) {
                        // var temp = JSON.parse(message._data.data)
                        // var respond = []
                        // respond.push(temp)
                        // this.setState(previousState => ({
                        //     messages: GiftedChat.append(previousState.messages, respond),
                        // }))
                        //console.log("----------------------receiving message----------------------", respond)
                        
                    } else {
                        if(JSON.parse(message._data.data).user.name != selfname) {
                            Alert.alert(
                                'Notification',
                                'Message from '+message._data.fromname,
                                [
                                    {text: 'View', onPress: () => {
                                            message._data.group == '1' ? name = '123group' : name = message._data.fromname
                                            this.toname = name
                                            this.setState({messages: []})
                                            this.onChat()
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
                    }
            }
        })

        //when screen focused, message listener starting
        this.didFocusSubscription = this.props.navigation.addListener(
            'willFocus',
            payload => {
                messageListener = firebase.messaging().onMessage((message) => {
                    var screenFocused = this.props.navigation.isFocused()
                    //alert(screenFocused)
                    if(screenFocused) {
                        console.log('----------------screen------------', this.props.navigation.state.routeName)
                        //if(this.props.navigation.state.routeName == 'ChatScreen') {
                            console.log('------------------receive---------------')
                            if(this.toname == '123group' && message._data.fromname == this.role) {
                                // var temp = JSON.parse(message._data.data)
                                // var respond = []
                                // respond.push(temp)
                                // this.setState(previousState => ({
                                //     messages: GiftedChat.append(previousState.messages, respond),
                                // }))
                            } else if(message._data.fromname == this.toname) {
                                // var temp = JSON.parse(message._data.data)
                                // var respond = []
                                // respond.push(temp)
                                // this.setState(previousState => ({
                                //     messages: GiftedChat.append(previousState.messages, respond),
                                // }))
                                //console.log("----------------------receiving message----------------------", respond)
                                
                            } else {
                                if(JSON.parse(message._data.data).user.name != selfname) {
                                    Alert.alert(
                                        'Notification',
                                        'Message from '+message._data.fromname,
                                        [
                                            { 
                                                text: 'View', onPress: () => {
                                                    message._data.group == '1' ? name = '123group' : name = message._data.fromname
                                                    this.toname = name
                                                    this.setState({messages: []})
                                                    this.onChat()
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
                            }
                    }
                })

            }
        )

        //when screen unfocus, remove message listener
        this.willBlurSubscription = this.props.navigation.addListener(
            'willBlur',
            payload => {
                messageListener()
            }
        )

        
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