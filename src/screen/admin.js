import React, { Component } from 'react'
import {
  StyleSheet,
  ImageBackground,
  FlatList,
} from 'react-native'
import { Container, Button, Label, Text} from 'native-base'
import {Images, Colors} from '../theme'
import Header from '../components/header'
import Icon from '../components/icon'
import { responsiveWidth } from 'react-native-responsive-dimensions'
import API from '../components/api'
import firebase from 'react-native-firebase'
import AppData from '../components/AppData'

export default class Admin extends Component {
    constructor(props){
        super(props)
        this.state = {
            groups: [],
            isFetching: false,
        }
        this.users = [];
        this.didFocusListener = null;
        mScreen = 'Admin'
    }

    async componentDidMount() {
        this.users = await API.getAllUsers()
        await this.getGroups();
        let self = this;
        this.didFocusListener =  await this.props.navigation.addListener('willFocus',
        payload => {
            console.log('Updated screen', payload);
            self.getGroups();
        });
    }

    async getGroups() {
        this.setState({isFetching: true});
        var all = {
            id: 'All',
            name: 'ALL USERS',
            users: this.users
        }
        var groups = [all]
        var mGroups = await API.getGroups()
        groups = groups.concat(mGroups);
        this.setState({groups, isFetching: false})
    }

    onGroup(group) {
        this.props.navigation.navigate('CreateGroupScreen', {group, isNew: false, users: this.users});
    }

    createGroup() {
        this.props.navigation.navigate('CreateGroupScreen', {users: this.users, isNew: true, group: {}});
    }

    async onRefresh() {
        this.setState({ isFetching: true }, function() { this.getGroups() });
    }

    render() {
        return (
            <Container style={styles.container}>
                <Header prop={this.props.navigation} />
                <ImageBackground source={Images.bg} style={{flex: 1, padding: 15}}>
                    <FlatList
                        data = {this.state.groups}
                        horizontal = {false}
                        showsVerticalScrollIndicator={false}
                        onRefresh={() => this.onRefresh()}
                        refreshing={this.state.isFetching}
                        numColumns = {2}
                        renderItem={({item}) =>
                            <Icon img={Images.group} onPress={this.onGroup.bind(this, item)} title={item.name}></Icon>
                        }
                        keyExtractor={item => item.id}
                    />
                </ImageBackground>
                <Button block style={styles.button} onPress={this.createGroup.bind(this)}><Text>Organize Group</Text></Button>
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
    button: {
        backgroundColor: '#000',
        marginBottom: 10,
        width: responsiveWidth(100) - 20,
        marginLeft: 10,
        borderWidth: 2,
        borderColor: '#fff'
    },
});