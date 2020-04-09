import React, { Component } from 'react'
import {
  StyleSheet,
  ImageBackground,
  View,
  TextInput,
  ScrollView
} from 'react-native'

import { Container, Button, Label, Text} from 'native-base'
import {Images, Colors} from '../theme'
import { responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions'
import API from '../components/api'
import Header from '../components/header'
import AppData from '../components/AppData'
import Spinner from 'react-native-loading-spinner-overlay'
import firebase from 'react-native-firebase'

export default class Group extends Component {
    constructor(props){
        super(props)
        this.state = {
        }
    }

    render() {
        return (
            <Container style={styles.container}>
                <Header prop={this.props.navigation} />
                <ScrollView>
                    <View style={{flex: 1, padding: 10, backgroundColor: '#484D53'}}>
                    
                    </View>
                </ScrollView>
            </Container>
        );
    }
}
  
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch'
    },
});