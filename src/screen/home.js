import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  View,
  ScrollView,
  Platform,
} from 'react-native';
import { Images, Title } from '../theme';
import { Container } from 'native-base';
import { responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions';
import Header from '../components/header'
import RNFetchBlob from 'rn-fetch-blob'
import API from "../components/api"
import BigIcon from '../components/bigicon'
import firebase from 'react-native-firebase'
import AppData from '../components/AppData';
import Geolocation from 'react-native-geolocation-service';

const resourceUrl = Platform.OS === 'ios' ? RNFetchBlob.fs.dirs.DocumentDir+"/safety/" : "/storage/emulated/0/safetyDir/"
const PushNotification = require("react-native-push-notification");

export default class home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            safetyplans: '',
            maps: '',
            firstaid: '',
            loading: true,
        }
        global.mScreen = 'Home';
        global.toName = '';
        this.item = '';

        this.childChangedRef = null
        this.groupChangedRef = null
        this.didFocusListener = null
        this.localNotify = this.localNotify.bind(this);
    }

    async componentDidMount() {
        await this.getMylocation()
        this.setupDatabaseListener();
        await this.getAllGroups();
        this.getMessages();
        API.firebaseTokenRefresh();
        this.prepareNotification();
        await this.fetchDocument();

        let self = this;
        this.didFocusListener =  await this.props.navigation.addListener('willFocus',
        payload => {
            console.log('Updated Home', payload);
            self.getAllGroups();
        });
    }

    async getMylocation() {
        let position =  await API.getLocation();
        console.log("Position = ", position);
    }

    localNotify = (item) => {
        this.item = item;
        let message = item.isGroup ? 'Message from your Group' : 'Message from ' + item.name
        PushNotification.localNotification({
            title: "Notification", // (optional)
            message: message, // (required)
            playSound: true,
            soundName: 'default',
            number: 1,
        })
        AppData.setItem(item.id, new Date());
        console.log("OK!!!");
        setTimeout(()=>{
            PushNotification.cancelAllLocalNotifications()
        }, 3000)
    }

    async getMessages() {
        firebase.database().ref().child(user.code + '/messages/' + user.name).once('value')
        .then((snapshots) => {
            snapshots.forEach(function(snapshot) {
                var date = new Date(2000,1,1);
                var key = snapshot.key;
                snapshot.forEach(function(daSnap) {
                    if (new Date(daSnap.val().createdAt) > date) {
                        date = new Date(daSnap.val().createdAt);
                    }
                }) 
                AppData.setItem(key, date);
            });
        })
        firebase.database().ref().child(user.code + '/groupMessages/').once('value')
        .then((snapshots) => {
            snapshots.forEach(function(snapshot) {
                var date = new Date(2000,1,1);
                var key = snapshot.key;
                snapshot.forEach(function(daSnap) {
                    if (new Date(daSnap.val().createdAt) > date) {
                        date = new Date(daSnap.val().createdAt);
                    }
                }) 
                AppData.setItem(key, date);
            });
        })
    }

    async getAllGroups() {
        firebase.database().ref().child(user.code + '/users').once('value')
        .then((snapshots) => {
            var mUsers = []
            snapshots.forEach(function(snapshot) {
                var mUser = {
                    id: snapshot.key,
                    name: snapshot.key,
                    role: snapshot.val().role,
                    token: snapshot.val().token,
                    image: snapshot.val().image,
                    isGroup: false,
                }
                mUsers.push(mUser)
            })
            AppData.setItem('Users', mUsers);
        })
        firebase.database().ref().child(user.code + '/groups').once('value')
        .then((snapshots) => {
            var mGroups = [];
            snapshots.forEach(function(snapshot) {
                var id = snapshot.key;
                var name = snapshot.val()['title'];
                var users = snapshot.val()['users'];
                var image = snapshot.val()['image'];
                if (users.includes(user.name)) {
                    var group = {
                        id,
                        name,
                        role: 'GROUP',
                        users,
                        isGroup: true,
                        image,
                    }
                    mGroups.push(group)
                }
            })
            AppData.setItem('Groups', mGroups);
        })
    }

    setupDatabaseListener() {
        let self = this
        this.childChangedRef = firebase.database().ref(user.code + '/messages/' + user.name)
        this.childChangedRef.on("child_changed", (value) => {
            let name = value.key;
            if (mScreen == 'Chat' && toName == name) return;
            let item = {
                id: name,
                name: name,
                isGroup: false,
            }
            self.localNotify(item);
        })

        this.groupChangedRef = firebase.database().ref(user.code + '/groupMessages/')
        this.groupChangedRef.on("child_changed", (value) => {
            if (toName == value.key && mScreen == 'Chat') return
            let item = {
                id: value.key,
                name: value.key,
                isGroup: true,
            }
            self.localNotify(item);
        })
    }

    async prepareNotification() {
        let self = this;
        PushNotification.configure({
            onRegister: function(token) {
            },
            onNotification: function(notification) {
                if (self.item != '' && Platform.OS === 'android') {
                    self.props.navigation.navigate({routeName:'ChatScreen', params: {item: self.item}, key: 'chat'})
                }
            },
            senderID: "532288277681",
            permissions: {
                alert: true,
                badge: true,
                sound: true
            },
            popInitialNotification: true,
            requestPermissions: Platform.OS === 'ios'
        });

        const notificationOpen = await firebase.notifications().getInitialNotification()
        if (notificationOpen) {
            // App was opened by a notification
            const notification = notificationOpen.notification
            toName = notification._data.fromname
            self.item = {
                id: toName,
                name: toName,
                isGroup: notification._data.group == '1'
            }
            setTimeout(() => {
                this.props.navigation.navigate({routeName:'ChatScreen', params: {item: self.item}, key: 'chat'})
            }, 100)
        }

        // App in background or foreground notification taps
        this.removeNotificationOpenedListener = firebase.notifications().onNotificationOpened((notificationSnap) => {
            // Get information about the notification that was opened
            console.log("NOTIFICATION OPENED:", self.item);
            if (self.item != '') {
                self.props.navigation.navigate({routeName:'ChatScreen', params: {item: self.item}, key: 'chat'})
            }
        })
    }

    subPage(text) {
        this.props.navigation.navigate('SubPageScreen', {'aspect': text})
    }

    pdfDisplay(text) {
        this.props.navigation.navigate('pdfDisplayScreen', {'title': text})
    }

    phonetree() {
        this.props.navigation.navigate('PhoneTreeScreen')
    }

    admin() {
        this.props.navigation.navigate('AdminScreen')
    }

    group() {
        this.props.navigation.navigate('MypanelScreen')
    }

    async fetchDocument() {
        RNFetchBlob.fs.isDir(resourceUrl).then((isDir) => {
            if(!isDir){
                RNFetchBlob.fs.mkdir(resourceUrl).then(mkdir => {console.log("directory create!", mkdir)})
            }
        }) 
        let remoteMD5 = await API.readRemoteMD5()
        var url = resourceUrl + 'localCheck.md5'

        RNFetchBlob.fs.exists(url).then((exist) => {
            console.log('md5 file exist', exist)
            if(exist) {
                RNFetchBlob.fs.readFile(url, 'utf8').then((localMD5) => { 
                    if(localMD5 == remoteMD5) {
                        console.log("Correct Sync!", localMD5)
                    } else {
                        RNFetchBlob.fs.unlink(resourceUrl).then(() => {
                            RNFetchBlob.fs.mkdir(resourceUrl).then(() =>{
                                RNFetchBlob.fs.writeFile(url, remoteMD5,'utf8').then(() => {
                                    API.updateFiles().then(() => {console.log('Update Success!')})
                                })
                            })
                        })
                    }
                })
            } else {
                RNFetchBlob.fs.unlink(resourceUrl).then(() => {
                    RNFetchBlob.fs.mkdir(resourceUrl).then(() => {
                        RNFetchBlob.fs.createFile(url, remoteMD5, 'utf8').then(() => {
                            API.updateFiles().then(() => {console.log('Update Success!')})
                        })
                    })
                })
            }
        })
         
        var safetyurl = resourceUrl + 'safetyplans.png'
        RNFetchBlob.fs.exists(safetyurl).then(exist => {
            var res = exist ? {'uri': "file://"+safetyurl} : Images.safetyplans
            this.setState({safetyplans: res})
        })

        var mapsurl = resourceUrl + 'maps.png'
        RNFetchBlob.fs.exists(mapsurl).then(exist => {
            var res = exist ? {'uri': "file://"+mapsurl} : Images.maps
            this.setState({maps: res})
        }) 

        var firsturl = resourceUrl + 'firstaid.png'
        RNFetchBlob.fs.exists(firsturl).then(exist => {
            var res = exist ? {'uri': "file://"+firsturl} : Images.firstaid
            this.setState({firstaid: res, loading: false})
        })
    }

    render() {
        var isAdmin = (user.role.toLowerCase().includes('administator') || user.role.toLowerCase().includes('manager'))  ? true : false;
        return (
            <Container style={this.state.loading ? styles.loading: styles.container}>
                <Header prop={this.props.navigation} />
                <ScrollView>
                    <View style={{flex: 1, padding: 10, backgroundColor: '#484D53'}}>
                        <TouchableOpacity style={styles.imageView} onPress={this.subPage.bind(this, 'safetyplan.pdf')}>
                            <Image
                                style={styles.safety}
                                source={this.state.safetyplans}
                            />
                        </TouchableOpacity>
                        { isAdmin == true ? <BigIcon img={Images.admin} title={Title.admin} onPress={this.admin.bind(this)}></BigIcon>:<View></View>}
                        <BigIcon img={Images.group} title={Title.group} onPress={this.group.bind(this)}></BigIcon>
                        <BigIcon img={Images.generalInfo} title={Title.firstaid} onPress={this.subPage.bind(this, 'general.pdf')}></BigIcon>
                        <BigIcon img={this.state.maps} title={Title.maps} onPress={this.subPage.bind(this, 'map.pdf')}></BigIcon>
                        <BigIcon img={Images.safetychat} title={Title.phonetree} onPress={this.phonetree.bind(this)}></BigIcon>
                    </View>
                </ScrollView>
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
    loading: {
        display: "none"
    },
    imageView: {
        width: responsiveWidth(80),
        marginLeft: responsiveWidth(10) - 5,
        height: 180,
        marginTop: 20,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#fff',
        backgroundColor: '#000',
        marginBottom: 5,
        alignItems: "center",
        justifyContent: "center"
    },
    safety: {
        width: responsiveWidth(80) - 60,
        height: 100,
        tintColor: '#fff',
        resizeMode: "stretch"
    },
    row:{
        marginLeft: responsiveWidth(10)-25,
        marginTop: 20,
        height: responsiveHeight(30)-40,
    },
    button: {
        marginLeft: 10,
        tintColor: '#53adcb',
        overlayColor: '#000',
        borderRadius: 10,
        borderWidth: 1,
        width: responsiveWidth(40)-5,
        height: responsiveHeight(30)-40,
        resizeMode: "stretch"
    },
    dialog: {
        alignItems: "center",
        top: responsiveHeight(50),
        left: responsiveWidth(50)-40,
        zIndex: 100,
        position: 'absolute'
    },
    dialogNone: {
        display: "none"
    },
});