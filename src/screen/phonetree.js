import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TextInput,
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
           key: ''
        }
        global.mScreen = 'PhoneTree'
        this.didFocusListener = null;
        this.onFilter = this.onFilter.bind(this);
        this.allIds = [];
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
                ids.push({id: channel.id, name: channel.name, date, isBadge, image: channel.image});
            }
        });
        ids = ids.sort((a,b) => new Date(b.date) - new Date(a.date));
        this.allIds = ids;
        this.setState({ids, channels, key: ''});
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
        var url = item.image == null ? <Avatar rounded title={name.slice(0,2).toUpperCase()} /> : {source: { uri: item.image }};
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

    onFilter(text) {
        if (text == '') {
            this.setState({key: '', ids: this.allIds});
            return;
        }
        let ids = this.allIds.filter(item => String(item.name).toUpperCase().includes(text.toUpperCase()));
        this.setState({key: text, ids});
    }

    render() {
        return (
            <Container style={this.state.loading ? styles.loading: styles.container}>
                <Header prop={this.props.navigation} />
                <View>
                    <View style={styles.borderStyle}>
                        <TextInput  placeholder="Search..." style={styles.textInput} value={this.state.key} onChangeText={text=>this.onFilter(text)} />
                    </View>
                    <FlatList 
                        style={{...ifIphoneX({height: responsiveHeight(100) - 155}, {height: responsiveHeight(100)-135})}}
                        data={this.state.ids}
                        renderItem={this.renderRow}
                        showsVerticalScrollIndicator={true}
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
        backgroundColor: '#fff',
    },
    borderStyle: {
        height: 40,
        width: responsiveWidth(100) - 20,
        marginLeft: 10,
        borderWidth: 1,
        borderRadius: 20,
        marginTop: 5,
        marginBottom: 5,
        backgroundColor: '#fff'
    },
    title: {
        color: '#fff',
        fontSize: 30,
    },
    textInput: {
        fontSize: 18,
        textAlignVertical: 'center',
        height: 40,
        marginLeft: 12,
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