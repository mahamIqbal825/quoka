
import React,{PureComponent} from 'react';

import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ImageBackground
} from 'react-native';

import DrawerToggle from '../components/DrawerToggle'

class HeaderShape extends PureComponent{

  render(){

    const { left, children } = this.props

    return(
      <ImageBackground
        source={require('../../assets/images/header_shape.jpg')}
        style={ [styles.headerShape, 
          { 
            transform:[{ scaleX: left ? -1 : 1 }],
            alignSelf: left ? 'flex-start' : 'flex-end', 
            marginRight: left ? 0 : -60,
            marginLeft: left ? -60 : 0

          
          }] }
      >
        {
          left && (
            <DrawerToggle />
          )
        }
        

        {
          children
        }

      </ImageBackground>
    )

  }

}
const styles = StyleSheet.create({
    headerShape:{
        width: 230,
        height: 200,
        marginBottom: 40,
        alignItems:'center',
        justifyContent:'center'

    }
    
})

export {HeaderShape};
