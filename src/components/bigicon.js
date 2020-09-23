import React, { Component } from 'react';
import {View, TouchableOpacity, Image, StyleSheet, Text} from 'react-native'
import {responsiveHeight, responsiveWidth} from 'react-native-responsive-dimensions'
import {Images} from '../theme'

export default (props) => (
    <TouchableOpacity onPress={props.onPress} onLongPress={props.onLongPress} style={styles.constainer}>
        <Image source={props.img} style={styles.img}></Image>
        <View style={styles.view}>
            <Text style={styles.title}>{props.title}</Text>
        </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    constainer: {
        marginLeft: responsiveWidth(10) - 5,
        width: responsiveWidth(80),
        height: 180,
        borderWidth: 1,
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 5,
        borderColor: '#fff',
        tintColor: '#fff',
        backgroundColor: '#000',
    },
    view: {
        top: 0,
        position: "absolute",
        width: responsiveWidth(40) - 10,
        height: 180,
        marginLeft: responsiveWidth(40),
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        textAlign: 'center',
        justifyContent: 'center',
        letterSpacing: 0.5,
        alignSelf: 'center',
        color: '#fff',
        fontWeight: "bold",
        fontSize: responsiveWidth(7),
    },
    img: {
        width: responsiveWidth(40)-20,
        height: 140,
        marginTop: 20,
        marginLeft: 10,
        tintColor: '#fff',
        resizeMode: 'contain'
    }
});