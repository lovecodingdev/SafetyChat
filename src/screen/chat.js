import React, { Component, useReducer } from 'react';
import { StyleSheet } from 'react-native';
import { Container } from 'native-base';
import Header from '../components/header'
import API from "../components/api"
import firebase from 'react-native-firebase'
import AppData from '../components/AppData'
import { GiftedChat } from 'react-native-gifted-chat'
import firebase from 'react-native-firebase'


export default class chat extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            messages: [],
            selfname: '',
        }
        mScreen = 'Chat'
        this.onChat = this.onChat.bind(this)
        this.mChatRef = null;
        this.mGroupRef = null;
        this.chatListener = null;
        self.groupListener = null;

        this.isMount = false;
    }

    onChat() {
        var messages = []
        let self = this

        this.mChatRef = firebase.database().ref(user.code +'/messages/'+ user.name +'/'+this.toname)
        this.mGroupRef = firebase.database().ref(user.code + '/groupMessages/' + user.role)

        if (this.toname == '123group') {
            this.mGroupRef.orderByChild('createdAt').once('value', function(snapshot) {
                snapshot.forEach(function(keysnapshot) {
                    var message = keysnapshot.val()
                    messages.push(message)
                })
                messages = messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                self.setState({messages})

                self.groupListener = self.mGroupRef.on('child_added', (snapshots) => {
                    var message = snapshots.val()
                    var found = false;
                    for(var i = 0; i < messages.length; i++) {
                        if (messages[i].createdAt == message.createdAt) {
                            found = true;
                            break;
                        }
                    }
                    if (found == false) {
                        self.setState(prev => ({
                            messages: prev.messages.concat(message).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                        }))
                    }
                })
            })
        } else {
            this.mChatRef.once('value', function(snapshot) {
                console.log("Snapshot", snapshot)
                snapshot.forEach(function(keysnapshot) {
                    var message = keysnapshot.val()
                    messages.push(message)
                })
                messages = messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                self.setState({messages})
                
                self.chatListener = self.mChatRef.on('child_added', (snapshots) => {
                    var message = snapshots.val()
                    var found = false;
                    for(var i = 0; i < messages.length; i++) {
                        if (messages[i].createdAt == message.createdAt) {
                            found = true;
                            break;
                        }
                    }
                    if (found == false) {
                        self.setState(prev => ({
                            messages: prev.messages.concat(message).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                        }))
                    }
                })
            })
        }
    }

    componentDidMount() {
        //message list init
        this.toname = this.props.navigation.getParam('name')
        this.onChat()
        this.onNotification()
    }

    onNotification() {
        const notification = new firebase.notifications.Notification()
        .setNotificationId('notificationId')
        .setTitle('My notification title')
        .setBody('My notification body')
        .setData({
            key1: 'value1',
            key2: 'value2',
        });
        firebase.notifications().displayNotification(notification)
    }

    onSend(messages = []) {
        
        if(this.toname == '123group') {
            var temp = messages
            temp[0].createdAt = new Date()
            firebase.database().ref(user.code+'/groupMessages/'+user.role).push(temp[0])
        } else {
            var temp = messages
            temp[0].createdAt = new Date()
            firebase.database().ref(user.code+'/messages/'+this.toname+'/'+ user.name).push(temp[0])
            var temp1 = messages
            temp1[0].createdAt = new Date()        
            firebase.database().ref(user.code+'/messages/'+user.name+'/'+ this.toname).push(temp1[0])
        }
    }

    render() {
        
        return (
            <Container style={this.state.loading ? styles.loading: styles.container}>
                <Header prop={this.props.navigation} />
                <GiftedChat
                    messages={this.state.messages}
                    onSend={messages => this.onSend(messages)}
                    user={{
                        _id: user.name,
                        name: user.name
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