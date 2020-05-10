import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Container } from 'native-base';
import Header from '../components/header'
import firebase from 'react-native-firebase'
import { GiftedChat } from 'react-native-gifted-chat'
import AppData from '../components/AppData';


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
        this.mChatListener = null;
        this.item = props.navigation.getParam('item');
    }

    onChat() {
        let self = this;
        AppData.setItem(toName + "read", new Date());
        var messages = [];
        let dataRef = (this.item.isGroup == true) ? user.code + '/groupMessages/' + this.item.id : user.code + '/messages/' + user.name + '/' + toName;
        this.mChatRef = firebase.database().ref(dataRef);
        this.mChatRef.once('value', function(snapshot) {
            snapshot.forEach(function(keysnapshot) {
                var message = keysnapshot.val()
                messages.push(message)
            })
            messages = messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            self.setState({messages})
            
            self.mChatListener = self.mChatRef.on('child_added', (snapshots) => {
                var message = snapshots.val()
                var found = false;
                for(var i = 0; i < messages.length; i++) {
                    if (messages[i].createdAt == message.createdAt) {
                        found = true;
                        break;
                    }
                }
                if (found == false) {
                    AppData.setItem(toName+"read", new Date());
                    self.setState(prev => ({
                        messages: prev.messages.concat(message).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    }))
                }
            })
        })
    }

    componentDidMount() {
        //message list init
        if (this.item instanceof Object) {
            toName = this.item.id;
        } else {
            toName = this.item;
        }
        this.onChat()
    }

    onSend(messages = []) {
        
        if(this.item.isGroup == true) {
            var temp = messages
            temp[0].createdAt = new Date()
            firebase.database().ref(user.code+'/groupMessages/'+ toName).push(temp[0])
            AppData.setItem(toName + "read", temp[0].createdAt);
            AppData.setItem(toName, temp[0].createdAt);
        } else {
            var temp = messages
            temp[0].createdAt = new Date()
            firebase.database().ref(user.code+'/messages/'+ toName +'/'+ user.name).push(temp[0])
            firebase.database().ref(user.code+'/messages/'+user.name+'/'+ toName).push(temp[0])
            AppData.setItem(toName + "read", temp[0].createdAt);
            AppData.setItem(toName, temp[0].createdAt);
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
                        name: user.name,
                        avatar: user.image,
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