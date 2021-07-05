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
import LinearGradient from 'react-native-linear-gradient';

import { translate } from '../../../../utils/localize'

const deviceWidth = Dimensions.get('window').width
const deviceHeight = Dimensions.get('window').height

import { Container, Header, Content, Tab, Tabs } from 'native-base';


import { Icon, Item } from 'native-base'
import { inject, observer } from 'mobx-react'

import {
    LineChart,
    BarChart
} from "react-native-chart-kit";

import moment from 'moment'
import { ScrollView } from 'react-native-gesture-handler';

const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#fff",
    backgroundGradientToOpacity: 0.9,
    color: (opacity = 1) => 'red',
    // strokeWidth: 2, // optional, default 3
    barPercentage: 1,
    useShadowColorFromDataset: false // optional
};


@inject('userStore', 'mainStore')
@observer
export default class Analytics extends Component {

    state = {
        data: {
            labels: [""],
            datasets: [
                {
                    data: [0],
                    color: (opacity = 1) => "#000", // optional
                    strokeWidth: 2 // optional
                }
            ]
        },
        sessionData: [],
        examModeTime: 0,
        practiceModeTime: 0,
        studyModeTime: 0
    }


    async getTimers() {

        var examModeTimer = await this.props.mainStore.getTimer("examModeTimer")
        var practiceModeTimer = await this.props.mainStore.getTimer("practiceModeTimer")
        var studyModeTimer = await this.props.mainStore.getTimer("studyModeTimer")


        console.log("examModeTimer", examModeTimer)
        console.log("practiceModeTimer", practiceModeTimer)
        console.log("studyModeTimer", studyModeTimer)

        this.setState({
            examModeTime: examModeTimer ? examModeTimer : 0,
            practiceModeTime: practiceModeTimer ? practiceModeTimer : 0,
            studyModeTime: studyModeTimer ? studyModeTimer : 0,
        }, () => {
            console.log(" state examModeTimer", this.state.examModeTime)
            console.log(" state practiceModeTimer", this.state.practiceModeTime)
            console.log(" state studyModeTimer", this.state.studyModeTime)
        })



    }


    async componentDidMount() {

        this.getTimers()

        let userSession = await this.props.userStore.getUserSessions()

        if (userSession && !userSession.error && userSession.data.length > 0) {

            console.log("USER SESSIONS : ", userSession)

            var labels = []
            var marks = []
            userSession.data.map((session) => {

                console.log("SESISOn  DATA: ", session.createdAt)
                labels.push(moment(session.createdAt).format("D, MMM"))
                marks.push(parseFloat(session.mark))
            })

            this.setState({
                data: {
                    labels: labels,
                    datasets: [
                        {
                            data: marks,
                            color: (opacity = 1) => "#000", // optional
                            strokeWidth: 2 // optional
                        }
                    ]
                },
                sessionData: userSession
            })

            console.log('LABELS : ', labels)


        }

    }



    _keyExtractor = (item, index) => `${item.id}_${index}`;


    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar barStyle="dark-content" />
                <KeyboardAwareScrollView>

                    <HeaderShape left></HeaderShape>
                    <ContentContainer>

                        <Tabs

                        >
                            <Tab
                                heading={translate('exam_history_lbl')}
                                tabStyle={{
                                    backgroundColor: Theme.palette.primaryLight
                                }}
                                activeTabStyle={{
                                    backgroundColor: Theme.palette.primaryDark,
                                }}
                                textStyle={{
                                    color: "#000"
                                }}
                            >
                                <HorizontalContainer style={{ marginTop: 20 }}>

                                    <Text medium bold >
                                        {
                                            translate('reviews')
                                        }
                                    </Text>
                                </HorizontalContainer>

                                <ScrollView horizontal>
                                    <LineChart
                                        data={this.state.data}
                                        width={deviceWidth * 3}
                                        height={220}
                                        chartConfig={chartConfig}
                                        bezier
                                    />
                                </ScrollView>

                                <ScrollView horizontal>
                                    <BarChart
                                        data={this.state.data}
                                        width={deviceWidth * 3}
                                        height={220}
                                        chartConfig={
                                            {
                                                backgroundGradientFrom: "#fff",
                                                backgroundGradientFromOpacity: 0,
                                                backgroundGradientTo: "#fff",
                                                backgroundGradientToOpacity: 0.9,
                                                color: (opacity = 1) => 'blue',
                                                // strokeWidth: 2, // optional, default 3
                                                barPercentage: 1,
                                                useShadowColorFromDataset: false // optional
                                            }
                                        }
                                        style={{
                                            marginTop: 20
                                        }}
                                    />
                                </ScrollView>


