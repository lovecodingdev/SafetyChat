import React, { Component } from 'react'
import {
    StyleSheet,
    ImageBackground,
    View,
    TextInput,
    Alert,
} from 'react-native'
import { Container, Card, CardItem, Body, Button, Text, Label} from 'native-base'
import {Images, Colors} from '../theme'
import Header from '../components/header'
import { responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions'
import ManyChoices from '../components/ManyChoices'
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
            indexes: [],
        }
        this.users = props.navigation.getParam('users').map(user => user.name);
        mScreen = 'CreateGroup';
    }

    async componentDidMount() {
    }

    onDialog() {
        this.setState({isInvited: true});
    }

    onCreate() {
        var {indexes, title} = this.state;
        if (title == '') {
            alert('Please type your group title');
            return
        }
        if (indexes.length == 0) {
            alert('Please invite at lease one user.');
            return;
        }
        var choices = []
        choices = indexes.map(index => this.users[index]);
        this.setState({loading: true})
        let self = this;
        const newRef = firebase.database().ref().child(user.code + '/groups').push();
        newRef.set({
            title: title,
            users: choices
        })
        .then(() => {
            self.setState({loading: false});
            alert("Successfully Created");
        });
    }

    onChangedSelectedUsers(questionIndex, checkedIndexes) {
        console.log('Checked Indexes = ', checkedIndexes);
        this.setState({indexes: checkedIndexes})
    }

    onSelect() {
        this.setState({isInvited: false})
    }

    render() {
        let {indexes, isInvited} = this.state;
        return (
            <Container style={styles.container}>
                <Header prop={this.props.navigation} />       
                <ImageBackground source={Images.bg} style={{flex: 1}}>
                    {isInvited == true ?
                    <View style={styles.view}>
                        <Label style={styles.label}>INVITE USERS</Label>
                        <ManyChoices many={true} data={this.users} checkedIndexes={indexes} onChanged={this.onChangedSelectedUsers.bind(this)}/>
                        <Button block style={styles.button} onPress={this.onSelect.bind(this)}><Text>SELECT</Text></Button>
                    </View>:
                    <View>
                        <Text style={styles.title}>CREATE GROUP</Text>
                        <View style={{padding: 20}}>        
                            <Label style={{color: '#fff'}}>GROUP TITLE</Label>
                            <TextInput style={styles.textInput} autoCapitalize='none' value={this.state.title} onChangeText={text=>this.setState({title: text})}/>
                            <Button transparent onPress={this.onDialog.bind(this)}><Text>Invite Users</Text></Button>
                            <Button block style={styles.button} onPress={this.onCreate.bind(this)}><Text>CREATE</Text></Button>
                        </View>
                        <Spinner
                            visible={this.state.loading}
                            textContent={''}
                        />
                    </View>}
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
    view: {
        alignItems: 'center',
        backgroundColor: 'rgba( 0, 0, 0, 0.6 )'
    },
    label: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    title: {
        textAlign: 'center', 
        color: '#fff', 
        fontSize: 30, 
        marginBottom: 30,
        marginTop: responsiveHeight(10),
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