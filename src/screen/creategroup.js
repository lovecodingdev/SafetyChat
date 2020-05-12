import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    TextInput,
    Alert,
    Image,
    TouchableOpacity,
    Platform,
    KeyboardAvoidingView,
} from 'react-native'
import {Button, Text, Label} from 'native-base'
import {Images, Colors} from '../theme'
import Header from '../components/header'
import ManyChoices from '../components/ManyChoices'
import Spinner from 'react-native-loading-spinner-overlay'
import firebase from 'react-native-firebase'
import ImagePicker from 'react-native-image-crop-picker'
import API from '../components/api'

export default class CreateGroup extends Component {
    constructor(props){
        super(props)
        this.state = {
            isInvited: false,
            loading: false,
            title: '',
            indexes: [],
            isNew: true,
            group: null,
            image: null,
            path: '',
        }
        this.users = props.navigation.getParam('users').map(user => user.name);
        mScreen = 'CreateGroup';
    }

    async componentDidMount() {
        let isNew = this.props.navigation.getParam('isNew');
        var indexes = [];
        if (!isNew) {
            let group = this.props.navigation.getParam('group');
            group.users.map(obj => {
                indexes.push(this.users.findIndex(a => a == obj));
            })
            let image = group.image == null ? Images.group : {'uri': group.image};
            console.log("Group URL =", image);
            this.setState({isNew, group, title: group.name, indexes, image});
        } else {
            this.setState({image: Images.group});
        }
    }

    onDialog() {
        this.setState({isInvited: true});
    }

    async onCreate() {
        var {indexes, title, group, isNew, path} = this.state;
        if (title == '') {
            alert('Please type your group title');
            return
        }
        if (indexes.length == 0) {
            alert('Please select at lease one user.');
            return;
        }
        var choices = []
        choices = indexes.map(index => this.users[index]);
        this.setState({loading: true})
        let self = this;
        let date = new Date();
        if (isNew) {
            let image = null;
            if (path != '') {
                image = await API.uploadImage(path, date.toString());
            }
            self.setState({loading: false});
            const newRef = firebase.database().ref().child(user.code + '/groups').push();
            newRef.set({
                title: title,
                users: choices,
                image: image,
            })
            .then(() => {
                alert("Successfully Created");
                setTimeout(() => {
                    self.props.navigation.goBack();
                }, 300);
            });
        } else {
            var url = '';
            if (path != '') {
                url = await API.uploadImage(path, date.toString());
                self.setState({loading: false});
                firebase.database().ref().child(user.code + '/groups/' + group.id).update({
                    title: title,
                    users: choices,
                    image: url,
                }).then(()=>{
                    alert("Successfully Edited");
                    setTimeout(() => {
                        self.props.navigation.goBack();
                    }, 300);
                })
            } else {
                self.setState({loading: false});
                firebase.database().ref().child(user.code + '/groups/' + group.id).update({
                    title: title,
                    users: choices
                }).then(()=>{
                    alert("Successfully Edited");
                    setTimeout(() => {
                        self.props.navigation.goBack();
                    }, 300);
                })
            }
        }
    }

    onChangedSelectedUsers(questionIndex, checkedIndexes) {
        this.setState({indexes: checkedIndexes})
    }

    onSelect() {
        this.setState({isInvited: false})
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
                            self.setState({image: {'uri': image.path}, path});
                        });
                    },
                },
            ],
            {cancelable: true},
        )
        // ImagePicker.showImagePicker(options, (response) => {
        //     if (response.didCancel) {
        //       console.log('User cancelled image picker');
        //     } else if (response.error) {
        //       console.log('ImagePicker Error: ', response.error);
        //     } else {
        //       const source = { uri: response.uri };
        //       var path = '';
        //       if (Platform.OS == 'ios')
        //         path = response.uri.toString();
        //       else {
        //         path = response.path.toString();
        //       }
        //       this.setState({
        //         image: source,
        //         path: path
        //       });
        //     }
        //   });
    }

    onDelete() {
        let self = this;
        Alert.alert(
            'DELETE',
            'Are you sure you want to delete this group?',
            [
                {
                    text: 'Delete', onPress: async () => {
                        firebase.database().ref().child(user.code + '/groups/' + this.state.group.id).remove()
                        .then((error) => {
                            if (error == null) {
                                alert("Successfully Edited");
                                setTimeout(() => {
                                    self.props.navigation.goBack();
                                }, 300);
                            }
                        })
                        firebase.database().ref().child(user.code + '/groupMessages/' + this.state.group.id).remove()
                        .then((error) => {
                        })
                    }
                },
                {
                    text: 'Cancel',
                    onPress: () => console.log('cancel'),
                    style: 'cancel',
                },
            ],
            {cancelable: false},
        )
    }

    render() {
        let {indexes, isInvited, isNew, image} = this.state;
        let title = isNew ? "CREATE GROUP" : "EDIT GROUP";
        return (
            <KeyboardAvoidingView
                behavior={Platform.OS == "ios" ? "padding" : "position"}
                style={{flex: 1,backgroundColor: '#484D53'}}>
                <Header prop={this.props.navigation} />       
                {isInvited == true ?
                <View style={styles.view}>
                    <Label style={styles.label}>SELECT USERS</Label>
                    <ManyChoices many={true} data={this.users} checkedIndexes={indexes} onChanged={this.onChangedSelectedUsers.bind(this)}/>
                    <Button block style={styles.button} onPress={this.onSelect.bind(this)}><Text>SELECT</Text></Button>
                </View>:
                <View>
                    <Text style={styles.title}>{title}</Text>
                    <TouchableOpacity style={styles.touchImage} onPress={this.updateProfile.bind(this)}>
                        <Image
                            style={styles.profile}
                            source={image}
                        />
                    </TouchableOpacity>
                    <View style={{padding: 20}}>        
                        <Label style={{color: '#fff'}}>GROUP TITLE</Label>
                        <TextInput style={styles.textInput} autoCapitalize='none' value={this.state.title} onChangeText={text=>this.setState({title: text})}/>
                        <Button transparent onPress={this.onDialog.bind(this)}><Text>Select Users</Text></Button>
                        <Button block style={styles.button} onPress={this.onCreate.bind(this)}><Text>{title}</Text></Button>
                        <Button block style={isNew? styles.none: styles.button} onPress={this.onDelete.bind(this)}><Text>DELETE</Text></Button>
                    </View>
                    <Spinner
                        visible={this.state.loading}
                        textContent={''}
                    />
                </View>}
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
    label: {
        color: '#fff',
        marginTop: 20,
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    none: {
        display: 'none'
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
    textInput: {
        marginTop: 10,
        marginBottom: 5,
        borderWidth: 1, 
        borderRadius: 5, 
        borderColor:'#fff', 
        color: '#fff',
        height: 40
    },
    button: {
        backgroundColor: '#000',
        marginTop: 5,
        borderWidth: 2,
        borderColor: '#fff'
    },
});