import React, { Component } from 'react';

import { createStackNavigator } from 'react-navigation';

import splash from "./screen/splash";
import checkcode from "./screen/checkcode";
import login from "./screen/login"
import home from "./screen/home"
import subpage from "./screen/subpage"
import pdfDisplay from "./screen/pdfDisplay"
import phonetree from "./screen/phonetree"
import chat from "./screen/chat"
import admin from "./screen/admin"
import group from "./screen/group"
import creategroup from "./screen/creategroup"
import selectgroup from "./screen/selectgroup"
import subadmin from "./screen/subadmin"

export const PrimaryNav = createStackNavigator({
    SplashScreen: { screen: splash },
    CheckcodeScreen: {screen: checkcode},
    LoginScreen: {screen: login}, 
    HomeScreen: {screen: home},
    SubPageScreen: {screen: subpage},
    pdfDisplayScreen: {screen: pdfDisplay},
    PhoneTreeScreen: {screen: phonetree},
    ChatScreen: {screen: chat},
    AdminScreen: {screen: admin},
    SubadminScreen: {screen: subadmin},
    GroupScreen: {screen: group},
    CreateGroupScreen: {screen: creategroup},
    SelectGroupScreen: {screen: selectgroup},
}, {
    headerMode: 'none',
})