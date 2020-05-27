import NetInfo from "@react-native-community/netinfo"
import AppData from "./AppData"
import Base64 from 'Base64'
import RNFetchBlob from 'rn-fetch-blob'
import {Platform} from 'react-native'
import CONST from '../Const'
import firebase from "react-native-firebase"
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import BadgeAndroid from "react-native-android-badge";

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
        
        // console.log("-------------------roles-----------------------", responseJson)
        if(response.status == 200) {
            user.name = name
            // user.token = responseJson.user.data.user_pass
            user.role = responseJson.user.roles[0]
            user.password = password
            await AppData.setItem(CONST.USER_KEY, name)
            await AppData.setItem(CONST.PASSWORD_KEY, password)
            await AppData.setItem(CONST.ROLE_KEY, user.role)

            await firebase.database().ref().child(user.code+'/users/'+user.name).update({role: user.role})
            return true
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

async function uploadImage(uri, filename) {
    await firebase.storage().ref(user.code + "/" + filename + ".png").putFile(uri);
    let url = await firebase.storage().ref(user.code + "/" + filename + ".png").getDownloadURL();
    return url;
} 

async function getGroups() {
    var groups = await firebase.database().ref().child(user.code + '/groups').once('value')
    .then((snapshots) => {
        var mGroups = []
        snapshots.forEach(function(snapshot) {
            var id = snapshot.key;
            var name = snapshot.val()['title'];
            var users = snapshot.val()['users'];
            var image = snapshot.val()['image'];
            var group = {
                id,
                name,
                role: 'GROUP',
                users,
                image,
                isGroup: true,
            }
            mGroups.push(group)
        })
        return mGroups;
    })
    return groups;
}

async function getAllUsers() {
    var users = await firebase.database().ref().child(user.code + '/users').once('value')
    .then((snapshots) => {
        var mUsers = []
        snapshots.forEach(function(snapshot) {
            var mUser = {
                id: snapshot.key,
                name: snapshot.key,
                role: snapshot.val().role,
                token: snapshot.val().token,
                isGroup: false,
            }
            mUsers.push(mUser)
        })
        return mUsers;
    })
    return users;
}

async function sendPushNotification(tokens) {
    const FIREBASE_API_KEY = "AAAAe-7ajLE:APA91bF3r_qmbcW9DRFRGOrJIKEckPSyQArtqdixzbATdmFw3BqGgWpTy9QwSwYWwoiZb2lCHnFWdSGa6rydmJWEMg93SGHedxuBVME1vhHS3tIaB-oeePSGux-MFZUMWwx3HKZXLA0F";
    const message = {
        registration_ids: tokens, 
        notification: {
            title: "india vs south africa test",
            body: "IND chose to bat",
            "vibrate": 1,
            "sound": 1,
            "show_in_foreground": true,
            "priority": "high",
            "content_available": true,
        },
        data: {
            title: "india vs south africa test",
            body: "IND chose to bat",
            score: 50,
            wicket: 1
        }
    }
  
    let headers = new Headers({
      "Content-Type": "application/json",
      "Authorization": "key=" + FIREBASE_API_KEY
    });
  
    let response = await fetch("https://fcm.googleapis.com/fcm/send", { method: "POST", headers, body: JSON.stringify(message) })
    response = await response.json();
    console.log(response);
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

async function getTokens(users) {
    var tokens = await firebase.database().ref().child(user.code + '/users').once('value')
    .then((snapshots) => {
        var tokens = []
        snapshots.forEach(function(snapshot) {
            let data = snapshot.val()
            if (users.includes(snapshot.key)) {
                tokens.push(data.token)
            }
        })
        return tokens;
    })
    return tokens;
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
    let enabled = await firebase.messaging().hasPermission();
    if (!enabled) return;
    let token = await firebase.messaging().getToken();
    if (user.token == '') return
    console.log("fcm token = ", token);
    user.token = token
    await firebase.database().ref().child(user.code+'/users/'+user.name).update({token: user.token})
    await AppData.setItem(CONST.TOKEN_KEY, token);
    return;
}

function setBadge(number) {

    if (Platform.OS === 'ios') {
        PushNotificationIOS.setApplicationIconBadgeNumber(number)
    } else {
        BadgeAndroid.setBadge(number)
    }
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
    getGroups,
    getAllUsers,
    getTokens,
    sendPushNotification,
    uploadImage,
    setBadge,
}