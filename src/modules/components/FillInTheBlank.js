
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
import { translate } from '../../utils/localize';


class FillInTheBlank extends PureComponent {

    render() {



        const { data, serialNumber, onAnswerFieldChanged, value, disabled } = this.props



        var blankCount = 0;
        var answerFields = []

        if(data.context){
            blankCount = (data.context.match(/___/g) || []).length;
            var payments = [];

            for(let i = 0; i < blankCount; i++){
                answerFields.push(
                    <Input
                        multiline
                        style={{
                            paddingLeft: 20,
                            paddingTop: 20,
                            height: 50,
                            marginBottom: 10
                        }}
                        placeholder={ `Answer ${ i + 1 }` }
                        onChange={(value)=> { 
                            onAnswerFieldChanged(value.toLowerCase(), i, blankCount);
                         }}
                        value={data.userAnswer && data.userAnswer[i] && data.userAnswer[i] || ""}
                        editable={disabled}

                    />
                )
            }
        }

        return (
            <View style={{
            }}>
                <Text>
                    {serialNumber}: {data.title}
                </Text>

                {/* <View style={{
                    marginLeft: 40,
                    paddingLeft: 10,
                    borderLeftColor: Theme.palette.lightGray,
                    borderLeftWidth: 1,
                }}> */}
                {/* <Text small bold style={{ fontSize: 13 }}>CONTEXT</Text> */}
                <Text small>
                    {
                        data.context && 
                        data.context
                        .replace(/(\\n)/g, '\n$1')
                        .replace(/(\\n)/g, '')
                    }
                </Text>
                {/* </View> */}
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
                    <Text>
                        {
                            translate('enter_answer_here')
                        }
                    </Text>

                        {
                            answerFields
                        }
                    

                    {/* <Input
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
                    /> */}
                </View>

            </View>
        )

    }

}
const styles = StyleSheet.create({


})

export { FillInTheBlank };
