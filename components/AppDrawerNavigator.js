import React from 'react';
import {createDrawerNavigator} from 'react-navigation-drawer';
import { AppTabNavigator } from './AppTabNavigator'
import CustomSideBarMenu  from './CustomSideBarMenu';
import MyDonationScreen from '../screens/MyDonationScreen';
import NotificationScreen from '../screens/NotificationScreen';
import SettingScreen from '../screens/SettingScreen';
import {Icon} from 'react-native-elements';
import MyReceivedBooksScreen from '../screens/MyReceivedBooksScreen';

export const AppDrawerNavigator = createDrawerNavigator({
  Home : {
    screen : AppTabNavigator,
    navigationOptions:{
      drawerIcon:<Icon name='home' type='font-awesome'
      
      > </Icon>
    }
    },
  MyDonations : {
    screen : MyDonationScreen,
    navigationOptions:{
      drawerIcon:<Icon name='gift' type='font-awesome'
      
      > </Icon>,
      drawerLabel:'myDonations'
    }
  },
  Notification : {
    screen : NotificationScreen,
    navigationOptions:{
      drawerIcon:<Icon name='bell' type='font-awesome'
      
      > </Icon>,
      drawerLabel:'myNotifications'
    }
  },
  MyReceivedBooks:{
    screen:MyReceivedBooksScreen,
    navigationOptions:{
      drawerIcon:<Icon name='gift' type='font-awesome'
      
      > </Icon>,
      drawerLabel:'myReceivedBooks'
    }
  },
  Setting : {
    screen : SettingScreen,
    navigationOptions:{
      drawerIcon:<Icon name='settings' type='font-awesome'
      
      > </Icon>,
      drawerLabel:'Settings'
    }
  }
  
},

  {
    contentComponent:CustomSideBarMenu
  },
  {
    initialRouteName : 'Home'
  })
