import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableHighlight,
    View,
    dimensions
} from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import { SwipeListView } from 'react-native-swipe-list-view';
import db from '../config';

export default class SwipeableFlatlist extends Component{
    constructor(props){
        super(props)
        this.state={
            allNotifications:this.props.allNotifications
        }
    }
    renderItem=(data)=>{
      <ListItem 
      leftElement={<Icon name="book" type='font-awesome' 
      color='pink'

      ></Icon>

    }
    title={ data.item.book_name} 
     titleStyle={{color:'green',fontWeight:'bold'}}
     subTitle={data.item.message}
     bottomDivider
      />
    }
    renderHiddenItem=()=>{
        <View style={styles.rowBack}> 
        <View style={[styles.backRightBtn,styles.backRightBtnRight]}> 
        <Text style={styles.backTextWhite}> Mark as read</Text>
        </View>
        </View> 
    }
    updateMarkAsRead=(notification)=>{
      db.collection('all_notifications').doc(notification.docId).update({
          notification_status:'read'
      })

    }
    onSwipeValueChange=(swipeData)=>{
      var allNotifications=this.state.allNotifications
      const {key,value}=swipeData;
      if(value< -dimensions.get('window').width){
          const newData=[...allNotifications];
          this.updateMarkAsRead(allNotifications[key]);
          newData.splice(key,1);
          this.setState({
              allNotifications:newData
          })
      }
    }
   render(){
       return(
           <View style={this.styles.container}>
           <SwipeListView disableRightSwipe
           data={this.state.allNotifications}
           renderItem={this.renderItem}
           renderHideenItem={this.renderHiddenItem}
           rightOpenValue={-dimensions.get('window').width}
           previewRowKey={'0'}
           previewOpenValue={-40}
           previewOpenDelay={3000}
           onSwipeValueChange={this.onSwipeValueChange}
           > 

           </SwipeListView>
           </View>
       )
   }
   }

 const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
    },
    backTextWhite: {
        color: '#FFF',
    },
    rowFront: {
        alignItems: 'center',
        backgroundColor: '#CCC',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        justifyContent: 'center',
        height: 50,
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#DDD',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
    },
    backRightBtnLeft: {
        backgroundColor: 'blue',
        right: 75,
    },
    backRightBtnRight: {
        backgroundColor: 'red',
        right: 0,
    },
});
