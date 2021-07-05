import React, { Component } from 'react'
import {

    SafeAreaView,
    StyleSheet,
    Dimensions,
    StatusBar,
    View,
    TouchableOpacity,
    FlatList
} from 'react-native'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'

import {
    HeaderShape,
    Text,
    ContentContainer,
    Input,
    Theme,
    HorizontalContainer,
    Button,
    AbsoluteContainer,
    Dropdown,
    Loading,
    AppModes,
    toast,
    ExamPapers,
    BackButton,
    ItemCard,
    NotificationItem
} from '../../../components'

import { translate } from '../../../../utils/localize'

const deviceWidth = Dimensions.get('window').width
const deviceHeight = Dimensions.get('window').height

import { Icon, Item } from 'native-base'
import { inject, observer } from 'mobx-react'


@inject('userStore', 'mainStore')
@observer
export default class AnalyticsDetail extends Component {

    componentDidMount() {

        console.log("USER SESSION DATA : ", this.props.userStore.userSessionData)

    }



    _keyExtractor = (item, index) => `${item.id}_${index}`;


    render() {

        const { params } = this.props.navigation.state
        console.log("PARAMAs : ", params)
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar barStyle="dark-content" />
                <KeyboardAwareScrollView>

                    <ContentContainer>
                        <BackButton
                            onPress={()=> this.props.navigation.goBack() }
                        />
                        <HorizontalContainer>

                            <Text medium bold>
                                {
                                    params && params.name
                                }
                            </Text>
                        </HorizontalContainer>


                        <FlatList
                            data={this.props.userStore.userSessionData ? this.props.userStore.userSessionData : []}
                            keyExtractor={this._keyExtractor}
                            renderItem={({ item }) => (
                                <ItemCard
                                    item={
                                        {
                                            name: item.Year.name,
                                            mark: params ? params.mark : "",
                                            subject: params ? params.subject : "",
                                            createdAt: params ? params.createdAt : ""
                                        }
                                    }
                                    onPress={(yearId, name, sessionData) => {
                                        console.log("SESSION ITEM  :", item )
                                        this.props.mainStore.setSession([item])
                                        this.props.navigation.navigate("Summary", { analytics: true })

                                    }}
                                    height={170}
                                    analytics
                                    buttonText={translate('exam_summary')}
                                />
                            )}
                        />


                    </ContentContainer>
                </KeyboardAwareScrollView>
            </SafeAreaView>

        )

    }
}

const styles = StyleSheet.create({

})