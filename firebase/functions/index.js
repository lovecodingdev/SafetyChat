const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();


exports.sendMessage = functions.database.ref('{companycode}/messages/{toname}/{fromname}/{key}')
    .onCreate((csnapshot, context) => {
        let value = csnapshot.val();
        console.log('---------message---------------',value);
        var toname = context.params.toname;
        var company = context.params.companycode
        var fromname = context.params.fromname
        console.log('toname',toname)
        console.log('company', company)
        console.log('fromnaem', fromname)
        if(value.user.name == fromname) {
            admin.database().ref(company+'/users/'+toname).once('value', function(snapshot) {
                snapshot.forEach(function(child) {
                    //console.log(child)
                    if(child.key == 'token') {
                        var temp = child.val();
                        console.log('token', temp)
                        var totoken = temp;
                        const messages = [];
                        console.log('********************', JSON.stringify(value))
                        messages.push({
                            data: {
                                data: JSON.stringify(value),
                                fromname: fromname
                            },
                            token: totoken
                        });

                        //if(value.user.name == fromname) {
                        messages.push({
                            notification: {
                                title: 'Notification',
                                body: 'Message from '+fromname,
                            },
                            data: {
                                fromname: fromname
                            },
                            android: {
                                notification: {
                                    sound: 'default'
                                },
                            },
                            apns: {
                                payload: {
                                    aps: {
                                        sound: 'default'
                                    },
                                },
                            },
                            token: totoken
                        });
                        //
                        admin.messaging().sendAll(messages)
                        .then((res) => {
                            console.log('Successfully sent message:', res);
                            return;
                        })
                        .catch((err) => {
                            console.log('Error sending message:', err);
                        })
                    }
                })
                
            })
        }

    });

exports.sendGroupMessage = functions.database.ref('{companycode}/groupMessages/{gid}/{key}')
    .onCreate((csnapshot, context) => {
        let value = csnapshot.val();
        console.log('---------groupmessage---------------',value);
        var company = context.params.companycode;
        var gid = context.params.gid;
        var totoken = []
        var title = ""
        admin.database().ref(company+'/groups/' + gid).once('value', function(snapshot) {
            title = snapshot.val().title;
            var users = snapshot.val().users;
            admin.database().ref(company+'/users').once('value', function(msnapshot) {
                msnapshot.forEach(function(child) {
                    if (users.includes(child.key)) {
                        var temp = child.val().token;
                        if (temp.length > 10) {
                            totoken.push(temp)
                        }
                    }
                })
                var messages = {
                    data: {
                        data: JSON.stringify(value),
                        fromname: gid,
                        group: '1',
                    },
                    tokens: totoken
                };
               
                admin.messaging().sendMulticast(messages)
                .then((res) => {
                    console.log('Successfully sent message:', res);
                    return;
                })
                .catch((err) => {
                    console.log('Error sending message:', err);
                });
    
    
                //notifications
                var notification = {
                    notification: {
                        title: 'Notification',
                        body: 'Message from group',
                    },
                    data: {
                        fromname: gid,
                        group: '1',
                    },
                    android: {
                        notification: {
                            sound: 'default'
                        },
                    },
                    apns: {
                        payload: {
                            aps: {
                                sound: 'default'
                            },
                        },
                    },
                    tokens: totoken
                };
                admin.messaging().sendMulticast(notification)
                .then((res) => {
                    console.log('Successfully sent notification:', res);
                    return;
                })
                .catch((err) => {
                    console.log('Error sending notification:', err);
                });
            })
        })
    });

    exports.sendEmergency = functions.database.ref('{companycode}/alerts/{admintype}/{key}')
    .onCreate((csnapshot, context) => {
        let value = csnapshot.val();
        console.log('---------alert---------------',value);
        var company = context.params.companycode;
        var totoken = []
        var me = value.user;
        var type = value.type;
        var message = value.message;
        admin.database().ref(company+'/users').once('value', function(snapshot) {
            snapshot.forEach(function(child) {
                if (me != child.key) {
                    var temp = child.val().token;
                    var role = chile.val().role;
                    if (value.isAdmin && (role == "administrator" || role == "manager")) {
                        temp = "";
                    } else if (!value.isAdmin && !(role == "administrator" || role == "manager")) {
                        temp = "";
                    }
                    if (temp.length > 10) {
                        totoken.push(temp)
                    }
                }
            })
            console.log("****TOKENS****", totoken);
            var messages = {
                data: {
                    data: JSON.stringify(value),
                    fromname: me,
                    alert: "true",
                },
                tokens: totoken
            };
               
            admin.messaging().sendMulticast(messages)
            .then((res) => {
                console.log('Successfully sent message:', res);
                return;
            })
            .catch((err) => {
                console.log('Error sending message:', err);
            });


            //notifications
            var notification = {
                notification: {
                    title: 'Emergency',
                    body: type+":"+message,
                },
                data: {
                    fromname: me,
                    alert: "true",
                    lat: String(value.lat),
                    lon: String(value.lon),
                    isAdmin: value.isAdmin ? "true": "false",
                    type: value.type,
                },
                android: {
                    notification: {
                        sound: 'alert.mp3',
                        channel_id: me,
                    },
                },
                apns: {
                    payload: {
                        aps: {
                            sound: 'alert.mp3'
                        },
                    },
                },
                tokens: totoken
            };
            admin.messaging().sendMulticast(notification)
            .then((res) => {
                console.log('Successfully sent notification:', res);
                return;
            })
            .catch((err) => {
                console.log('Error sending notification:', err);
            });
        })
    });