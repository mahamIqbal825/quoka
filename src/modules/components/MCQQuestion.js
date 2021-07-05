
import React, { PureComponent } from 'react';

import {
    TouchableOpacity,
    View,
    StyleSheet,
    Touchable
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
import ImagePreview from 'react-native-image-preview';

class MCQQuestion extends PureComponent {


    showImagePreview(url){

        this.setState({
            previewImage:true,
            imagePreviewLink:url
        })

    }

    state={
        previewImage:false,
        imagePreviewLink:""
    }


    render() {

        const { data, serialNumber, onChoiceSelected } = this.props

        return (
            <View style={{
            }}>
                <Text>
                    {serialNumber}: {data.title}
                </Text>

                {
                    data.context && data.context !== "" ? (
                        <View style={{
                        }}>
                            <Text>
                                {
                                    data.context
                                }
                            </Text>
                        </View>
                    ):(null)
                }
                {
                    data.images && data.images.length > 0 && (
                        <FlatList
                            data={data.images}
                            numColumns={2}
                            renderItem={({ item }) => (
                                <View style={{ width: "48%", marginRight: 10, marginBottom: 10 }}>
                                    <TouchableOpacity onPress={()=>this.showImagePreview(`${config.BASE_URL}image/${item.url.slice(8)}`)}>
                                        <FastImage
                                            source={{ uri: `${config.BASE_URL}image/${item.url.slice(8)}` }}
                                            style={{
                                                width: "100%",
                                                height: 150
                                            }}
                                            resizeMode="contain"
                                        />
                                    </TouchableOpacity>
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
                            choice.choice !== "" || choice.Images.length > 0 ? (
                                <TouchableOpacity style={{
                                    justifyContent: 'center',
                                    borderWidth: 1,
                                    borderColor: choice.selected ? Theme.palette.primary : Theme.palette.lightGray,
                                    paddingHorizontal: 20,
                                    paddingVertical: 5,
                                    borderRadius: 10,
                                    marginBottom: 10,
                                    backgroundColor: choice.selected ? Theme.palette.primaryLight : "#fff",
                                }}
                                    onPress={() => onChoiceSelected(choice, index)}
                                >
                                    <HorizontalContainer noSpaceBetween style={{ marginBottom: 0, width: "80%" }}>
                                        <View
                                            style={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: 50,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: choice.selected ? Theme.palette.primaryDark : Theme.palette.lightGray,
                                                marginRight: 20
                                            }}
                                        >
                                            <Text small bold>{choice.letter}</Text>

                                        </View>
                                        <Text>{choice.choice}</Text>
                                    </HorizontalContainer>
                                    {
                                        choice.Images && choice.Images.length > 0 && (
                                            <View style={{ marginTop: Theme.spacing.sectionVerticalSpacing }}>
                                                <FastImage
                                                    source={{ uri: `${config.BASE_URL}image/${choice.Images[0].url.slice(8)}` }}
                                                    style={{
                                                        width: "100%",
                                                        height: 100
                                                    }}
                                                    resizeMode="contain"
                                                />
                                                <Text small> {choice.Images[0].description} </Text>
                                            </View>
                                        )
                                    }
                                </TouchableOpacity>
                            ) : (null)
                        ))
                    }
                </View>
                <ImagePreview visible={this.state.previewImage} source={{uri: this.state.imagePreviewLink}} close={()=>{this.setState({ previewImage:false })}} />
            </View>
        )

    }

}
const styles = StyleSheet.create({


})

export { MCQQuestion };
