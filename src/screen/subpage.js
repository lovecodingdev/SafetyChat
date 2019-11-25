import React, { Component } from 'react';
import {
  StyleSheet,
  ImageBackground,
  FlatList,
  Platform,
  Alert,
  } from 'react-native';
import { Images, Title } from '../theme';
import { Container } from 'native-base';
import { responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions';
import Header from '../components/header'
import RNFetchBlob from 'rn-fetch-blob'
import Icon from '../components/icon'
import firebase from 'react-native-firebase'

const resourceUrl = Platform.OS === 'ios' ? RNFetchBlob.fs.dirs.DocumentDir + "/safety/" : "/storage/emulated/0/safetyDir/"

export default class subpage extends Component {

    constructor(props) {
        super(props)
        this.state ={
            file: [{}],
            isFetching: false
        }
        global.mScreen = 'Subpage'
    }

    componentWillUnmount() {
        this.didFocusSubscription.remove()
        this.willBlurSubscription.remove()
    }

    async componentDidMount() {
        var self = this
        var messageListener
        
        //when screen focused, message listener starting
        this.didFocusSubscription = this.props.navigation.addListener(
            'willFocus',
            payload => {
                messageListener = firebase.messaging().onMessage((message) => {
                    Alert.alert(
                        'Notification',
                        'Message from '+message._data.fromname,
                        [
                            {
                                text: 'View', onPress: () => {
                                    var name = ''
                                    message._data.group == '1' ? name = '123group' : name = message._data.fromname
                                    self.props.navigation.navigate({routeName:'ChatScreen', params: {name: name}, key: 'chat'})   
                                }
                            },
                            {
                                text: 'Cancel',
                                onPress: () => console.log(self.props.navigation.state.routeName),
                                style: 'cancel',
                            },
                        ],
                        {cancelable: false},
                    )
                })
            }
        )

        //when screen unfocus, remove message listener
        this.willBlurSubscription = this.props.navigation.addListener(
            'willBlur',
            payload => {
                messageListener()
            }
        )

        this.getFiles()
    }

    async getFiles() {
        let self = this
        var aspect = self.props.navigation.getParam('aspect')

        var temp = await RNFetchBlob.fs.ls(resourceUrl)
        var filelist = []
        temp.forEach(item => {
            if(item.includes(aspect)) {
                var imgName = item.replace(aspect, '.png')
                var ttt = item.replace(aspect, '')
                RNFetchBlob.fs.exists(resourceUrl+imgName).then(exist => {
                    var imgUrl = ''
                    if(exist) {
                        var tempUrl = Platform.OS === 'ios' ? resourceUrl : 'file:///'+resourceUrl
                        imgUrl = {'uri': tempUrl + imgName}
                    } else if(Images[ttt] > 0){
                        imgUrl = Images[ttt]
                    } else {
                        imgUrl = Images['general']
                    }
                    return imgUrl
                }).then((img) => {
                    filelist.push({'pdf': item, 'img': img, 'title': ttt.toUpperCase()})
                    self.setState({file: filelist, isFetching: false})
                    console.log(this.state.file)
                })
            }
                
        })
        
    }

    async onRefresh() {
        this.setState({ isFetching: true }, function() { this.getFiles() });
    }

    onPdf(text) {
        this.props.navigation.navigate('pdfDisplayScreen', {'title': text})
    }

    render() {
        
        return (
            <Container style={styles.container}>
                <Header prop={this.props.navigation}></Header>
                <ImageBackground source={Images.bg} style={{flex: 1, padding: 15}}>
                    <FlatList
                        data = {this.state.file}
                        horizontal = {false}
                        showsVerticalScrollIndicator={false}
                        onRefresh={() => this.onRefresh()}
                        refreshing={this.state.isFetching}
                        numColumns = {2}
                        renderItem={({item}) =>
                            <Icon img={item['img']} onPress={this.onPdf.bind(this, item['pdf'])} title={item['title']}></Icon>
                        }
                        keyExtractor={item => item.pdf}
                    />
                </ImageBackground>
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch'
    },
    row:{
        flex: 1,
        height: responsiveHeight(25),
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    button: {
        marginTop: 20,
        width: responsiveWidth(50)-15,
        height: responsiveHeight(25),
        resizeMode: "stretch"
    }
});