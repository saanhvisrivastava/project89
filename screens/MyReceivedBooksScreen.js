import React,{Component} from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  Alert} from 'react-native';
import db from '../config';
import {ListItem} from 'react-native-elements';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader'

 export default class  MyReceiverBooksScreen extends React.Component{

    constructor(){
        super()
        this.state={
            receivedBooksList:[],
            userId:firebase.auth().currentUser.email,

        }
    }

    getReceivedBooksList=()=>{
        var requestRef=db.collection('received_books')
        .where('user_id','===',this.state.userId)
        .where('book_status','===','received')
        .onSnapshot((snapshot)=>{
            var receivedBooksList=snapshot.docs.map((doc)=>{doc.data})
            this.setState({
                receivedBooksList:receivedBooksList
            })
        })
    }
    componentDidMount(){
        this.getReceivedBooksList()
    }
    keyExtractor=(item,index)=>{
    index.toString()
    }
    renderItem=({item,i})=>{
        return(
        <ListItem 
        key={i}
        title={item.book_name}
        subtitle={item.bookStatus}
        title style={{color:'black',fontWeight:'bold'}}
        bottomDivider

        > 
            
        </ListItem>
        )
    }
 render(){
     return(
         <View style={{flex:1}}>
         <MyHeader title='ReceivdBooks' navigation={this.props.navigation}> </MyHeader>
         <View style={{flex:1}}>
             {
                 this.state.receivedBooksList.length===0?(<View style={{justifyContent:'center',flex:1,alignItem:'center'}}>
                      <Text style={{fontSize:RFValue(20)}}>
                     List of all Received Books
                     </Text></View>):
                     (<FlatList data={this.state.receivedBooksList,
                        renderItem=this.renderItem,keyExtractor=this.keyExtractor}></FlatList>)


             }
              </View>
         </View>
     )

 }
 }