import React, { Component } from 'react'
import {

    SafeAreaView,
    StyleSheet,
    Dimensions,
    StatusBar,
    View,
    TouchableOpacity,
    FlatList,
    Image
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
import {inject, observer} from 'mobx-react'


@inject('userStore','mainStore')
@observer
export default class Notification extends Component {

    componentDidMount(){

        this.props.mainStore.getUserNotifications()

    }

    

    _keyExtractor = (item,index) => `${item.id}_${index}`;
    

    render() {  
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar barStyle="dark-content" />
                <KeyboardAwareScrollView style={{ flex: 1 }}>
                    <ContentContainer>
                        <BackButton
                            onPress={()=> this.props.navigation.goBack() }
                        />
                        <HorizontalContainer >

                            <Text medium bold>
                                {
                                    translate('notification')
                                }
                            </Text>
                            
                        </HorizontalContainer>
                        
                        <View style={{ marginTop: Theme.spacing.sectionVerticalSpacing }}>
                            
                            {
                                this.props.mainStore.notificationsLoading ? (
                                    <Loading
                                        height={100}
                                        quantity={["","","","","",""]}
                                        radius={10}
                                        width={"100%"}
                                        containerMarginRight={0}
                                    />
                                ) : (
                                    this.props.mainStore.notifications.length > 0 ? (
                                    <FlatList
                                        data={this.props.mainStore.notifications}
                                        renderItem={({item})=>(
                                            <NotificationItem item={item}/>
                                        )}
                                    />
                                    ):(
                                        <View style={{ alignItems:'center', justifyContent:'center' }}>
                                                <Image 
                                                    source={ require('../../../../assets/images/no_data.jpg') }
                                                    style={{
                                                        width: "80%",
                                                        height: 250
                                                    }}
                                                />
                                                <Text style={{ textAlign:'center', marginTop: 20 }}>
                                                    {
                                                        translate('no_notification')
                                                    }
                                                </Text>
                                        </View>
                                    )
                                    
                                    
                                )
                            }
                            
                            


                        </View>


                    </ContentContainer>



                </KeyboardAwareScrollView>

            </SafeAreaView>

        )

    }
}

const styles = StyleSheet.create({

})