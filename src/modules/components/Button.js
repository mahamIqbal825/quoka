
import React, { PureComponent } from 'react';

import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet
} from 'react-native';

import Spinner from 'react-native-spinkit'
import { Theme } from './Theme'
import { Icon } from 'native-base'

import LinearGradient from 'react-native-linear-gradient';


class Button extends PureComponent {

  render() {

    const { containerStyle,text, style, textStyle, onPress, loading, textButton, gradient, arrow, back, disabled, width} = this.props



    return (

      <TouchableOpacity  disabled={loading || disabled} onPress={onPress} style={[{ width: width || null,height: 60,opacity: disabled ? 0.3 : 1 },{...containerStyle}]} >

        <LinearGradient
          colors={
            textButton ? 
            ['#fff', '#fff'] :
            gradient ? 
            [Theme.palette.primary, Theme.palette.primaryDark] :
            [Theme.palette.darkGray, Theme.palette.darkGray]
          }
          // start={{x:0, y:1}} 
          // end={{X:1, y:0}}
          style={[{ 
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: textButton ? 'center' : 'space-between',
            alignItems: 'center',
            paddingVertical: 13,
            borderRadius: 100,
            paddingHorizontal: 20,
          },{ ...style }]}
        >
          {
            arrow && back && (
              <Icon
                type="AntDesign"
                name="arrowleft"
                style={{
                  color: "#fff",
                  marginRight: 10
                }}
              />
            )
          }

          <Text style={[{
            fontSize: 20,
            color: textButton ? Theme.palette.primaryDark : "#fff",
            fontWeight: textButton ? "400" : "700",
            letterSpacing: textButton ? 0 : 2
          }, { ...textStyle }]}>
            {
              loading ? (
                <Spinner
                  isVisible={loading}
                  size={30}
                  type="ThreeBounce"
                  color={"#fff"}
                />
              ) : (
                  text
                )
            }
          </Text>
          {
            arrow && !back && (
              <Icon
                type="AntDesign"
                name="arrowright"
                style={{
                  color: "#fff",
                  marginLeft: 10
                }}
              />
            )
          }
        </LinearGradient>

      </TouchableOpacity>
    )

  }

}
const styles = StyleSheet.create({


})

export { Button };
