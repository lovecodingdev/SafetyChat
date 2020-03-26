import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Container } from 'native-base';
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
            selfname: '',
        }

        global.mScreen = 'Chat'
        this.onChat = this.onChat.bind(this)

        this.mChatRef = null;
        this.mGroupRef = null;
    }

    onChat() {

        this.mChatRef = firebase.database().ref(this.companycode+'/messages/'+this.state.selfname+'/'+this.toname)
        this.mChatRef.limitToLast(30).on("child_added", (value) => {
            var respond = []
            respond.push(value.val())
            this.setState(previousState => ({
                messages: GiftedChat.append(previousState.messages, respond)
            }))
        })

        this.mGroupRef = firebase.database().ref(this.companycode+'/groupMessages/'+this.role)
        this.mGroupRef.limitToLast(30).on('child_added', (value) => {
            var respond = []
            respond.push(value.val())
            this.setState(previousState => ({
                messages: GiftedChat.append(previousState.messages, respond)
            }))
        })
    }

    changeLoad() {
        global.mScreen = 'Chat'
    }

    componentWillUnmount() {
        global.mScreen = 'Home'
        // this.mChatRef.off('child_added')
        // this.mGroupRef.off('child_added')
    }

    async componentDidMount() {
        //message list init
        this.props.navigation.addListener('willFocus', this.changeLoad)
        this.companycode = await AppData.getItem('Companycode')
        var selfname = await AppData.getItem('username')
        this.role = await AppData.getItem('role')
        this.setState({selfname})
        this.toname = this.props.navigation.getParam('name')
        this.onChat()
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