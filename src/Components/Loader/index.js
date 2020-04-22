import React,{Component} from 'react'
import {
    View,
    Text,
    Modal,
    Dimensions,
    ActivityIndicator,
    SafeAreaView
} from 'react-native'

const {width,height} = Dimensions.get('window')

export default class Loader extends Component{
    constructor(props){
        super(props)
    }


    render(){
        return(
            <Modal
            animationType='fade'
            transparent
            visible={this.props.isVisible}
            onRequestClose={() => {
            }}>
            <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', paddingVertical: 10}}>
                  <View style={[{
                      flexDirection:'row',
                      alignItems:'center',
                        backgroundColor: "white",
                        paddingHorizontal: 15,
                        paddingVertical: 10, 
                        borderRadius: 10,
                        width:width - 50
                  },this.props.style]}>
                        <ActivityIndicator
                  animating={true}
                  color= '#2D50A7'
                  size="large"
                  style={{height: 40}} />
                      <Text style={{color:'black',padding:7,backgroundColor:'white',width:'50%',textAlign:'center'}}>Loading...</Text>
                  </View>
                  </SafeAreaView>
              </Modal>
        )
    }
}