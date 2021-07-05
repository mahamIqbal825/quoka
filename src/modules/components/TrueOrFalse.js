
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

class TrueOrFalse extends PureComponent {

    render() {

        const { data, serialNumber, onTrueFalseSelected } = this.props

        return (
            <View style={{
            }}>
                <Text>
                    {serialNumber}: {data.title}
                </Text>

                {
                    data.context || data.context !== "" && (
                        <View style={{
                            
                        }}>

                            <Text>
                                {
                                    data.context
                                }
                            </Text>
                        </View>
                    )
                }
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

                    {
                        data.choices && data.choices.map((choice, index) => (
                            <TouchableOpacity style={{
                                justifyContent: 'center',
                                borderWidth: 1,
                                borderColor: choice.selected ? Theme.palette.primary : Theme.palette.lightGray,
                                paddingHorizontal: 20,
                                paddingVertical: 5,
                                borderRadius: 10,
                                marginBottom: 10,
                                backgroundColor: choice.selected ? Theme.palette.primaryLight : "#fff"
                            }} 
                            onPress={()=> onTrueFalseSelected(choice, index)}
                            >
                                <HorizontalContainer noSpaceBetween style={{ marginBottom: 0 }}>
                                    <Text>{ choice.choice }</Text>
                                </HorizontalContainer>
                            </TouchableOpacity>
                        ))
                    }
                </View>

            </View>
        )

    }

}
const styles = StyleSheet.create({


})

export { TrueOrFalse };
