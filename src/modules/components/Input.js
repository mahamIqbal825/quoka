
import React, { PureComponent } from 'react';

import {
  TouchableOpacity,
  View,
  Text as RNText,
  StyleSheet,
  ImageBackground,
  TextInput,
  Platform
} from 'react-native';

import { Icon } from 'native-base'

import { Theme } from './Theme'

class Input extends PureComponent {

  render() {

    const { placeholder, type, icon, onChange, secureTextEntry, value, multiline, style, editable,maxChar } = this.props

    return (
      <View>

        <TextInput
          placeholder={placeholder}
          style={[styles.input,{...style}]}
          onChangeText={onChange}
          secureTextEntry={secureTextEntry}
          value={value}
          multiline={multiline}
          editable={!editable}
          maxLength={maxChar}
        />
        {
          icon && (
            <Icon
              type={type}
              name={icon}
              style={{
                position: 'absolute',
                marginTop: 15,
                marginLeft: 13,
                elevation: 4
              }}
            />
          )
        }


      </View>

    )

  }

}
const styles = StyleSheet.create({

  input: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
    backgroundColor: "#fff",
    paddingVertical: Platform.OS === "ios" ? 20 : 17 ,
    paddingLeft: 60,
    borderRadius: 10,
    marginBottom: Theme.spacing.itemVerticalSpacing
  }

})

export { Input };
