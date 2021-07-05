
import React, { PureComponent } from 'react';

import {
    TouchableOpacity,
    View,
    StyleSheet
} from 'react-native';

import Spinner from 'react-native-spinkit'
import { Theme } from './Theme'
import { Text } from './Text'

import config from '../../services/config'

import { Icon, CheckBox } from 'native-base'
import RNPickerSelect from 'react-native-picker-select';
import { HorizontalContainer } from './Containers';

import FastImage from 'react-native-fast-image'
import { FlatList } from 'react-native-gesture-handler';

import { Input } from './Input'


class ShortAnswer extends PureComponent {

    render() {
        const { data, serialNumber, onAnswerFieldChanged, value, disabled } = this.props

        return (
            <View style={{
            }}>
                <Text>
                    {serialNumber}: {data.title}
                </Text>
                {/* {
                    console.log("CONTEXT : ", data.context)
                } */}


                    <Text>
                        {data.context}
                    </Text>
                {
                    data.images && data.images.length > 0 &&(
                        <FlatList
                            data={data.images}
                            numColumns={2}
                            renderItem={({item})=>(
                                <View style={{ width:"48%", marginRight:10, marginBottom: 10 }}>
                                    <FastImage
                                        source={ {uri:`${config.BASE_URL}image/${ item.url.slice(8) }`} }
                                        style={{
                                            width: "100%",
                                            height: 150
                                        }}
                                        resizeMode="contain"
                                    />
                                    <Text small>
                                        {item.description}
                                    </Text>
                                </View>
                            )}
                        />
                    )
                }


                <View style={{ marginTop: Theme.spacing.sectionVerticalSpacing + 20 }}>
                    <Input
                        multiline
                        style={{
                            paddingLeft: 20,
                            paddingTop: 20,
                            height: 70
                        }}
                        placeholder="Write your answer here"
                        onChange={(value)=> onAnswerFieldChanged(value)}
                        value={value}
                        editable={disabled}
                    />
                </View>

            </View>
        )

    }

}
const styles = StyleSheet.create({


})

export { ShortAnswer };
