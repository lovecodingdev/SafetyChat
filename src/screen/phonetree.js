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
  Alert,
  } from 'react-native';
import { Images, Title } from '../theme';
import { Container } from 'native-base';
import { responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions';
import Header from '../components/header'
import API from "../components/api"
import firebase from 'react-native-firebase'
import AppData from '../components/AppData'

export default class phonetree extends Component {
    constructor(props) {
        super(props)
        this.companycode = ''
        this.selfname = ''
        this.role = ''
        this.state = {
           users: [],
           unread: ''
        }
        
        
    }

    async componentDidMount() {
        var self = this
        this.companycode = await AppData.getItem('Companycode')
        this.selfname = await AppData.getItem('username')
        this.role = await AppData.getItem('role')
        firebase.database().ref(this.companycode+'/users').once('value', function(snapshot) {
            var users = []
            snapshot.forEach(function(item) {
                users.push(item.key)
            })
            self.setState({users})
        })

        //unread message register to other user
        this.messageListener = firebase.messaging().onMessage((message) => {
            Alert.alert(
                'Notification',
                'Message from '+message._data.fromname,
                [
                    {text: 'View', onPress: () => {
                            this.messageListener()
                            message._data.group == '1' ? name = '123group' : name = message._data.fromname
                            this.props.navigation.navigate('ChatScreen', {name: name})
                        }
                    },
                    {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                    },
                ],
                {cancelable: false},
            );
        })

        // const channel = new firebase.notifications.Android.Channel('insider', 'insider channel', firebase.notifications.Android.Importance.Max)
        // firebase.notifications().android.createChannel(channel);
        // this.createNotificationListeners();
    }

    componentWillUnmount() {
        this.messageListener()
        //this.createNotificationListeners()
    }

    chat(item) {
        this.messageListener()
        this.props.navigation.navigate('ChatScreen', {name: item})
    }

    renderRow = ({item}) => {
        var self = this
        var res = ''
        if(this.selfname != item) {
            return (
                <View style={styles.listItem}>
                    <TouchableOpacity onPress={self.chat.bind(self, item)}>
                        <Text style={styles.item}>{item}</Text>
                    </TouchableOpacity>
                    {/* <Text>{snapshot.val() == 1 ? '?' : ''}</Text> */}
                </View>
            )
            // firebase.database().ref('unread/'+self.selfname+'/'+item).once('value', function(snapshot) {
            //     console.log(snapshot.val())
            //     res = snapshot.val()
            // })

            // return (
            //     <View>
            //         <TouchableOpacity onPress={self.chat.bind(self, item)} style={styles.listItem}>
            //             <Text style={styles.item}>{item}</Text>
            //         </TouchableOpacity>
            //         <Text>{ res == 1 ? '?' : ''}</Text>
            //     </View>
            // )
            
        }
    }
          
    // async createNotificationListeners() {
    //     firebase.notifications().onNotification(notification => {
    //         //notification.android.setSmallIcon(Images.logo)
    //         notification.android.setChannelId('insider').setSound('default')
    //         console.log('in app note:', notification)
    //         firebase.notifications().displayNotification(notification)
    //     });
    // }
    
    onGroup() {
        this.messageListener()
        this.props.navigation.navigate('ChatScreen', {name: '123group'})
    }

    render() {
        console.log(this.role)
        return (
            <Container style={this.state.loading ? styles.loading: styles.container}>
                <Header prop={this.props.navigation} />
                <View style={{padding: 10}}>
                    <View style={{flexDirection: 'row', padding: 10, height: 60, alignContent: 'center'}}>
                        <View style={{width: 50,height: 50}}>
                            <Image source={Images.logo} style={{width: '100%', height: '100%'}}></Image>
                        </View>
                        <Text style={styles.title}>Phone Tree</Text>
                    </View>
                    <View>
                        <Text style={styles.title}>My Group</Text>
                        <View style={styles.listItem}>
                            <TouchableOpacity onPress={this.onGroup.bind(this)}>
                                <Text style={styles.item}>
                                    {this.role}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{marginTop: 10}}>
                        <Text style={styles.title}>Users</Text>

                        <FlatList 
                            data={this.state.users}
                            renderItem={this.renderRow}
                            //keyExtractor={item}
                        />
                    </View>
                </View>
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
        backgroundColor: '#484D53',
    },
    title: {
        color: '#fff',
        fontSize: 30,
    },
    item: {
        color: '#fff',
        fontSize: 20,
    },
    listItem: {
        borderBottomColor: '#fff',
        borderBottomWidth: 1,
        padding: 5,
    }
});