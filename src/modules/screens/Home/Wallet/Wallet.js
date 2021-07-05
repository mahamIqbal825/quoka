import React, { Component } from 'react'
import {

    SafeAreaView,
    StyleSheet,
    Dimensions,
    StatusBar,
    View,
    TouchableOpacity,
    FlatList,
    Alert,
    Modal,
    Platform,
} from 'react-native'
import prompt from 'react-native-prompt-android';
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
import PayHere from '@payhere/payhere-mobilesdk-reactnative';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import WebView from 'react-native-webview'

const paymentObject = {
    "sandbox": true,                 // true if using Sandbox Merchant ID
    "merchant_id": "1217140",        // Replace your Merchant ID
    "merchant_secret": "8n2yEQKIm264Dvn6MZpJPn8m1n9CqMRzs4Pb1qqbRRt3",        // See step 4e
    "notify_url": "http://quokkavapp.com/notify",
    "order_id": "ItemNo12345",
    "items": "Hello from React Native!",
    "amount": "50.00",
    "currency": "LKR",
    "first_name": "Saman",
    "last_name": "Perera",
    "email": "samanp@gmail.com",
    "phone": "0771234567",
    "address": "No.1, Galle Road",
    "city": "Colombo",
    "country": "Sri Lanka",
    "delivery_address": "No. 46, Galle road, Kalutara South",
    "delivery_city": "Kalutara",
    "delivery_country": "Sri Lanka",
    "custom_1": "",
    "custom_2": ""
};

@inject('userStore', 'mainStore')
@observer
export default class Wallet extends Component {

    componentDidMount() {

        this.props.userStore.getWallet()
        this.props.userStore.getUserTransactions()


    }

    state = {
        alertVisible: false,
        modalVisible: false,
        qrModalVisible: false
    }

    initPayment(amount) {
        console.log("AMOUNT : ", amount)
        // this.setState({
        //     modalVisible:true
        // })
        PayHere.startPayment(
            {
                "sandbox": false,                 // true if using Sandbox Merchant ID
                "merchant_id": "217233",        // Replace your Merchant ID
                "merchant_secret": "8Qie7HkfxT84eZBx4i9VZ44OdhYo0QeJy8my3FoumHGL",        // See step 4e
                "notify_url": "http://quokkavapp.com/notify",
                "order_id": "FundWallet",
                "items": "Fund Wallet",
                "amount": `${parseFloat(amount)}`,
                "currency": "LKR",
                "first_name": "",
                "last_name": "",
                "email": "",
                "phone": "",
                "address": "",
                "city": "",
                "country": "Sri Lanka",
                "delivery_address": "",
                "delivery_city": "",
                "delivery_country": "Sri Lanka",
                "custom_1": "",
                "custom_2": ""
            },
            (paymentId) => {
                this.props.userStore.addWallet(amount)
                alert("Wallet Funded")
            },
            (errorData) => {
                Alert.alert("PayHere Error", errorData);
            },
            () => {
                console.log("Payment Dismissed");
            }
        );
    }

    showPrompt() {


        if (Platform.OS === "ios") {
            Alert.prompt(
                translate('wallet_amount'),
                translate('add_wallet_desc'),
                [
                    { text: translate('cancel'), onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                    { text: 'OK', onPress: amount => this.initPayment(amount) },
                ]
            );
        } else {
            prompt(
                translate('wallet_amount'),
                translate('add_wallet_desc'),
                [
                    { text: translate('cancel'), onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                    { text: 'OK', onPress: amount => this.initPayment(amount) },
                ],
                {
                    type: '',
                    cancelable: false,
                    defaultValue: '',
                    placeholder: 'Enter Amount'
                }
            );
        }

    }

    _keyExtractor = (item, index) => `${item.id}_${index}`;


    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar barStyle="dark-content" />
                <KeyboardAwareScrollView style={{ flex: 1 }}>
                    <HorizontalContainer>
                        <HeaderShape left></HeaderShape>
                        <TouchableOpacity 
                        onPress={()=>{
                            this.setState({ qrModalVisible: true })
                        }}
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 20
                        }}>
                            <Icon
                                type="Ionicons"
                                name="qr-code-outline"
                                style={{
                                    fontSize: 50
                                }}
                            />
                            <Text>Scan Code</Text>
                        </TouchableOpacity>
                    </HorizontalContainer>

                    <ContentContainer>
                        {/* <BackButton
                            onPress={()=> this.props.navigation.goBack() }
                        /> */}




                        <HorizontalContainer >

                            <Text medium bold>
                                {
                                    translate('wallet')
                                }
                            </Text>

                            <Button
                                text={translate('add_amount')}
                                textButton
                                onPress={() => {
                                    this.showPrompt()
                                }}
                            />


                        </HorizontalContainer>


                        <View style={{
                            width: "100%",
                            alignItems: 'center',
                            backgroundColor: Theme.palette.primary,
                            borderRadius: 10,
                            paddingTop: 20
                        }}>
                            <Text large bold white> ரூ{this.props.userStore.userWallet.balance} </Text>

                            <View style={{
                                backgroundColor: Theme.palette.primaryDark,
                                borderBottomLeftRadius: 10,
                                borderBottomRightRadius: 10,
                                alignItems: 'center',
                                width: "100%",
                                marginTop: 20
                            }}>
                                <Text white small>{translate('amount_in_wallet')}</Text>
                            </View>
                        </View>
                        <View style={{ marginTop: Theme.spacing.sectionVerticalSpacing }}>
                            <Text bold> {translate('transaction_history')}</Text>
                            {
                                console.log("this.props.userStore.userTransactions", this.props.userStore.userTransactions)
                            }
                            <View style={{ marginTop: Theme.spacing.containerSpacing }}>
                                {
                                    this.props.userStore.userTransactions.map((transaction) => (
                                        <NotificationItem
                                            item={{
                                                body: transaction.message,
                                                title: transaction.type === "DEPOSIT" ?
                                                    `Deposit-${transaction.amount}` :
                                                    `Withdraw-${transaction.amount}`,
                                                createdAt: transaction.createdAt
                                            }}

                                        />
                                    ))
                                }
                            </View>

                        </View>

                    </ContentContainer>

                    <Modal
                        visible={this.state.qrModalVisible}
                        animationType="slide"
                    >
                        <View style={{
                            flex: 1,
                            backgroundColor: '#fff'
                        }}>

                            <QRCodeScanner
                                onRead={(value)=>{
                                    console.log("VALUE : ", value.data)
                                    this.props.mainStore.checkQrCode(value.data)
                                    this.setState({ qrModalVisible: false })

                                }}
                                flashMode={RNCamera.Constants.FlashMode.off}
                                
                                bottomContent={
                                    <TouchableOpacity style={styles.buttonTouchable}>
                                        <Text style={styles.buttonText}>Scan QR Code</Text>
                                    </TouchableOpacity>
                                }
                            />


                            <Button
                                text={"Cancel"}
                                textButton
                                containerStyle={{
                                    position: 'absolute',
                                    bottom: 20,
                                    alignSelf: 'center'
                                }}
                                onPress={() => {
                                    this.setState({ qrModalVisible: false })
                                }}
                            />
                        </View>
                    </Modal>



                </KeyboardAwareScrollView>





            </SafeAreaView>

        )

    }
}

const styles = StyleSheet.create({

})