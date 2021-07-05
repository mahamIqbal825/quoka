
import React, { PureComponent } from 'react';

import {
    TouchableOpacity,
    View,
    StyleSheet
} from 'react-native';

import Spinner from 'react-native-spinkit'
import { Theme } from './Theme'
import { Text } from './Text'

import { HorizontalContainer } from './Containers'
import LinearGradient from 'react-native-linear-gradient';

import {translate} from '../../utils/localize'

import { Icon } from 'native-base'
import RNPickerSelect from 'react-native-picker-select';

import moment from 'moment'

class ItemCard extends PureComponent {

    render() {

        const { item, onPress, height, analytics, buttonText, index } = this.props

        return (
            <TouchableOpacity            
                style={{
                    width:"100%",
                    height: height ? null : 70,
                    marginBottom: height ? 20 : 50
                }}
                onPress={()=>{ this.props.onPress( item.id, item.name, item, item, index ) }}
                
                >
                <LinearGradient
                    colors={[Theme.palette.primary, Theme.palette.primaryDark]}
                    // start={{x:0, y:1}}
                    // end={{x:1, y:0}}
                    style={{
                        alignItems: analytics ? null :  'center',
                        justifyContent: 'center',
                        paddingVertical: 13,
                        borderRadius: 10,
                        width: "100%",
                        height: height ? null : 100,
                    }}
                >   
                    <HorizontalContainer style={{ width:"100%", alignItems:'center', paddingHorizontal:20, paddingTop:10 }}>
                        
                        <Text bold white> { item.name } </Text>
                        {
                            analytics ? (null) : (
                                <TouchableOpacity style={{
                                    alignItems:'center',
                                    justifyContent:'center',
                                    width: 50,
                                    height: 50,
                                    borderRadius: 100,
                                    backgroundColor:Theme.palette.darkGray
                                }}
                                onPress={()=> onPress( item.id, item.name, item.sessionData, item, index ) }
                                >
                                    <Icon
                                        type="AntDesign"
                                        name="arrowright"
                                        style={{
                                            color:"#fff"
                                        }}
                                    />
                                </TouchableOpacity>
                            )
                        }
                        
                    </HorizontalContainer>

                        {
                            analytics && (
                                <HorizontalContainer style={{ marginHorizontal: 20 }}>
                                    <Text white>Mark {item.mark}</Text>

                                    <Text white>Subject {item.subject}</Text>

                                </HorizontalContainer>
                            )
                        }


                    {
                        analytics && (
                            <HorizontalContainer style={{ marginRight: 20 }}>
                                <TouchableOpacity style={{
                                    alignItems:'center',
                                    justifyContent:'center',
                                    flexDirection: 'row',
                                    height: 40,
                                    borderRadius: 100,
                                    backgroundColor:Theme.palette.darkGray,
                                    marginLeft: 20,
                                    paddingHorizontal: 10
                                }}
                                onPress={()=> onPress( item.id, item.name, item.sessionData ) }
                                >
                                    <Text white style={{ marginRight: 10 }}>{buttonText ? buttonText : translate('see_all') }</Text>
                                    <Icon
                                        type="AntDesign"
                                        name="arrowright"
                                        style={{
                                            color:"#fff"
                                        }}
                                    />
                                </TouchableOpacity>
                                <Text small white>
                                    {
                                        moment(item.createdAt).format('DD MMM, YYYY')
                                    }
                                </Text>
                            </HorizontalContainer>
                            
                        )
                    }

                </LinearGradient>
            </TouchableOpacity>
        )

    }

}
const styles = StyleSheet.create({


})

export { ItemCard };
