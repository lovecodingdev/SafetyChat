import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    Platform,
    KeyboardAvoidingView,
} from 'react-native'
import {Button, Text} from 'native-base'
import {Images, Colors} from '../theme'
import Header from '../components/header'
import Spinner from 'react-native-loading-spinner-overlay'
import firebase from 'react-native-firebase'
import ImagePicker from 'react-native-image-picker'
import API from '../components/api'
import AppData from '../components/AppData'
const options = {
    title: 'Select Profile Image',
    customButtons: [],
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };

export default class SelectGroup extends Component {
    constructor(props){
        super(props)
        this.state = {
            loading: false,
            image: null,
            path: '',
        }
        mScreen = 'SelectGroup';
    }

    componentDidMount() {
        let image = user.image == null? Images.logo: {'uri': user.image};
        this.setState({image});
    }

    updateProfile() {
        let self = this;
        ImagePicker.showImagePicker(options, (response) => {
            if (response.didCancel) {
              console.log('User cancelled image picker');
            } else if (response.error) {
              console.log('ImagePicker Error: ', response.error);
            } else {
              const source = { uri: response.uri };
              var path = '';
              if (Platform.OS == 'ios')
                path = response.uri.toString();
              else {
                path = response.path.toString();
              }
              this.setState({
                image: source,
                path: path
              });
            }
        });
    }

    async onEdit() {
        let self = this;
        let {path} = this.state;
        var date = new Date();
        this.setState({loading: true});
        if (path != '') {
            var url = await API.uploadImage(path, date.toString());
            self.setState({loading: false});
            await firebase.database().ref().child(user.code + '/users/' + user.name).update({
                image: url,
            });
            await AppData.setItem('userimage', url);
            user.image = url;
            alert("Successfully Edited");
            setTimeout(() => {
                self.props.navigation.goBack();
            }, 300);
        } else {
            self.setState({loading: false});
            alert("Successfully Edited");
            setTimeout(() => {
                self.props.navigation.goBack();
            }, 300);
        }
    }

    render() {
        let {image} = this.state;
        return (
            <KeyboardAvoidingView
                behavior={Platform.OS == "ios" ? "padding" : "position"}
                style={{flex: 1,backgroundColor: '#484D53'}}>
                <Header prop={this.props.navigation} />       
                <View>
                    <Text style={styles.title}>EDIT PROFILE IMAGE</Text>
                    <TouchableOpacity style={styles.touchImage} onPress={this.updateProfile.bind(this)}>
                        <Image
                            style={styles.profile}
                            source={image}
                        />
                    </TouchableOpacity>
                    <View style={{padding: 20}}>        
                        <Button block style={styles.button} onPress={this.onEdit.bind(this)}><Text>EDIT</Text></Button>
                    </View>
                    <Spinner
                        visible={this.state.loading}
                        textContent={''}
                    />
                </View>
            </KeyboardAvoidingView>
        );
    }
}
  
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
        backgroundColor: '#484D53'
    },
    view: {
        alignItems: 'center',
        backgroundColor: 'rgba( 0, 0, 0, 0.6 )'
    },

    profile: {
        width: 140,
        height: 140,
        borderRadius: 70,
        borderColor: Colors.white,
        borderWidth: 1,
        resizeMode: 'cover'
    },
    touchImage: {
        alignSelf: 'center',
    },
    title: {
        textAlign: 'center', 
        color: '#fff', 
        fontSize: 25, 
        marginBottom: 20,
        marginTop: 20,
    },
    button: {
        backgroundColor: '#000',
        marginTop: 5,
        borderWidth: 2,
        borderColor: '#fff'
    },
});