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
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';

export default class map extends Component {

    constructor(props) {
        super(props)

        this.state = {
            loading: false,
            location: {
                latitude: 37.78825,
                longitude: -122.4324,
            },
            title: "",
            message: "",
        }
    }

    componentDidMount() {
      
      let item = this.props.navigation.getParam('item');
      console.log("Map item,", item);
      let location = {
        latitude: item.lat,
        longitude: item.lon,
      }
      let title = item.name;
      let message = item.message;
      this.setState({location, title, message});
      if (item == undefined || item == null) {
          Alert.alert("Error", "No geolocation data.");
          return;
      }
    }

    render() {
        let {location, title, message} = this.state;
        return (
            <Container style={styles.container}>
                <Header prop={this.props.navigation} />
                <MapView
                    provider={PROVIDER_GOOGLE}
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
                        title={title}
                        description={message}
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