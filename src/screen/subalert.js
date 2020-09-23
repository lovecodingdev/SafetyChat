import React, { Component } from 'react'
import {
  StyleSheet,
  ImageBackground,
  Alert,
  TouchableOpacity,
  Image
} from 'react-native'
import { Container, Button, Label, Text} from 'native-base'
import { NavigationActions } from 'react-navigation'
import {Images, Title} from '../theme'
import AppData from '../components/AppData'
import Header from '../components/header'
import BigIcon from '../components/bigicon'
import RNFetchBlob from 'rn-fetch-blob'
import API from "../components/api"
import { responsiveWidth } from 'react-native-responsive-dimensions'

const resourceUrl = Platform.OS === 'ios' ? RNFetchBlob.fs.dirs.DocumentDir+"/safety/" : "/storage/emulated/0/safetyDir/"

export default class Subalert extends Component {
    constructor(props){
        super(props)
        this.state = {
            safetyplans: '',
            maps: '',
        }
        mScreen = 'Subalert'
    }

    async componentDidMount() {
        var safetyurl = resourceUrl + 'safetyplans.png'
        RNFetchBlob.fs.exists(safetyurl).then(exist => {
            var res = exist ? {'uri': "file://"+safetyurl} : Images.safetyplans
            this.setState({safetyplans: res})
        })

        var mapsurl = resourceUrl + 'maps.png'
        RNFetchBlob.fs.exists(mapsurl).then(exist => {
            var res = exist ? {'uri': "file://"+mapsurl} : Images.maps
            this.setState({maps: res})
        }) 
    }

    subPage(text) {
        this.props.navigation.navigate('SubPageScreen', {'aspect': text})
    }

    render() {
        return (
            <Container style={styles.container}>
                <Header prop={this.props.navigation} />
                <ImageBackground source={Images.bg} style={{flex: 1, padding: 15}}>
                    <TouchableOpacity style={styles.imageView} onPress={this.subPage.bind(this, 'safetyplan.pdf')}>
                        <Image
                            style={styles.safety}
                            source={this.state.safetyplans}
                        />
                    </TouchableOpacity>
                    <BigIcon img={this.state.maps} title={Title.maps} onPress={this.subPage.bind(this, 'map.pdf')}></BigIcon>
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
    safety: {
        width: responsiveWidth(80) - 60,
        height: 100,
        tintColor: '#fff',
        resizeMode: "stretch"
    },
    imageView: {
        width: responsiveWidth(80),
        marginLeft: responsiveWidth(10) - 5,
        height: 180,
        marginTop: 20,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#fff',
        backgroundColor: '#000',
        marginBottom: 5,
        alignItems: "center",
        justifyContent: "center"
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