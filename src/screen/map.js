import React, { Component } from 'react';
import {
  StyleSheet,
  ImageBackground,
  Text,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Images, Colors } from '../theme';
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
            mapType: 'standard',
            location: {
                latitude: 37.78825,
                longitude: -122.4324,
            },
            image: Images.satellite,
            title: "",
            message: "",
        }
    }

    componentDidMount() {
      
      let item = this.props.navigation.getParam('item');
      console.log("Map item,", item);
      let location = {
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon),
      }
      let title = item.name;
      let message = item.message;
      this.setState({location, title, message});

      if (item == undefined || item == null) {
          Alert.alert("Error", "No geolocation data.");
          return;
      } else {
        setTimeout(() => {
            Alert.alert(title, message);
        }, 1000) 
      }
    }

    changeMapStyle() {
        let mapType = this.state.mapType === 'satellite' ? 'standard' : 'satellite';
        let image = this.state.image == Images.standard ? Images.satellite : Images.standard;
        this.setState({ mapType, image});
    }

    render() {
        let {location, title, message, mapType, image} = this.state;
        return (
            <Container style={styles.container}>
                <Header prop={this.props.navigation} />
                <MapView
                    provider={PROVIDER_GOOGLE}
                    mapType={mapType}
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
                <TouchableOpacity style={styles.touchImage} onPress={this.changeMapStyle.bind(this)}>
                    <Image
                        style={styles.profile}
                        source={image}
                    />
                </TouchableOpacity>
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
    touchImage: {
        position: 'absolute',
        right: 20,
        bottom: 20,
    },
    profile: {
        width: 60,
        height: 60,
        borderColor: '#2ECC71',
        borderWidth: 1,
        resizeMode: 'cover'
    },
});