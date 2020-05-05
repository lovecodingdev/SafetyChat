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

export default class SelectGroup extends Component {
    constructor(props){
        super(props)
        this.state = {
            groups: [],
            isFetching: false,
        }
        this.users = [];
        this.childChangedRef = null;
        mScreen = 'SelectGroup'
    }

    async componentDidMount() {
        this.users = await AppData.getItem('Users')
        this.getGroups();
        let self = this;
        this.didFocusListener =  await this.props.navigation.addListener('willFocus',
        payload => {
            console.log('Updated screen', payload);
            self.getGroups();
        });
    }

    getGroups() {
        let self = this;
        firebase.database().ref().child(user.code + '/groups').once('value')
        .then((snapshots) => {
            var mGroups = []
            snapshots.forEach(function(snapshot) {
                var id = snapshot.key;
                var name = snapshot.val()['title'];
                var users = snapshot.val()['users'];
                if (users.includes(user.name)) {
                    var group = {
                        id,
                        name,
                        role: 'GROUP',
                        users,
                        isGroup: true,
                    }
                    mGroups.push(group)
                }
            })
            AppData.setItem('Groups', mGroups);
            self.setState({groups: mGroups})
        })
    }

    onGroup(group) {
        this.props.navigation.navigate({routeName:'ChatScreen', params: {item: group}, key: 'chat'})
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
                {/* <Button block style={styles.button} onPress={this.createGroup.bind(this)}><Text>Organize Group</Text></Button> */}
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