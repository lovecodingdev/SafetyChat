import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    TextInput,
    Alert,
    Image,
    FlatList,
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
import Icon from '../components/icon'

export default class Emergency extends Component {
    constructor(props){
        super(props)
        this.state = {
            loading: false,
            indexes: [],
            message: '',
            options: [],
            headText: '',
            isAlert: false,
            position: null,
            selected: 0,
            posDesc: '',
        }
        this.users = [];
        mScreen = 'Emergency';
    }

    async componentDidMount() {

        let options = [
            {img: Images.intruderlockdown, title: "LOCKDOWN", key: 0},
            {img: Images.fire, title: "FIRE", key: 1},
            {img: Images.bomb, title: "BOMB", key: 2},
            {img: Images.tornado, title: "TORNADO", key: 3},
        ];
        this.isAdmin = this.props.navigation.getParam('isAdmin');
        let position = null;
        if (this.isAdmin == false) {
            position = await API.getLocation();
        }
        if (position == null) {
            posDesc = "Not Geolocated";
        } else {
            posDesc = "Location: (" + position.coords.latitude.toFixed(4) + ", " + position.coords.longitude.toFixed(4) + ")";
        }
        this.setState({options, position, posDesc});

        this.groups = await API.getGroups();
        this.users = this.groups.map(function(item) {
            return item.name;
        })
        console.log("This users = ", this.users);
    }

    async onSendAlert() {
        let {options, selected, message, position} = this.state;
        let lat = null;
        let lon = null;
        if (position != null && this.isAdmin == false) {
            lat = position.coords.latitude;
            lon = position.coords.longitude;
        }
        let alert = {
            isAdmin: this.isAdmin,
            user: user.name,
            role: user.role,
            lat: lat,
            lon: lon,
            message: message,
            type: options[selected].title
        }
        let type = this.isAdmin ? 'admin/' : 'user/';
        await firebase.database().ref(user.code+'/alerts/'+type).push(alert)
        Alert.alert("Successfully Sent");
        setTimeout(() => {
            this.props.navigation.goBack();
        }, 300);
    }

    onItem(index) {
        let {options, headText} = this.state;
        headText = 'Your group members will receive ' + options[index].title + ' alert.' 
        this.setState({isAlert: true, headText, selected: index});
    }

    onBack() {
        this.setState({isAlert: false})
    }

    render() {
        let {message, isAlert, headText, posDesc} = this.state;
        return (
            <KeyboardAvoidingView
                behavior={Platform.OS == "ios" ? "padding" : "padding"}
                style={{flex: 1,backgroundColor: '#484D53'}}>
                <Header prop={this.props.navigation} />
                {!isAlert?
                    <View>
                        <Text style={styles.title}>EMERGENCY!!!</Text>
                        {/* <View style={{padding: 20}}>        
                            
                        </View> */}
                        <FlatList
                            data = {this.state.options}
                            horizontal = {false}
                            numColumns = {2}
                            style={{padding: 15}}
                            renderItem={({item, index}) =>
                                <Icon img={item['img']} onPress={this.onItem.bind(this, index)} title={item['title']}></Icon>
                            }
                            keyExtractor={item => item.pdf}
                        />
                        <Spinner
                            visible={this.state.loading}
                            textContent={''}
                        />
                    </View>:
                    <View style={{padding: 20, marginTop: 30}}>
                        <Label style={{color: '#f00', textAlign: 'center', fontWeight: '600', marginBottom: 20}}>{headText}</Label>
                        <Label style={{color: '#fff', fontSize: 13}}>MESSAGE</Label>
                        <TextInput style={styles.textInput} autoCapitalize='none' multiline={true} value={message} onChangeText={text=>this.setState({message: text})}/>
                        <Label style={this.isAdmin? styles.none: styles.position}>{posDesc}</Label>
                        <TouchableOpacity style={styles.touchImage} onPress={this.onSendAlert.bind(this)}>
                            <Image
                                style={styles.profile}
                                source={Images.alertbutton}
                            />
                        </TouchableOpacity>
                        <Button block transparent bordered={false} style={styles.button} onPress={this.onBack.bind(this)}><Text style={{fontSize: 18, color: Colors.white}}>BACK TO MENU</Text></Button>
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
        marginTop: 30,
    },
    textInput: {
        marginTop: 5,
        marginBottom: 10,
        borderWidth: 1, 
        borderRadius: 5,
        textAlignVertical: 'top', 
        borderColor:'#fff', 
        color: '#fff',
        height: 60
    },
    position: {
        color: '#fff',
        marginBottom: 10,
        fontSize: 15
    },
    button: {
        marginTop: 10,
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