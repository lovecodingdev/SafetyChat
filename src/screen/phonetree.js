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
import {ListItem, Avatar} from 'react-native-elements'

export default class phonetree extends Component {
    constructor(props) {
        super(props);
        this.state = {
           ids: [],
           channels: [],
        }
        global.mScreen = 'PhoneTree'
        this.didFocusListener = null;
    }

    async componentDidMount() {
        let self = this;
        this.didFocusListener =  await this.props.navigation.addListener('willFocus',
        payload => {
            console.log('Updated screen', payload);
            self.didUpdateUsers();
        });
    }

    async didUpdateUsers() {
        let users = await AppData.getItem('Users');
        let groups = await AppData.getItem('Groups');
        var channels = users.concat(groups);
        var ids = [];
        await this.asyncForEach(channels, async(channel) => {
            if (channel.name != user.name) {
                let date = await AppData.getItem(channel.id);
                var readDate = await AppData.getItem(channel.id+"read");
                if (readDate > date) {
                    isBadge = false;
                } else if (date == null || date == undefined) {
                    isBadge = false;
                } else if (readDate < date) {
                    isBadge = true;
                } else if (readDate == null && date != null) {
                    isBadge = true;
                }
                ids.push({id: channel.id, date, isBadge});
            }
        });
        ids = ids.sort((a,b) => new Date(b.date) - new Date(a.date));
        console.log("dates = ", ids);
        this.setState({ids, channels});
    }

    componentWillUnmount() {
        this.didFocusListener.remove();
    }

    async asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array);
        }
    }

    chat(item) {
        this.props.navigation.navigate({routeName:'ChatScreen', params: {item: item}, key: 'chat'})
    }

    getChannelFromId(id) {
        var chanel = null;
        let {channels} = this.state;
        channels.forEach(function(channel) {
            if (channel.id == id) {
                chanel = channel;
            }
        })
        return chanel;
    }

    renderRow = ({item}) => {
        var channel = this.getChannelFromId(item.id);
        var name = channel.name;
        var isBadge = item.isBadge;
        var url = item.image == null ? <Avatar rounded title={name.slice(0,2).toUpperCase()} /> : "source:" + { uri: item.image };
        if (isBadge == true) {
            return (
                <ListItem title={name.charAt(0).toUpperCase() + name.slice(1)}
                    leftAvatar={url}
                    subtitle={channel.role.toUpperCase()}
                    onPress={this.chat.bind(this, channel)}
                    bottomDivider
                    chevron
                    badge={{value: 1}}
                />
            )
        } else {
            return (
                <ListItem title={name.charAt(0).toUpperCase() + name.slice(1)}
                    leftAvatar={url}
                    subtitle={channel.role.toUpperCase()}
                    onPress={this.chat.bind(this, channel)}
                    bottomDivider
                    chevron
                />
            )
        }
    }

    render() {
        return (
            <Container style={this.state.loading ? styles.loading: styles.container}>
                <Header prop={this.props.navigation} />
                <View>
                    <FlatList 
                        style={{...ifIphoneX({height: responsiveHeight(100) - 105}, {height: responsiveHeight(100)-85})}}
                        data={this.state.ids}
                        renderItem={this.renderRow}
                        showsVerticalScrollIndicator={true}
                        //keyExtractor={item}
                    />
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