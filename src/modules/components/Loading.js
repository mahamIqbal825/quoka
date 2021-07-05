
import React,{PureComponent} from 'react';

import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  TextInput,
  Dimensions
} from 'react-native';



import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'

const deviceWidth = Dimensions.get('window').width
const deviceHeight = Dimensions.get('window').height

class Loading extends PureComponent{

    render() {

        const {width, height, quantity, radius, horizontal, review, style, darker, fullWidth, containerMarginRight} = this.props

        return (
            <View style={{flexDirection:'column'}}>
                <View style={{
                    flexDirection: horizontal ? 'row':"column",
                    }}>
                    
                    {
                        quantity.map(()=>(
                            <View style={{ marginRight:containerMarginRight || 16 }}>
                                <ShimmerPlaceHolder 
                                    autoRun={true}
                                    visible={false}
                                    duration={2000}
                                    width={300}
                                    style={[{
                                        width: width || "100%",
                                        height:height,
                                        borderRadius:radius || 15,
                                        marginBottom:20,
                                    },{...style}]}
                                    colorShimmer={darker ? ['#a7a7a7', '#c7c7c7', '#a7a7a7'] :['#e7e7e7', '#f7f7f7', '#e7e7e7']}
                                />
                            </View>
                            
                        ))
                    }
                    

                </View>
            </View>
        )
      }
}
    
    const styles = StyleSheet.create({

        namePlaceholder:{
            width:120,
            height:20,
            borderRadius:100,
            marginTop:15,
            alignSelf:'center'
        }
    })
    

export {Loading}
