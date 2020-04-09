import React from 'react';
import {View, TouchableOpacity, Image, StyleSheet, Text} from 'react-native'
import {responsiveHeight, responsiveWidth} from 'react-native-responsive-dimensions'

export default (props) => (
    <TouchableOpacity onPress={props.onPress} style={styles.constainer}>
        <Image source={props.img} style={styles.img}></Image>
        <View style={styles.view}>
            <Text style={styles.title}>{props.title}</Text>
        </View>
    </TouchableOpacity>
  );

const styles = StyleSheet.create({
    constainer: {
        width: responsiveWidth(40)-10,
        height: responsiveHeight(25)-10,
        marginLeft: 20,
        alignItems: 'center',
        backgroundColor: '#000',
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#fff',
        padding: 10,
        marginTop: 20,
    },
    view: {
        width: responsiveWidth(40) - 30,
        height: responsiveHeight(5) + 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        textAlign: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        color: '#fff',
        fontSize: responsiveHeight(2),
    },
    img: {
        width: responsiveWidth(40)-30,
        height: responsiveHeight(20)-40,
        alignItems: 'center',
        tintColor: '#fff',
        resizeMode: 'contain'
    }
})