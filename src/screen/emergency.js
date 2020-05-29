import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    TextInput,
    Alert,
    Image,
    TouchableOpacity,
    Platform,
    KeyboardAvoidingView,
} from 'react-native'
import {Button, Text, Label} from 'native-base'
import {Images, Colors} from '../theme'
import Header from '../components/header'
import Spinner from 'react-native-loading-spinner-overlay'
import firebase from 'react-native-firebase'
import API from '../components/api'

export default class Emergency extends Component {
    constructor(props){
        super(props)
        this.state = {
            loading: false,
            indexes: [],
            message: ''
        }
        this.users = [];
        mScreen = 'Emergency';
    }

    async componentDidMount() {
        this.groups = await API.getGroups();
        this.users = this.groups.map(function(item) {
            return item.name;
        })
        console.log("This users = ", this.users);
    }

    onSendAlert() {

    }

    render() {
        let {message} = this.state;
        return (
            <KeyboardAvoidingView
                behavior={Platform.OS == "ios" ? "padding" : "padding"}
                style={{flex: 1,backgroundColor: '#484D53'}}>
                <Header prop={this.props.navigation} />       
                <View>
                    <Text style={styles.title}>EMERGENCY!!!</Text>
                    <View style={{padding: 20}}>        
                        <Label style={{color: '#fff'}}>MESSAGE</Label>
                        <TextInput style={styles.textInput} autoCapitalize='none' multiline={true} value={message} onChangeText={text=>this.setState({message: text})}/>
                        <TouchableOpacity style={styles.touchImage} onPress={this.onSendAlert.bind(this)}>
                            <Image
                                style={styles.profile}
                                source={Images.alertbutton}
                            />
                        </TouchableOpacity>
                        {/* <Button block style={styles.button} onPress={this.onSendAlert.bind(this)}><Text>SEND</Text></Button> */}
                    </View>
                    <Spinner
                        visible={this.state.loading}
                        textContent={''}
                    />
                </View>
            </KeyboardAvoidingView>
        );
    }
}
  
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
        backgroundColor: '#484D53'
    },
    view: {
        alignItems: 'center',
        backgroundColor: 'rgba( 0, 0, 0, 0.6 )'
    },
    label: {
        color: '#fff',
        marginTop: 20,
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    none: {
        display: 'none'
    },
    title: {
        textAlign: 'center', 
        color: '#fff', 
        fontSize: 25, 
        marginBottom: 10,
        marginTop: 30,
    },
    textInput: {
        marginTop: 10,
        marginBottom: 30,
        borderWidth: 1, 
        borderRadius: 5,
        textAlignVertical: 'top', 
        borderColor:'#fff', 
        color: '#fff',
        height: 60
    },
    button: {
        backgroundColor: '#000',
        marginTop: 5,
        borderWidth: 2,
        borderColor: '#fff'
    },
    touchImage: {
        alignSelf: 'center',
    },
    profile: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderColor: Colors.white,
        borderWidth: 2,
        resizeMode: 'cover'
    },
});