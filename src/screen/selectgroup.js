import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    Platform,
    KeyboardAvoidingView,
    Alert,
} from 'react-native'
import {Button, Text} from 'native-base'
import {Images, Colors} from '../theme'
import Header from '../components/header'
import Spinner from 'react-native-loading-spinner-overlay'
import firebase from 'react-native-firebase'
import ImagePicker from 'react-native-image-crop-picker'
import API from '../components/api'
import AppData from '../components/AppData'

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
        var path = '';
        Alert.alert(
            'Profile',
            'Select from ...',
            [
                {
                    text: 'CAMERA', onPress: () => {
                        ImagePicker.openCamera({
                            width: 300,
                            height: 300,
                            cropping: true
                        }).then(image => {
                            path = image.path;
                            user.image = path;
                            self.setState({image: {'uri': image.path}, path});
                        });
                    }
                },
                {
                    text: 'LIBRARY', onPress: () => {
                        ImagePicker.openPicker({
                            width: 300,
                            height: 300,
                            cropping: true
                        }).then(image => {
                            path = image.path;
                            user.image = path;
                            self.setState({image: {'uri': image.path}, path});
                        });
                    },
                },
            ],
            {cancelable: true},
        )
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
                        <Button block style={styles.button} onPress={this.onEdit.bind(this)}><Text>SUBMIT</Text></Button>
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