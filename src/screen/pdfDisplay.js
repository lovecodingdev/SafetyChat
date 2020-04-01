import React, { Component } from 'react'
import {
    View, 
    Text,
    Platform,
    Alert,
} from 'react-native'
import PDFView from 'react-native-view-pdf'
import Header from '../components/header'
import RNFetchBlob from 'rn-fetch-blob'
import firebase from 'react-native-firebase'


const resourceUrl = Platform.OS === 'ios' ? RNFetchBlob.fs.dirs.DocumentDir + "/safety/" : "/storage/emulated/0/safetyDir/"

// const resources = {
//   file: Platform.OS === 'ios' ? 'downloadedDocument.pdf' : '/storage/emulated/0/myData/1.pdf',
//   //url: 'https://www.ets.org/Media/Tests/TOEFL/pdf/SampleQuestions.pdf',
  
//   url: 'https://test.myspapp.com/wp-content/uploads/appFiles/map.pdf',
//   base64: 'JVBERi0xLjMKJcfs...',
// };t

export default class pdfDisplay extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            url: '',
        }
        mScreen = 'PDF'
    }

    componentDidMount() {

      var title = this.props.navigation.getParam('title')
      var url = Platform.OS === 'ios' ? 'safety/'+title : resourceUrl + title
      this.setState({url: url})
        
    }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header prop={this.props.navigation}></Header>
        <PDFView
          fadeInDuration={250.0}
          style={{ flex: 1 }}
          resource={this.state.url}
          resourceType={'file'}
          onLoad={() => console.log(`PDF rendered`)}
          onError={(error) => console.log('Cannot render PDF', error)}
        />
      </View>
    )
  }
}