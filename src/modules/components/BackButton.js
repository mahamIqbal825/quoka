
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
import RNPickerSelect from 'react-native-picker-select';

class BackButton extends PureComponent {

    render() {

        const { onPress, white } = this.props



        return (
            <TouchableOpacity 
            onPress={onPress}
            style={{


                justifyContent: 'center',
                width: 50,
                height: 50,
                marginTop: 20

            }}>
                <Icon
                    type="AntDesign"
                    name="arrowleft"
                    style={{
                        color: white ? "#fff" : Theme.palette.black,
                        fontSize: 25
                    }}
                />
            </TouchableOpacity>
        )

    }

}
const styles = StyleSheet.create({


})

export { BackButton };
