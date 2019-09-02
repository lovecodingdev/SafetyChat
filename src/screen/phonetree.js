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
import {ifIphoneX} from 'react-native-iphone-x-helper'

export default class phonetree extends Component {
    constructor(props) {
        super(props)
        this.companycode = ''
        this.selfname = ''
        this.role = ''
        this.state = {
           users: [],
        }
        
        
    }

    async componentDidMount() {
        var self = this
        this.companycode = await AppData.getItem('Companycode')
        this.selfname = await AppData.getItem('username')
        this.role = await AppData.getItem('role')
        firebase.database().ref(this.companycode+'/users').once('value', function(snapshot) {
            var users = Array()
            snapshot.forEach(function(item) {
                users.push(item.key)
                //var user = item.key
                //users.push(user.charAt(0).toUpperCase() + user.slice(1))
            })
            users.sort()
            self.setState({users})
        })

        //message receive process
        var messageListener = firebase.messaging().onMessage((message) => {
            Alert.alert(
                'Notification',
                'Message from '+message._data.fromname,
                [
                    {
                        text: 'View', onPress: () => {
                            var name = ''
                            message._data.group == '1' ? name = '123group' : name = message._data.fromname
                            self.props.navigation.navigate({routeName:'ChatScreen', params: {name: name}, key: 'chat'})   
                        }
                    },
                    {
                        text: 'Cancel',
                        onPress: () => console.log(self.props.navigation.state.routeName),
                        style: 'cancel',
                    },
                ],
                {cancelable: false},
            )
        })

        //when screen focused, message listener starting
        this.didFocusSubscription = this.props.navigation.addListener(
            'willFocus',
            (payload) => {
                messageListener = firebase.messaging().onMessage((message) => {
                    Alert.alert(
                        'Notification',
                        'Message from '+message._data.fromname,
                        [
                            {
                                text: 'View', onPress: () => {
                                    var name = ''
                                    message._data.group == '1' ? name = '123group' : name = message._data.fromname
                                    self.props.navigation.navigate({routeName:'ChatScreen', params: {name: name}, key: 'chat'})   
                                }
                            },
                            {
                                text: 'Cancel',
                                onPress: () => console.log(self.props.navigation.state.routeName),
                                style: 'cancel',
                            },
                        ],
                        {cancelable: false},
                    )
                })
            }
        )

        //when screen unfocus, remove message listener
        this.willBlurSubscription = this.props.navigation.addListener(
            'willBlur',
            payload => {
                messageListener()
            }
        )

        // const channel = new firebase.notifications.Android.Channel('insider', 'insider channel', firebase.notifications.Android.Importance.Max)
        // firebase.notifications().android.createChannel(channel);
        // this.createNotificationListeners();
    }

    componentWillUnmount() {
        this.willBlurSubscription.remove()
        this.didFocusSubscription.remove()
        //this.createNotificationListeners()
    }

    chat(item) {
        this.props.navigation.navigate({routeName:'ChatScreen', params: {name: item}, key: 'chat'})
    }

    renderRow = ({item}) => {
        var self = this
        if(this.selfname != item) {
            return (
                <View style={styles.listItem}>
                    <TouchableOpacity onPress={self.chat.bind(self, item)}>
                        <Text style={styles.item}>{item}</Text>
                    </TouchableOpacity>
                </View>
            )
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
        this.props.navigation.navigate({routeName:'ChatScreen', params: {name: '123group'}, key: 'chat'})
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
                        <Text style={styles.title}>Safety Chat</Text>
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
                            style={{...ifIphoneX({height: responsiveHeight(100)-285}, {height: responsiveHeight(100)-265})}}
                            data={this.state.users}
                            renderItem={this.renderRow}
                            showsVerticalScrollIndicator={true}
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