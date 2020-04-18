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
           channels: [],
        }
        
        global.mScreen = 'PhoneTree'
    }

    async componentDidMount() {
        let users = await API.getAllUsers();
        let groups = await API.getGroups();

        var channels = users.concat(groups);
        this.setState({channels});
    }


    chat(item) {
        this.props.navigation.navigate({routeName:'ChatScreen', params: {name: item}, key: 'chat'})
    }

    renderRow = ({item}) => {
        var name = item.name;
        if(user.name != name) {
            return (
                <ListItem title={name.charAt(0).toUpperCase() + name.slice(1)}
                    leftAvatar={<Avatar rounded title={name.slice(0,2).toUpperCase()} />}
                    subtitle={item.role.toUpperCase()}
                    onPress={this.chat.bind(this, item)}
                    bottomDivider
                    chevron
                    // badge={{value: 3}}
                />
            )
        }
    }
    
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
                    <View style={{marginTop: 10}}>
                        <FlatList 
                            style={{...ifIphoneX({height: responsiveHeight(100) - 190}, {height: responsiveHeight(100)-170})}}
                            data={this.state.channels}
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