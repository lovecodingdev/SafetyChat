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
            selfname: '',
        }

        global.mScreen = 'Chat'
        //this.initChat = this.initChat.bind(this)
        this.onChat = this.onChat.bind(this)
    }

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
        //message list init
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