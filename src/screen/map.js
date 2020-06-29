import React, { Component } from 'react';
import {
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { Images } from '../theme';
import { Container } from 'native-base';
import Header from '../components/header'
import firebase from 'react-native-firebase'
import api from '../components/api';
import Geolocation from 'react-native-geolocation-service';
import MapView, {Marker} from 'react-native-maps';

export default class map extends Component {

    constructor(props) {
        super(props)

        this.state = {
            loading: false,
            location: null,
        }
    }

    componentDidMount() {
      let location = {
          latitude: 37.78825,
          longitude: -122.4324
      }
      this.setState({location});
    }

    render() {
        return (
            <Container style={styles.container}>
                <Header prop={this.props.navigation} />
                <MapView
                    initialRegion={{
                        latitude: 37.78825,
                        longitude: -122.4324,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                    style={styles.map}
                >
                    <Marker
                        coordinate={this.state.location}
                        title={"Marker"}
                        description={"Emergency"}
                    />
                </MapView>
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch'
    },
    map: {
        flex: 1,
    },
});