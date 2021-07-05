import React, { Component } from 'react'
import {

    SafeAreaView,
    StyleSheet,
    Dimensions,
    StatusBar,
    View,
    TouchableOpacity,
    FlatList,
    Image,
    Share
} from 'react-native'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import { Container, Header, Content, Button, ListItem, Text, Left, Body, Right, Switch } from 'native-base';
import {
    HeaderShape,
    Text as CText,
    ContentContainer,
    Input,
    Theme,
    HorizontalContainer,
    Button as CButton,
    AbsoluteContainer,
    Dropdown,
    Loading,
    AppModes,
    toast,
    ExamPapers,
    BackButton,
    ItemCard,
    NotificationItem,
    NewSignupModal,
    EditProfileModal
} from '../../../components'

import { setI18nConfig, translate } from '../../../../utils/localize'

const deviceWidth = Dimensions.get('window').width
const deviceHeight = Dimensions.get('window').height

import { Icon, Item } from 'native-base'
import { inject, observer } from 'mobx-react'


@inject('userStore', 'mainStore')
@observer
export default class Setting extends Component {

    componentDidMount() {



    }

    state = {
        onBoardingModal: false,
        updateProfileModal: false
    }


    onShare = async () => {
        Share.share(
            {
                message: `${translate('share_message')} Referral Code: ${this.props.userStore.userData.referralCode}`,
                title: translate('share_title'),
            },
            {
                dialogTitle: translate('share_title_two'),
            },
        );
    };



    _keyExtractor = (item, index) => `${item.id}_${index}`;


    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar barStyle="dark-content" />
                <KeyboardAwareScrollView style={{ flex: 1 }}>

                    <HorizontalContainer>
                        <HeaderShape left></HeaderShape>

                        <View style={{
                            marginTop: 50,
                            alignItems: 'flex-end',
                            marginRight: 20
                        }}>
                            <Image
                                source={require('../../../../assets/images/user_placeholder.jpg')}
                                style={{
                                    width: 70,
                                    height: 70,
                                    borderRadius: 50,
                                    marginBottom: 20
                                }}
                            />
                            <CText
                                style={{ color: "#000" }}
                                small
                                bold
                            >
                                {
                                    this.props.userStore.userData.fullName
                                }
                            </CText>
                            <CText
                                style={{ color: "#000" }}
                                small
                            >
                                {

                                }
                            </CText>

                        </View>

                    </HorizontalContainer>

                    <ContentContainer>
                        {/* <BackButton
                            onPress={()=> this.props.navigation.goBack() }
                        /> */}
                        <HorizontalContainer >

                            <CText medium bold>
                                {
                                    translate('setting')
                                }
                            </CText>

                        </HorizontalContainer>



                        <ListItem icon
                            onPress={() => {
                                this.setState({
                                    updateProfileModal: true
                                })
                            }}
                        >
                            <Left>

                                <Icon type="AntDesign" active name="user" />

                            </Left>
                            <Body>
                                <Text>{translate('edit_profile')}</Text>
                            </Body>
                            <Right>
                                <Icon active name="arrow-forward" />
                            </Right>
                        </ListItem>


                        <ListItem icon
                            onPress={() => {
                                this.setState({
                                    onBoardingModal: true
                                })
                            }}>
                            <Left>
                                <Icon type="FontAwesome" active name="language" />
                            </Left>
                            <Body>
                                <Text>{translate('change_grade_and_lang')}</Text>
                            </Body>
                            <Right>
                                <Icon active name="arrow-forward" />
                            </Right>
                        </ListItem>

                        <ListItem icon
                            onPress={() => {
                                this.onShare()
                            }}>
                            <Left>
                                <Icon type="AntDesign" active name="sharealt" />
                            </Left>
                            <Body>
                                <Text>{translate('refer_and_earn')}</Text>
                            </Body>
                            <Right>
                                <Icon active name="arrow-forward" />
                            </Right>
                        </ListItem>



                    </ContentContainer>

                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 100
                    }}>
                        <Text> {translate('change_language')} </Text>

                        <HorizontalContainer>
                            <CButton
                                text={translate('english')}
                                textButton
                                onPress={() => {

                                    setI18nConfig("en")
                                    this.props.mainStore.saveLanguage("en")
                                    this.forceUpdate()

                                }}
                            />
                            <CButton
                                text={translate('tamil')}
                                textButton
                                onPress={() => {
                                    setI18nConfig("ta")
                                    this.props.mainStore.saveLanguage("ta")
                                    this.forceUpdate()

                                }}
                            />
                        </HorizontalContainer>


                    </View>

                </KeyboardAwareScrollView>


                <NewSignupModal
                    visible={this.state.onBoardingModal}

                    navigation={this.props.navigation}
                    onFinish={() => this.setState({ onBoardingModal: false })}
                />

                <EditProfileModal
                    visible={this.state.updateProfileModal}
                    onFinish={() => { this.setState({ updateProfileModal: false }) }}
                    navigation={this.props.navigation}

                />

            </SafeAreaView>

        )

    }
}

const styles = StyleSheet.create({

})