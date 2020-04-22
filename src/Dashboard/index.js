import React, {Component} from 'react';
import {StatusBar,View,Text,TextInput,SafeAreaView,Image,FlatList} from 'react-native';
import axios from 'axios';
import styles from './style'
import PureChart from 'react-native-pure-chart';

class DashBoard extends Component{
    constructor(props) {
        super(props);
        this.state={
            data:[],
            pieChart:[]
        }
      }
      componentDidMount(){
        axios.get("https://api.covid19api.com/summary")
        .then(async res=>{ 
            let list=[]
            res.data.Countries.map((item)=>{
                list.push({value:item.TotalConfirmed,
                    label: item.Country,
                    })
            })
           this.setState({data:res.data.Countries,pieChart:list})
         })
         .catch(err=>{
             alert('please retry again')
       }) 
      }
      renderItem=(item,index)=>{
          return(
              <View style={styles.card}>
          <Text style={{color:'black',fontSize:16,fontWeight:'bold'}}>Country : {item.Country}{item.CountryCode}</Text>
          <Text style={{color:'black'}}>TotalConfirmed : {item.TotalConfirmed}</Text>
          <Text style={{color:'green'}}>TotalRecovered : {item.TotalRecovered}</Text>
          <Text style={{color:'red'}}>TotalDeaths : {item.TotalDeaths}</Text>
              </View>
          )
      }
    render(){
        return(
       <SafeAreaView style={{flex:1,backgroundColor:'#F9F9F9'}}>
           <StatusBar backgroundColor='#212125' barStyle='light-content' />
           <View style={{marginTop:20}} />
           <View style={{alignSelf:'center',marginBottom:20}}>
           {this.state.pieChart.length>0 ? 
           <PureChart data={this.state.pieChart} type='pie' /> : null}
           </View>
           <FlatList
            data={this.state.data}
            extraData={this.state}
            keyExtractor={(item,index)=>'key'+index} 
            renderItem={({ item, index }) => this.renderItem(item, index)}
        />
        </SafeAreaView>
        )
    }
}
export default DashBoard;