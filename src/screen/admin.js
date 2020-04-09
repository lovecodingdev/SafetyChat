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
import AppData from '../components/AppData'

export default class Admin extends Component {
    constructor(props){
        super(props)
        this.state = {
            groups: [],
            isFetching: false,
        }
        this.users = []
        mScreen = 'Admin'
    }

    async componentDidMount() {
        this.users = await API.getAllUsers()
        this.getGroups()
    }

    async getGroups() {
        var all = {
            id: 'All',
            title: 'ALL USERS',
            users: this.users
        }
        var groups = [all]
        var mGroups = await API.getGroups()
        groups = groups.concat(mGroups);
        this.setState({groups, isFetching: false})
    }

    onGroup(id) {
        console.log('ID = ', id);
    }

    createGroup() {
        this.props.navigation.navigate('CreateGroupScreen')
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
                            <Icon img={Images.group} onPress={this.onGroup.bind(this, item['id'])} title={item['title']}></Icon>
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