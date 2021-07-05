
import React, { PureComponent } from 'react';

import {
    TouchableOpacity,
    View,
    Text,
    StyleSheet,
    Image
} from 'react-native';

import Spinner from 'react-native-spinkit'
import { Theme } from './Theme'
import { Icon } from 'native-base'
import RNPickerSelect from 'react-native-picker-select';
import LinearGradient from 'react-native-linear-gradient';

class AppModes extends PureComponent {

    render() {

        const { item, onPress } = this.props

        //console.log("ITEM : ", item)

        return (
            <TouchableOpacity onPress={()=>onPress(item.screen, item.type)} style={{ width:"48%", marginRight:10, marginBottom: 10 }}>
                <LinearGradient
                    colors={[Theme.palette.primary, Theme.palette.primaryDark]}
                    // start={{x:0, y:1}}
                    // end={{x:1, y:0}}
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingVertical: 13,
                        borderRadius: 10,
                        width: "100%",
                        height: 150,
                    }}
                >
                    <Image
                        source={item.image}
                        style={{
                            width: 100,
                            height: 100
                        }}
                    />
                </LinearGradient>
            </TouchableOpacity>


        )

    }

}
const styles = StyleSheet.create({


})

export { AppModes };