                                {
                                    this.props.userStore.userSessionLoading ? (
                                        <Loading
                                            height={170}
                                            quantity={["", "", ""]}
                                            radius={10}
                                            width={"100%"}
                                            containerMarginRight={0}
                                        />
                                    ) : (
                                        <FlatList
                                            data={this.props.userStore.userSessions}
                                            keyExtractor={this._keyExtractor}
                                            renderItem={({ item, index }) => (
                                                <ItemCard
                                                    index={index}
                                                    item={
                                                        {
                                                            name: item.examType,
                                                            mark: item.mark,
                                                            subject: item.subject,
                                                            createdAt: item.createdAt
                                                        }
                                                    }
                                                    onPress={(yearId, name, sessionData, data, index) => {
                                                        // var sessionData = this.props.mainStore.prepareSessionData()


                                                        var sessionData = this.state.sessionData

                                                        var formattedQuestions = []

                                                        this.props.userStore.userSessions[index].StudentAnswers.map((answer) => {
                                                            console.log("answer : ", answer)
                                                            var question = this.props.mainStore.prepareQuestionData([answer.Question], false, answer.answer)
                                                            formattedQuestions.push(question[0])

                                                        })



                                                        var userSessionData = {
                                                            questions: formattedQuestions,
                                                            Year: "",
                                                            duration: this.props.userStore.userSessions[index].totalTime,
                                                            name: formattedQuestions[0] ? formattedQuestions[0].questionGroup.name : ""
                                                        }

                                                        this.props.userStore.setUserSessionData([userSessionData]);
                                                        this.props.navigation.navigate("AnalyticsDetail", { name, subject: item.subject, createdAt: item.createdAt })
                                                    }}
                                                    height={170}
                                                    analytics
                                                />
                                            )}
                                        />
                                    )
                                }
                            </Tab>
                            <Tab
                                heading={translate('time_usage_lbl')}
                                tabStyle={{
                                    backgroundColor: Theme.palette.primaryLight
                                }}
                                activeTabStyle={{
                                    backgroundColor: Theme.palette.primaryDark,
                                }}
                                textStyle={{
                                    color: "#000"
                                }}

                            >
                                <HorizontalContainer style={{ marginTop: 20 }}>

                                    <Text medium bold>
                                        {
                                            translate('time_usage_lbl')
                                        }
                                    </Text>

                                </HorizontalContainer>

                                <LinearGradient
                                    colors={[Theme.palette.primary, Theme.palette.primaryDark]}
                                    style={{
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 10,
                                        width: "100%",
                                        height: 100,
                                    }}
                                >
                                    <HorizontalContainer style={{
                                        flex: 1,
                                        width: "100%",
                                        marginTop: 40,
                                        paddingHorizontal: 20
                                    }}>

                                        <Image
                                            source={require('../../../../assets/images/exam_mode.png')}
                                            style={{
                                                width: 80,
                                                height: 80
                                            }}
                                        />
                                        <View style={{
                                            alignItems: 'center'
                                        }}>
                                            <Text white>Exam Mode</Text>
                                            <Text white bold>
                                                {
                                                    this.props.mainStore.parseMillisecondsIntoReadableTime(this.state.examModeTime)
                                                }
                                            </Text>
                                        </View>

                                    </HorizontalContainer>
                                </LinearGradient>

                                <LinearGradient
                                    colors={[Theme.palette.primary, Theme.palette.primaryDark]}
                                    style={{
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 10,
                                        width: "100%",
                                        height: 100,
                                        marginTop: 20
                                    }}
                                >
                                    <HorizontalContainer style={{
                                        flex: 1,
                                        width: "100%",
                                        marginTop: 40,
                                        paddingHorizontal: 20
                                    }}>

                                        <Image
                                            source={require('../../../../assets/images/practice_mode.png')}
                                            style={{
                                                width: 80,
                                                height: 80
                                            }}
                                        />
                                        <View style={{
                                            alignItems: 'center'
                                        }}>
                                            <Text white>Practice Mode</Text>
                                            <Text white bold>{


                                                this.props.mainStore.parseMillisecondsIntoReadableTime(this.state.practiceModeTime)
                                            }</Text>
                                        </View>

                                    </HorizontalContainer>
                                </LinearGradient>

                                <LinearGradient
                                    colors={[Theme.palette.primary, Theme.palette.primaryDark]}
                                    style={{
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 10,
                                        width: "100%",
                                        height: 100,
                                        marginTop: 20
                                    }}
                                >
                                    <HorizontalContainer style={{
                                        flex: 1,
                                        width: "100%",
                                        marginTop: 40,
                                        paddingHorizontal: 20
                                    }}>

                                        <Image
                                            source={require('../../../../assets/images/study_mode.png')}
                                            style={{
                                                width: 80,
                                                height: 80
                                            }}
                                        />
                                        <View style={{
                                            alignItems: 'center'
                                        }}>
                                            <Text white>Study Mode</Text>
                                            <Text white bold>
                                                {
                                                    this.props.mainStore.parseMillisecondsIntoReadableTime(this.state.studyModeTime)
                                                }
                                            </Text>
                                        </View>

                                    </HorizontalContainer>
                                </LinearGradient>
                            </Tab>
                        </Tabs>








                    </ContentContainer>
                </KeyboardAwareScrollView>
            </SafeAreaView>

        )

    }
}

const styles = StyleSheet.create({

})