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
import ManyChoices from '../components/ManyChoices'
import Spinner from 'react-native-loading-spinner-overlay'
import firebase from 'react-native-firebase'
import ImagePicker from 'react-native-image-crop-picker'
import API from '../components/api'

export default class Emergency extends Component {
    constructor(props){
        super(props)
        this.state = {
            loading: false,
            indexes: [],
            isInvited: false,
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

    onDialog() {
        this.setState({isInvited: true});
    }


    onChangedSelectedUsers(questionIndex, checkedIndexes) {
        this.setState({indexes: checkedIndexes})
    }

    onSelect() {
        this.setState({isInvited: false})
    }

    onSendAlert() {

    }

    render() {
        let {indexes, isInvited, message} = this.state;
        return (
            <KeyboardAvoidingView
                behavior={Platform.OS == "ios" ? "padding" : "padding"}
                style={{flex: 1,backgroundColor: '#484D53'}}>
                <Header prop={this.props.navigation} />       
                {isInvited == true ?
                <View style={styles.view}>
                    <Label style={styles.label}>SELECT USERS</Label>
                    <ManyChoices many={false} data={this.users} checkedIndexes={indexes} onChanged={this.onChangedSelectedUsers.bind(this)}/>
                    <Button block style={styles.button} onPress={this.onSelect.bind(this)}><Text>SELECT</Text></Button>
                </View>:
                <View>
                    <Text style={styles.title}>EMERGENCY!!!</Text>
                    <View style={{padding: 20}}>        
                        <Label style={{color: '#fff'}}>MESSAGE</Label>
                        <TextInput style={styles.textInput} autoCapitalize='none' multiline={true} value={this.state.message} onChangeText={text=>this.setState({message: text})}/>
                        <Button transparent onPress={this.onDialog.bind(this)}><Text>SELECT GROUP</Text></Button>
                        <Button block style={styles.button} onPress={this.onSendAlert.bind(this)}><Text>SEND</Text></Button>
                    </View>
                    <Spinner
                        visible={this.state.loading}
                        textContent={''}
                    />
                </View>}
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
        marginTop: 10,
    },
    textInput: {
        marginTop: 10,
        marginBottom: 5,
        borderWidth: 1, 
        borderRadius: 5,
        textAlignVertical: 'top', 
        borderColor:'#fff', 
        color: '#fff',
        height: 100
    },
    button: {
        backgroundColor: '#000',
        marginTop: 5,
        borderWidth: 2,
        borderColor: '#fff'
    },
});