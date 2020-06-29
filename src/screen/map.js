import React, { Component } from 'react';
import {
  StyleSheet,
  ImageBackground,
  Text,
  Alert,
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
            location: {
                latitude: 0,
                longitude: 0,
            },
        }
    }

    componentDidMount() {
      
      let item = this.props.navigation.getParam('item');
      console.log("Map item,", item);
      let location = {
        latitude: item.lat,
        longitude: item.lon,
    }
      this.setState({location});
      if (item == undefined || item == null) {
          Alert.alert("Error", "No geolocation data.");
          return;
      }
    }

    render() {
        let {location} = this.state;
        return (
            <Container style={styles.container}>
                <Header prop={this.props.navigation} />
                <MapView
                    initialRegion={{
                        latitude: location.latitude,
                        longitude: location.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                    style={styles.map}
                >
                    <Marker
                        coordinate={location}
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