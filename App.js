import React, {Component,useState} from 'react';
import {fcmService} from './src/firebase/FCMService'
import DashBoard from './src/Dashboard'
import { View } from 'react-native';

class App extends Component{
    constructor(props) {
        super(props);
        this.state={
          deviceToken:'',
        }
    }
    componentDidMount() {
      fcmService.register(this.onRegister,this.onNotification,this.onOpenNotification)
    }
  
    onRegister=(token)=> {
      this.setState({deviceToken:token})
      console.log("[NotificationFCM] onRegister: ",token)
    }
  
    onNotification(notify) {
      console.log("[NotificationFCM] onNotification: ", notify)
      const channelObj = {
        channelId : 'SampleChannelID',
        channelName : 'SampleChannelName',
        ChannelDesc : "SampleChannelDes"
      }
      const channel = fcmService.buidChannel(channelObj)
      const buildNotify = {
        dataId : notify._notificationId,
        title : notify._title,
        content : notify._body,
        sound : 'default',
        channel : channel,
        data : {},
        colorBgIcon : "#1A243B",
        largeIcon : 'ic_launcher',
        smallIcon : 'ic_launcher',
        vibrate : true
      }
  
      const notification = fcmService.buildNotifcation(buildNotify)
      fcmService.displayNotification(notification)
    }

    onOpenNotification(notify) {
      console.log("[NotificationFCM] onOpenNotification: ", notify)
      alert(notify._body)
    }
    render() {
      return (
        <View style={{flex:1}}>
      {this.state.deviceToken!=''? <DashBoard token={this.state.deviceToken} />:null}
        </View>
      )
    }
}  

export default App;



