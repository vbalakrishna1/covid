import firebase from 'react-native-firebase'

class FCMServive {
    register = (onRegister, onNotification, onOpenNotification) => {
        this.checkPermission(onRegister)
        this.createNotificationListeners(onRegister, onNotification, onOpenNotification)
    }

    checkPermission = (onRegister) => {
         firebase.messaging().hasPermission().then(enabled => {
             if (enabled) {
                 //User has permissions
                 this.getToken(onRegister)
             }else {
                 //User doesn't have permission
                 this.requestPermission(onRegister)
             }
         }).catch(error => {
             console.log("Permissions Rejected ", error)
         }) 
    }

    getToken = (onRegister) => {
        firebase.messaging().getToken().then(fcmToken => {
            if (fcmToken) {
                onRegister(fcmToken)
            }else {
                console.log("User does not have a device token")
            }
        }).catch(error => {
             console.log("getToken rejected ", error)
        })
    }

    requestPermission = (onRegister) => {
        firebase.messaging().requestPermission().then(() => {
            this.getToken(onRegister)
        }).catch(error => {
            console.log("Requested Permissions rejected ",error)
        })
    }

    deleteToken = () => {
        firebase.messaging().deleteToken().catch(error => {
            console.log("Delete token error ", error)
        })
    }

    createNotificationListeners = (onRegister, onNotification, onOpenNotification) => {
        //Triggered when a particular notification has been received in foreground
        this.notificationListener = firebase.notifications().onNotification((notification) => {
                onNotification(notification)
        })

        //if your app is in background, you can listen for when a notification is clicked / tapped / opened as follows
        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
            if(notificationOpen) {
                const notification = notificationOpen.notification
                onOpenNotification(notification)
                this.removeDeliveredNotification(notification)
            }
        })

        //if your app is closed, you can check if it was opened by a notification // being clicked / tapped / opened as follows
        firebase.notifications().getInitialNotification().then(notificationOpen => {
            if(notificationOpen) {
                const notification = notificationOpen.notification
                onOpenNotification(notification)
                this.removeDeliveredNotification(notification)
            }
        })

        //Triggered for data only payload in foreground
        this.messageListener = firebase.messaging().onMessage((mesage) => {
            onNotification(mesage)
        })

        //Triggered when have new token 
        this.onTokenRefreshListener = firebase.messaging().onTokenRefresh(fcmToken => {
            console.log("New token refresh : ",fcmToken)
            onRegister(fcmToken)
        })
    }

    unRegister = () => {
        this.notificationListener()
        this.notificationOpenedListener()
        this.messageListener()
        this.onTokenRefreshListener()
    }

    buidChannel = (obj) => {
        return new firebase.notifications.Android.Channel(
            obj.channelId, obj.channelName,
            firebase.notifications.Android.Importance.High)
            .setDescription(obj.channelDes)
    }

    buildNotifcation = (obj) => {
        //For Android
        firebase.notifications().android.createChannel(obj.channel)

        //For Android and iOS
        return new firebase.notifications.Notification()
        .setSound(obj.sound)
        .setNotificationId(obj.dataId)
        .setTitle(obj.title)
        .setBody(obj.content)
        .setData(obj.data)

        // For Android
        .android.setChannelId(obj.channel.channelId)
        .android.setLargeIcon(obj.largeIcon) //Create this icon in Android studio (app/res/midmap)
        .android.setSmallIcon(obj.smallIcon) //Create this icon in Android studio (app/res/drawable)
        .android.setColor(obj.colorBgIcon)
        .android.setPriority(firebase.notifications.Android.Priority.High)
        .android.setVibrate(obj.vibrate)
        //.android.setAutoCancel(true) // Auto cancel after recieve notification
    }

     scheduleNotification = (notification, days, minutes) => {
         const date = new Date()
         if(days) {
             date.setDate(date.getDate() + days)
         }
         if(minutes) {
             date.setMinutes(date.getMinutes() + minutes)
         }
         
         firebase.notifications()
         .scheduleNotification(notification, {fireDate : date.getTime()})
     }

     displayNotification = (notification) => {
           firebase.notifications().displayNotification(notification)
           .catch(error => console.log("Display Notification error : ", error))
     }

     removeDeliveredNotification = (notification) => {
        firebase.notifications()
        .removeDeliveredNotification(notification.notificationId)
     }
}

export const fcmService = new FCMServive() 