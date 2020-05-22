import React, { Component } from 'react'
import {
  StyleSheet,
  ImageBackground,
} from 'react-native'
import { Container, Button, Label, Text} from 'native-base'
import {Images, Title} from '../theme'
import Header from '../components/header'
import BigIcon from '../components/bigicon'
import { responsiveWidth } from 'react-native-responsive-dimensions'

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

    onGroup() {
        this.props.navigation.navigate('SubadminScreen');
    }

    onAlert() {

    }

    render() {
        return (
            <Container style={styles.container}>
                <Header prop={this.props.navigation} />
                <ImageBackground source={Images.bg} style={{flex: 1, padding: 15}}>
                    <BigIcon img={Images.group} title={Title.menuGroup} onPress={this.onGroup.bind(this)}></BigIcon>
                    <BigIcon img={Images.alert} title={Title.menuAlert} onPress={this.onAlert.bind(this)}></BigIcon>
                </ImageBackground>
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