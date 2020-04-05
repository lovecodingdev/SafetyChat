import NetInfo from "@react-native-community/netinfo"
import AppData from "./AppData"
import Base64 from 'Base64'
import RNFetchBlob from 'rn-fetch-blob'
import {Platform, Alert} from 'react-native'
import CONST from '../Const'
import firebase from "react-native-firebase"

const resourceUrl = Platform.OS === 'ios' ? RNFetchBlob.fs.dirs.DocumentDir+ "/safety/" : "/storage/emulated/0/safetyDir/"

async function getConnection() {
    
    let status = await NetInfo.fetch()
    return status.isConnected    
}

async function setCode(code) {
    user.code = code
    user.url = "https://"+code+".myspapp.com/"
    await AppData.setItem(CONST.CODE_KEY, code)
}

async function login(name, password) {
    console.log("*****login*********")
    var url = user.url + "wp-json/aam/v2/authenticate"
    console.log('Current URL = ', url)
    try {
        let response = await fetch(url, {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
                'accept': 'application/json',
            },
            body:JSON.stringify({
                username: name,
                password: password
            })
        });
        let responseJson = await response.json() 
        
        console.log("-------------------roles-----------------------", responseJson)
        if(response.status == 200) {
            user.name = name
            // user.token = responseJson.user.data.user_pass
            user.role = responseJson.user.roles[0]
            user.password = password
            await AppData.setItem(CONST.USER_KEY, name)
            await AppData.setItem(CONST.PASSWORD_KEY, password)
            // await AppData.setItem(CONST.TOKEN_KEY, user.token)
            await AppData.setItem(CONST.ROLE_KEY, user.role)
            return true
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

async function sendNotification(token) {
    var Headers = {
        'Authorization' : '',
        'Content-Type' : 'application/json'
    }
    var Body =
    {
        "to": token,
        "data": {
            "message": "Notification",
            "title": "Title",
            "data-type": "direct_message"
        }
    }
}

async function readRemoteMD5() {
    var username = user.name
    var password = user.password
    var token = Base64.btoa(username+":"+password)
    var url = user.url + "wp-content/uploads/mdocs/remoteCheck.md5"
    var response = RNFetchBlob.fetch('GET', url, {
        Authorization: 'Basic ' + token
    })
    .then( res=> {
        return res.data
    })
    return response
}

async function readManifest() {
    var username = user.name
    var password = user.password
    var token = Base64.btoa(username+":"+password)
    var url = user.url + "wp-content/uploads/mdocs/manifest"
    var response = RNFetchBlob.fetch('GET', url, {
        Authorization: 'Basic ' + token
    })
    .then( res=> {
        return res.data
    })
    return response
}

async function firebaseTokenRefresh() {
    let enabled = await firebase.messaging().hasPermission()
    if (!enabled) return;
    let token = await firebase.messaging().getToken()
    if (user.token != '' && user.token == token) return
    user.token = token
    firebase.database().ref().child(companycode+'/users/'+name).set({token: user.token, role: user.role})
    await AppData.setItem(CONST.TOKEN_KEY, token);
}

async function updateFiles() {
    var username = user.name
    var password = user.password
    var token = Base64.btoa(username+":"+password)
    var baseUrl = user.url
    var response = await readManifest()
    let localUrl = resourceUrl
    //await RNFetchBlob.fs.unlink(localUrl)
    var tempList = response.split("\n")
    var fileList = []
    tempList.forEach( item => {
        if(item != '') fileList.push(item)
    })
    fileList.forEach( item => {
        var url = baseUrl +  "wp-content/uploads/mdocs/" + item
        RNFetchBlob.fetch('GET', url, {
            Authorization: 'Basic '+ token
        })
        .then( res => {
            var url = localUrl + item.toLowerCase()
            RNFetchBlob.fs.writeFile(url, res.data, 'base64')
        })
    })

}

export default {
    getConnection,
    setCode,
    login,
    readRemoteMD5,
    updateFiles,
    readManifest,
    firebaseTokenRefresh,
}