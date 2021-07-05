
import React,{PureComponent} from 'react';

import {
  TouchableOpacity,
  View,
  Text as RNText,
  StyleSheet,
  ImageBackground
} from 'react-native';

import {Theme} from './Theme'

class Text extends PureComponent{

  render(){

    const { children, large, small, medium, bold, thin, colorPrimary, style, white } = this.props

    return(
      <RNText style={ [{
        fontSize: large ? 
          Theme.typography.large : 
          small ? Theme.typography.small : 
          medium ? Theme.typography.medium :
          Theme.typography.normal,

        fontWeight: bold ? 'bold' : thin ? '100' : '300',
        marginBottom: 5,
        color: colorPrimary ? Theme.palette.primaryDark : white ? "#fff" : Theme.palette.black
        },{...style}]}
      >
        { children }
      </RNText>
    )

  }

}
const styles = StyleSheet.create({

    
})

export {Text};
