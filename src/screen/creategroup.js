import React, { Component } from 'react'
import {
    StyleSheet,
    ImageBackground,
    View,
    TextInput,
} from 'react-native'
import { Container, Button, Label, Text} from 'native-base'
import {Images, Colors} from '../theme'
import Header from '../components/header'
import { responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions'
import API from '../components/api'
import AppData from '../components/AppData'
import Spinner from 'react-native-loading-spinner-overlay'
import firebase from 'react-native-firebase'

export default class CreateGroup extends Component {
    constructor(props){
        super(props)
        this.state = {
            isInvited: false,
            loading: false,
            title: '',
        }
        mScreen = 'CreateGroup';
    }

    onDialog() {

    }

    onCreate() {
        
    }

    render() {
        return (
            <Container style={styles.container}>
                <Header prop={this.props.navigation} />
                <ImageBackground source={Images.bg} style={{flex: 1}}>
                    <Text style={styles.title}>Create User Group</Text>
                    <View style={{padding: 20}}>        
                        <Label style={{color: '#fff'}}>Group Title</Label>
                        <TextInput style={styles.textInput} autoCapitalize='none' value={this.state.title} onChangeText={text=>this.setState({title: text})}/>
                        <Button transparent onPress={this.onDialog.bind(this)}><Text>Invite Users</Text></Button>
                        <Button block style={styles.button} onPress={this.onCreate.bind(this)}><Text>Create Group</Text></Button>
                    </View>
                    <Spinner
                        visible={this.state.loading}
                        textContent={''}
                    />
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
    title: {
        textAlign: 'center', 
        color: '#fff', 
        fontSize: 30, 
        marginBottom: 30,
        marginTop: responsiveHeight(20),
    },
    textInput: {
        marginTop: 10,
        marginBottom: 5,
        borderWidth: 1, 
        borderRadius: 5, 
        borderColor:'#fff', 
        color: '#fff',
        height: 40
    },
    button: {
        backgroundColor: '#000',
        marginTop: 5,
        borderWidth: 2,
        borderColor: '#fff'
    },
});