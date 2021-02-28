import React, { Component} from 'react';
import {StyleSheet, View, Text,TouchableOpacity} from 'react-native';
import { DrawerItems} from 'react-navigation-drawer'
import * as ImagePicker from 'expo-image-picker';
import db from '../config';
import {Avatar,Icon} from 'react-native-elements';
import {RFValue} from 'react-native-responsive-fontsize';

import firebase from 'firebase';

export default class CustomSideBarMenu extends Component{
  constructor(){
  super()
  this.state={
  image:'#',
  userId:firebase.auth().currentUser.email,
  name:'',
  docId:''
  }
}
uploadImage=async(uri,imageName)=>{
 var response= await fetch(uri);
 var blob=await response.blob();
 var ref=firebase.storage().ref().child('userProfiles/'+ imageName);
 return ref.put(blob).then((response)=>{
   this.fetchImage(imageName);
 })
}
fetchImage=(imageName)=>{
  var storageRef=firebase.storage().ref().child('userProfiles/'+ imageName);
  storageRef.getDownloadURL().then((uri)=>{
    this.setState({
      image:uri
    })
  })
  .catch((error)=>{
    this.setState({
      image:'#'
    })
  })
}

selectPicture=async()=>{
  const {cancelled,uri}=await ImagePicker.launchImageLibraryAsync({
    mediaTypes:ImagePicker.MediaTypeOptions.all,
    allowsEditing:true,
    quality:1
  })
  if(!cancelled){
    this.uploadImage(uri,this.state.userId)
  }

}
getUserProfile(){
  db.collection('users').where('email_id','==',this.state.userId)
  .onSnapshot(( querySnapshot)=>{
    querySnapshot.forEach((doc)=>{
      this.setState({
        name:doc.data().first_name + ' '+ doc.data().last_name
      })
    })
  })
}
componentDidMount(){
  this.fetchImage(this.state.userId)
  this.getUserProfile()
}
  
  render(){
    return(
      <View style={{flex:1}}>
        <View style={{flex:0.5,alignItem:'center', backgroundColor:'orange'}}> 
          <Avatar rounded size='medium' showEditButton
          containerStyle={{width:200,height:200,marginLeft:20,marginTop:20
            
          }}
          onPress={()=>{this.selectPicture()}}
          > </Avatar>
          <Text style={{ fontSize:RFValue(20),fontWeight:'bold',paddingTop:10}}>{this.state.name } </Text>
        </View>
        <View style={styles.drawerItemsContainer}>
          <DrawerItems {...this.props}/>
        </View>
        <View style={styles.logOutContainer}>
          <TouchableOpacity style={styles.logOutButton}
          onPress = {() => {
              this.props.navigation.navigate('WelcomeScreen')
              firebase.auth().signOut()
          }}>
            <Icon name='logout' size={RFValue(15)}> </Icon>
            <Text>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}


var styles = StyleSheet.create({
  container : {
    flex:1
  },
  drawerItemsContainer:{
    flex:0.8
  },
  logOutContainer : {
    flex:0.2,
    justifyContent:'flex-end',
    paddingBottom:30
  },
  logOutButton : {
    height:30,
    width:'100%',
    justifyContent:'center',
    padding:10
  },
  logOutText:{
    fontSize: 30,
    fontWeight:'bold'
  }
})
