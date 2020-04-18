import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Container } from 'native-base';
import Header from '../components/header'
import firebase from 'react-native-firebase'
import { GiftedChat } from 'react-native-gifted-chat'


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
    }

    onChat() {
        let self = this;
        var messages = [];
        let dataRef = (toName == '123group') ? user.code + '/groupMessages/' + user.role : user.code + '/messages/' + user.name + '/' + toName;
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
                    self.setState(prev => ({
                        messages: prev.messages.concat(message).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    }))
                }
            })
        })
    }

    componentDidMount() {
        //message list init
        var item = this.props.navigation.getParam('name')
        if (item instanceof Object) {
            toName = item.id;
        } else {
            toName = item;
        }
        this.onChat()
    }

    onSend(messages = []) {
        
        if(toName == '123group') {
            var temp = messages
            temp[0].createdAt = new Date()
            firebase.database().ref(user.code+'/groupMessages/'+user.role).push(temp[0])
        } else {
            var temp = messages
            temp[0].createdAt = new Date()
            firebase.database().ref(user.code+'/messages/'+ toName +'/'+ user.name).push(temp[0])
            firebase.database().ref(user.code+'/messages/'+user.name+'/'+ toName).push(temp[0])
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