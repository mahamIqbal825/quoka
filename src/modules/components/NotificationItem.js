
import React, { PureComponent } from 'react';

import {
    TouchableOpacity,
    View,
    Text as RNText,
    StyleSheet,
    ImageBackground
} from 'react-native';

import { Theme } from './Theme'
import { Text } from './Text'

import { HorizontalContainer } from './Containers'
import { Icon } from 'native-base'
import moment from 'moment'

class NotificationItem extends PureComponent {

    render() {

        const { item } = this.props
        return (
            <TouchableOpacity style={{
                backgroundColor: "#F7F7F7",
                paddingHorizontal: 20,
                paddingVertical: 15,
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 1,
                },
                shadowOpacity: 0.15,
                shadowRadius: 1.84,
                elevation: 2,
                marginBottom: 15

            }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems:'center'
                }}>
                    <View style={{
                        width: 50,
                        height: 50,
                        borderRadius: 100,
                        backgroundColor: Theme.palette.primaryDark,
                        alignItems:'center',
                        justifyContent: 'center',
                        marginRight: 20
                    }}>
                        <Icon
                            type="AntDesign"
                            name="notification"
                            style={{
                                color:"#fff",
                                fontSize: 23
                            }}
                        />
                    </View>
                    <View style={{ width: '80%' }}>
                        <HorizontalContainer style={{ flex:1, marginBottom: 0 }}>
                            <Text bold small>{ item.title }</Text>
                            <Text small> 5 hours ago </Text>
                        </HorizontalContainer>
                        <Text small>
                            {
                                item.body
                            }
                        </Text>
                    </View>
                    
                    

                </View>
            </TouchableOpacity>
        )

    }

}
const styles = StyleSheet.create({


})

export { NotificationItem };
