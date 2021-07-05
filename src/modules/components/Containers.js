
import React,{PureComponent} from 'react';

import {
  TouchableOpacity,
  View,
  Text as RNText,
  StyleSheet,
  ImageBackground,
  ScrollView
} from 'react-native';
import { Theme } from './Theme'


const ContentContainer = ({ children, style }) => {
    return (
        <View style={ [styles.contentContainer,{...style}] }>
            {
                children
            }
        </View>
    )
}

const HorizontalContainer = ({ children, noSpaceBetween, style }) => {
    return (
        <View style={ [styles.horizontalContainer,{ justifyContent:noSpaceBetween ? null : 'space-between'},{...style}] }>
            {
                children
            }
        </View>
    )
}

const AbsoluteContainer = ({ children, top, bottom, left, right }) => {
    return (
        <View style={ [styles.absoluteContainer, { top, bottom, left, right }] }>
            {
                children
            }
        </View>
    )
}

const ModalContainer = ({ children }) => {
    return (
        <ScrollView style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)"
        }}
        contentContainerStyle={{
            justifyContent: 'center',
        }}
        >
            <View style={[styles.container, { marginTop: 50 }]}>
                {
                    children
                }
            </View>
            
        </ScrollView>
    )
}


const styles = StyleSheet.create({
    contentContainer:{
        marginHorizontal: Theme.spacing.containerSpacing,
    },
    horizontalContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Theme.spacing.sectionVerticalSpacing
    },
    absoluteContainer: {
        position: 'absolute',
        alignItems:'center',
        alignSelf:'center'
    },
    container: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
        backgroundColor: "#fff",
        marginHorizontal: 20,
        padding: 30,
        borderRadius: 15,
        zIndex: 1,
        marginBottom: 20
    },
    
})

export {ContentContainer, HorizontalContainer, AbsoluteContainer, ModalContainer};
