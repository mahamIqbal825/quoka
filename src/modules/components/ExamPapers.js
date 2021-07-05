
import React, { PureComponent } from 'react';

import {
    TouchableOpacity,
    View,
    StyleSheet,
    Image,
    ImageBackground
} from 'react-native';

import Spinner from 'react-native-spinkit'
import { Theme } from './Theme'
import { Text } from './Text'
import { Button } from './Button'

import { Icon } from 'native-base'
import RNPickerSelect from 'react-native-picker-select';
import LinearGradient from 'react-native-linear-gradient';
import { translate } from '../../utils/localize';

class ExamPapers extends PureComponent {

    render() {

        const { item, onPress } = this.props

        return (
            <TouchableOpacity onPress={() => { onPress(item.id, item.name) }} style={{ width: "100%", marginRight: 10, marginBottom: 10 }}>
                <ImageBackground
                    source={require('../../assets/images/paper_stack.png')}
                    style={{
                        width: "90%",
                        height: 310,

                    }}
                >
                    <View style={{
                        padding: 20,
                    }}>
                        <Text bold medium white style={{ width: "80%" }}>
                            {
                                item.name
                            }
                        </Text>

                    </View>

                </ImageBackground>
            </TouchableOpacity>


        )

    }

}
const styles = StyleSheet.create({


})

export { ExamPapers };
