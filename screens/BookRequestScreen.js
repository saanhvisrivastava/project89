import React,{Component} from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  Alert,
TouchableHighlight,
FlatList} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader';
import {BookSearch} from 'react-native-google-books';
import {Input} from 'react-native-elements';

export default class BookRequestScreen extends Component{
  constructor(){
    super();
    this.state ={
      userId : firebase.auth().currentUser.email,
      bookName:"",
      reasonToRequest:"",
      isBookRequestActive:" ",
      userDocId:'',
      docId:'',
      requestedBookName:'',
      bookStatus:'',
      requestId:'',
      dataSource:' ',
      showFlatList:false
    }
  }
  getBookRequest=()=>{
    db.collection('requested_books').where('user_id','==',this.state.userId)
    .get().then((Snapshot)=>{
      Snapshot.forEach((doc)=>{
        if(doc.data().bookStatus!=='received'){
          this.setState({
            requestId:doc.data().request_id,
            requestedBookName:doc.data().book_name,
            bookStatus:doc.data().book_Status,
            docId:doc.Id
          })
        }
      })
    })
  }

  getIsBookRequestActive(){
    db.collection('users').where('email_id','==',this.state.userId)
    .onSnapshot((querySnapshot)=>{
      querySnapshot.forEach((doc)=>{
        this.setState({
          isBookRequestActive:doc.data().isBookRequestActive,
          userDocId:doc.id
        })
      })
    })
  }

  sendNotification=()=>{
    db.collection('users').where('email_id','==',this.state.userId).get()
    .then((Snapshot)=>{
      Snapshot.forEach((doc)=>{
        var name=doc.data().firstName
        var lastName=doc.data().last_name
        db.collection('all_notifications').where('requestId','==',this.state.requestId).get()
        .then((Snapshot)=>{
          Snapshot.forEach((doc)=>{
            var donorId=doc.data().donorId
            var BookName=doc.data().bookName
            db.collection('all_notifications').add({
              'targeted_user_id':donorId,
              'message':name+" "+lastName+"Received the book"+BookName,
              'notificatiion_status':'unread',
              'book_name':BookName
            })
          })
        })
      })
    })
  }

  updateBookRequestStatus=()=>{
    db.collection('requested_books').doc(this.state.docId).update({
      book_status:'received'
      
    })
    db.collection('users').where('email_id','==',this.state.userId).get()
    .then((Snapshot)=>{
      Snapshot.forEach((doc)=>{
        db.collection('users').doc(doc.id).update({
          isBookRequestActive:false
        })
      })
    })
  }

  createUniqueId(){
    return Math.random().toString(36).substring(7);
  }
    receivedBooks=(bookName)=>{
      var userId=this.state.userId;
      var requestId=this.state.requestId;
      db.collection('received_books').add({
        'user_id': userId,
        'request_id':requestId,
        'book_name':bookName,
        'book_status': 'received'
      })
    }


  addRequest =(bookName,reasonToRequest)=>{
    var userId = this.state.userId
    var randomRequestId = this.createUniqueId()
    db.collection('requested_books').add({
        "user_id": userId,
        "book_name":bookName,
        "reason_to_request":reasonToRequest,
        "request_id"  : randomRequestId,
    })

    this.setState({
        bookName :'',
        reasonToRequest : ''
    })

    return Alert.alert("Book Requested Successfully")
  }
  componentDidMount(){
    this.getIsBookRequestActive
    this.getBookRequest
  }
  async getBooksFromAPI(bookName){
    this.setState({
      bookName:bookName

    })
    if(bookName.length>2){
      var book=await BookSearch.searchbook(bookName,'AIzaSyBACc09noLl6tmkHgz4qW_ayR9q_qII5eE')
      this.setState({
        dataSource:book.data,
        showFlatList:true
      })
    }
  }
  renderItem=({item,i})=>{
   return(
     <TouchableHighlight style={{backgroundColor:'yellow',alignItem:'center',padding:'10',
    width:'90%'
   
    }}
    ActiveOpacity={0.6}
    underlayColor='pink'
    onPress={()=>{this.setState({
      bookName:item.volumeInfo.title,
      showFlatList:false
      
    })}}
    bottom Divider
    > 
    <Text>{item.volumeInfo.title}</Text>
    </TouchableHighlight>
   )
  }
  


  render(){
    if(this.state.isBookRequestActive===true){
            return(
            <View style={{flex:1,justifyContent:'center'}}>
              <View style={{borderWidth:'2',borderColor:'purple',
            justifyContent:'center',alignItem:'center',margin:'10',
            padding:'10'}}>
              <Text>BookName</Text>
              <Text>{this.state.requestedBookName}</Text>
            </View>

            <View style={{borderWidth:'2',borderColor:'purple',
            justifyContent:'center',alignItem:'center',margin:'10',
            padding:'10'}}>
              <Text>BookStatus</Text>
              <Text>{this.state.bookStatus}</Text>
            </View>
            <TouchableOpacity style={{width:200,marginTop:'30',alignItem:'center',height:50,
            backgroundColor:'blue',borderWidth:'1',alignCenter:'center'}}
            onPress={()=>{
              this.sendNotification()
              this.updateBookRequestStatus()
              this.receivedBooks(this.state.requestedBookName)
            }}>
              <Text>I received the Book</Text>
            </TouchableOpacity>
            </View>
            )
    }
    else{

    
    return(
    
        <View style={{flex:1}}>
         
          <MyHeader title="Request Book" navigation ={this.props.navigation}/>
            <KeyboardAvoidingView style={styles.keyBoardStyle}>
              <Input
                style ={styles.formTextInput}
                placeholder={"enter book name"}
                onChangeText={(text)=>{
                    this.getBooksFromAPI(text)
                }}
                value={this.state.bookName}
              />
            {
              this.state.showFlatList?(
                <FlatList data={this.state.dataSource}
                renderItem={this.renderItem}
                keyExtractor={(item,index)=>{index.toString}}
                style={{marginTop:10}}
                > </FlatList>
              ):
              (
                <View style={{alignItem:'center'}}>
                   <Input
                style ={[styles.formTextInput,{height:300}]}
                multiline
                numberOfLines ={8}
                placeholder={"Why do you need the book"}
                onChangeText ={(text)=>{
                    this.setState({
                        reasonToRequest:text
                    })
                }}
                value ={this.state.reasonToRequest}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={()=>{this.addRequest(this.state.bookName,this.state.reasonToRequest)}}
                >
                <Text>Request</Text>
              </TouchableOpacity>
                  
                   </View>
              )
              
            }

             
            </KeyboardAvoidingView>
        </View>
    )
              }
  }
}

const styles = StyleSheet.create({
  keyBoardStyle : {
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  },
  formTextInput:{
    width:"75%",
    height:35,
    alignSelf:'center',
    borderColor:'#ffab91',
    borderRadius:10,
    borderWidth:1,
    marginTop:20,
    padding:10,
  },
  button:{
    width:"75%",
    height:50,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10,
    backgroundColor:"#ff5722",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop:20
    },
  }
)
