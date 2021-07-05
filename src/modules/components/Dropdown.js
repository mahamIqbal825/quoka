import React, {PureComponent} from 'react';

import {TouchableOpacity, View, Text, StyleSheet} from 'react-native';

import Spinner from 'react-native-spinkit';
import {Theme} from './Theme';
import {Icon} from 'native-base';
import RNPickerSelect from 'react-native-picker-select';

class Dropdown extends PureComponent {
  render() {
    const {data, onChange, placeholder, noMarginTop} = this.props;

    return (
      // <View style={{

      //     shadowColor: "#000",
      //     shadowOffset: {
      //         width: 0,
      //         height: 1,
      //     },
      //     shadowOpacity: 0.20,
      //     shadowRadius: 1.41,
      //     elevation: 2,
      //     backgroundColor: "#fff",
      //     paddingVertical: 13,
      //     paddingLeft: 30,
      //     paddingRight: 20,
      //     borderRadius: 10,
      //     marginBottom: Theme.spacing.itemVerticalSpacing,
      //     marginTop: noMarginTop ? 0 : Theme.spacing.itemVerticalSpacing,
      //     flexDirection:'row',
      //     alignItems:'center',
      //     justifyContent:'space-between'

      // }}>
      <RNPickerSelect
        style={{inputAndroid: {color: 'black'}}}
        onValueChange={(value) => onChange(value)}
        items={data && data.length > 0 ? data : {label: '', value: ''}}
      />
      // <Icon
      //     type="AntDesign"
      //     name="downcircleo"
      //     style={{
      //         color: Theme.palette.lightGray,
      //         fontSize: 15
      //     }}
      // />
      // </View>
    );
  }
}
const styles = StyleSheet.create({});

export {Dropdown};
