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
        top: 130,
        position: "absolute",
        width: responsiveWidth(80),
        height: 40,
        justifyContent: 'center',
    },
    title: {
        textAlign: 'center',
        justifyContent: 'center',
        letterSpacing: 1,
        color: '#fff',
        fontWeight: "bold",
        width: responsiveWidth(80),
        fontSize: responsiveWidth(7),
    },
    img: {
        width: responsiveWidth(40),
        height: 130,
        marginTop: 10,
        marginLeft: responsiveWidth(20),
        tintColor: '#fff',
        resizeMode: 'contain'
    }
});