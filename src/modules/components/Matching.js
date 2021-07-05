
import React, { PureComponent } from 'react';

import {
    TouchableOpacity,
    View,
    StyleSheet,
    TextInput
} from 'react-native';

import Spinner from 'react-native-spinkit'
import { Theme } from './Theme'
import { Text } from './Text'
import { Input } from './Input'


import config from '../../services/config'

import { Icon, CheckBox } from 'native-base'
import RNPickerSelect from 'react-native-picker-select';
import { HorizontalContainer } from './Containers';

import FastImage from 'react-native-fast-image'
import { FlatList } from 'react-native-gesture-handler';

const alphabets = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z",]

class Matching extends PureComponent {

    render() {

        const { data, serialNumber, disabled,onMatchingAnswered } = this.props

        const columnA = JSON.parse(data.context).columnA
        const columnB = JSON.parse(data.context).columnB


        return (    
            <View style={{
            }}>
                <Text>
                    {serialNumber}: {data.title}
                </Text>

                <Text bold>
                    Column A
                </Text>
                <View>
                    {
                        columnA.map((options,index)=>(
                            <View style={{
                                flexDirection:'row',
                                alignItems:'center'
                            }}>
                                <Text bold style={{ marginRight: 10 }}>{index + 1}</Text>
                                <Input
                                    style={{
                                        paddingLeft: 10,
                                        width: 70
                                    }}
                                    maxChar={1}
                                    onChange={(value)=>{ onMatchingAnswered(value,index) }}
                                    editable={disabled}
                                    value={data.userAnswer && data.userAnswer[index]}
                                />
                                <Text style={{ marginLeft: 10 }}>{options}</Text>
                            </View>
                        ))
                    }
                </View>
                <Text bold>
                    Column B
                </Text>
                    {
                        columnB.map((options,index)=>(
                            <View style={{
                                flexDirection:'row',
                                alignItems:'center'
                            }}>
                                <Text bold style={{ marginRight: 10 }}>{alphabets[index]}</Text>
                                <Text style={{ marginLeft: 10 }}>{options}</Text>
                            </View>
                        ))
                    }
                

            </View>
        )

    }

}
const styles = StyleSheet.create({


})

export { Matching };
