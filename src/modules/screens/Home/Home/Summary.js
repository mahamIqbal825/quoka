import React, { Component } from 'react'
import {

    SafeAreaView,
    StyleSheet,
    Dimensions,
    StatusBar,
    View,
    TouchableOpacity,
    FlatList,
    Modal,
    Text as RNText
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
    ModalContainer,

} from '../../../components'

import { translate } from '../../../../utils/localize'

import _ from 'lodash'

import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
} from "react-native-chart-kit";

const deviceWidth = Dimensions.get('window').width
const deviceHeight = Dimensions.get('window').height

import { Icon, Item } from 'native-base'
import { inject, observer } from 'mobx-react'


const data = {
    labels: ["Run"],
    data: [0.2]
};

const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#fff",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(69, 93, 170, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.1,
    useShadowColorFromDataset: false // optional
};

@inject('userStore', 'mainStore')
@observer
export default class Summary extends Component {

    componentDidMount() {
        this.getSessionStats()
    }


    state = {
        correctAnswers: 0,
        wrongAnswers: 0,
        timeSpent: 0,
        averageTimeSpent: 0,
        chapters: [],
        practiceLoading: false,
        totalMarks: 0,
        userTotalMarks: 0,
        sessionUnansweredQuestions : 0
    }

    arrAvg = arr => arr.reduce((a, b) => a + b, 0) / arr.length

    getSessionStats() {

        var correctAnswers = 0
        var wrongAnswers = 0
        var timeSpent = 0
        var averageTimeSpent = []
        var examType = ""
        var subject = ""
        var totalMarks = 0
        var userTotalMarks = 0
        var sessionUnansweredQuestions = 0




        this.props.mainStore.sessions.map((session) => {
            session.questions.map((question) => {

                examType = question.examType && question.examType.name
                subject = question.subject && question.subject.name

                timeSpent += question.timeTaken
                totalMarks += question.mark ? parseFloat(question.mark) : 0

                averageTimeSpent.push(question.timeTaken)

                if (question.userAnswer) {

                    var questionCorrection = this.props.mainStore.checkIfQuestionAnswerIsCorrect(question)
                    if (questionCorrection.correct) {
                        userTotalMarks += questionCorrection.mark ? parseFloat(questionCorrection.mark) : 0

                        correctAnswers += 1
                    } else {
                        wrongAnswers += 1
                    }
                } else {
                    wrongAnswers += 1
                    sessionUnansweredQuestions += 1

                }
            })
        })
        this.getChapterStats()
        if (this.props.navigation.state.params) {
            if (!this.props.navigation.state.params.analytics) {
                this.props.mainStore.updateExamSession({
                    mark: userTotalMarks,
                    totalTime: timeSpent,
                    id: this.props.mainStore.serverExamSessionId
                })
            }
        }else{
            this.props.mainStore.updateExamSession({
                mark: userTotalMarks,
                totalTime: timeSpent,
                id: this.props.mainStore.serverExamSessionId
            })
        }


        console.log("ALL QUESTIONS TOTAL MARKS : ", totalMarks)





        this.setState({
            correctAnswers,
            wrongAnswers,
            timeSpent,
            averageTimeSpent: this.arrAvg(averageTimeSpent),
            totalMarks,
            userTotalMarks,
            sessionUnansweredQuestions
        })
    }

    getChapterStats() {

        var questions = []

        this.props.mainStore.sessions.map((session) => {
            return session.questions.map((question) => { questions.push(question) })
        })

        var groupedQuestions = _.chain(questions)
            .groupBy("chapter.name")
            .map((value, key) => ({ chapter: key, questions: value }))
            .value()

        var chapters = []

        groupedQuestions.map((chapter, index) => {
            var tempChapter = chapter
            var timeSpent = 0
            var correctAnswers = 0
            var wrongAnswers = 0
            var averageTimeSpentOnQuestion = []
            var unansweredQuestions = 0

            tempChapter.totalQuestions = chapter.questions.length

            chapter.questions.map((question, i) => {

                timeSpent += question.timeTaken
                averageTimeSpentOnQuestion.push(question.timeTaken)


                if (question.userAnswer) {
                    var questionCorrection = this.props.mainStore.checkIfQuestionAnswerIsCorrect(question)
                    if (questionCorrection.correct) {
                        correctAnswers += 1
                    } else {
                        wrongAnswers += 1
                    }
                } else {
                    unansweredQuestions += 1
                }

            })

            tempChapter.timeSpent = timeSpent
            tempChapter.averageTimeSpentOnQuestion = this.arrAvg(averageTimeSpentOnQuestion)
            tempChapter.unansweredQuestions = unansweredQuestions
            tempChapter.wrongAnswers = wrongAnswers
            tempChapter.correctAnswers = correctAnswers

            chapters.push(tempChapter)

        })

        this.setState({ chapters })

        //console.log("chapters : ", chapters)


    }

    

    state = {
        showConfirmationDialog: false
    }

    getPercentage(userMark, totalMark) {
        if (userMark && totalMark) {
            return userMark * 100 / totalMark / 100
        } else {
            return 0
        }
    }



    _keyExtractor = (item, index) => `${item.id}_${index}`;


    render() {
        const { params } = this.props.navigation.state
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar barStyle="dark-content" />
                <KeyboardAwareScrollView style={{ flex: 1 }}>
                    <ContentContainer style={{
                        width: "80%",
                        alignSelf:'center'
                    }}>
                        <BackButton
                            onPress={() => this.props.navigation.navigate("Home")} 
                        />
                        <HorizontalContainer >

                            <Text medium bold>
                                {translate('exam_summary')}
                            </Text>

                        </HorizontalContainer>

                        <View style={{

                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <ProgressChart
                                data={{
                                    labels: ["Total Marks"],
                                    data: [this.getPercentage(this.state.userTotalMarks, this.state.totalMarks)]
                                }}
                                width={deviceWidth}
                                height={220}
                                strokeWidth={20}
                                radius={90}
                                chartConfig={chartConfig}
                                hideLegend={true}
                                style={{
                                    alignItems:'center',
                                    justifyContent: 'center',
                                }}
                            />
                                <Text
                                    bold
                                    style={{
                                        position:'absolute',
                                        fontSize: 31,
                                        textAlign:'center',
                                        width: 200,
                                        height: 180
                                    }}
                                >
                                    {
                                        `
                                        ${this.state.userTotalMarks}/${this.state.totalMarks}
                                        `
                                    }
                                </Text>


                        </View>


                        <HorizontalContainer style={{ marginBottom: 5 }}>
                            <Text>{translate('correct_exam_answer')}</Text>
                            <Text>{this.state.correctAnswers}</Text>
                        </HorizontalContainer>
                        <HorizontalContainer style={{ marginBottom: 5 }}>
                            <Text>{translate('wrong_exam_answers')}</Text>
                            <Text>{this.state.wrongAnswers}</Text>
                        </HorizontalContainer>
                        <HorizontalContainer style={{ marginBottom: 5 }}>
                            <Text>{translate('time_spent')}</Text>
                            <Text>{new Date((this.state.timeSpent || 0) * 1000).toISOString().substr(11, 8)}</Text>
                        </HorizontalContainer>
                        <HorizontalContainer style={{ marginBottom: 5 }}>
                            <Text style={{ width:"50%" }}>{translate('average_exam_time_spent')}</Text>
                            <Text>{new Date((this.state.averageTimeSpent || 0) * 1000).toISOString().substr(11, 8)}</Text>
                        </HorizontalContainer>
                        <HorizontalContainer style={{ marginBottom: 5 }}>
                            <Text style={{ width:"50%" }}>{translate('unanswered_questions')}</Text>
                            <Text>{`${this.state.sessionUnansweredQuestions}`}</Text>
                        </HorizontalContainer>

                        <View style={{ marginTop: Theme.spacing.sectionVerticalSpacing }}>
                            {
                                this.state.chapters && this.state.chapters.map((chapter) => (
                                    <View style={{ marginTop: Theme.spacing.sectionVerticalSpacing }}>
                                        <Text bold>{chapter.chapter}</Text>
                                        <HorizontalContainer style={{ marginBottom: 5 }}>
                                            <Text>{translate('time_spent')}</Text>
                                            <Text>{new Date((chapter.timeSpent || 0) * 1000).toISOString().substr(11, 8)}</Text>
                                        </HorizontalContainer>
                                        <HorizontalContainer style={{ marginBottom: 5 }}>
                                            <Text>{translate('total_questions')}</Text>
                                            <Text>{chapter.totalQuestions}</Text>
                                        </HorizontalContainer>
                                        <HorizontalContainer style={{ marginBottom: 5 }}>
                                            <Text>{translate('correct_exam_answer')}</Text>
                                            <Text>{chapter.correctAnswers}</Text>
                                        </HorizontalContainer>
                                        <HorizontalContainer style={{ marginBottom: 5 }}>
                                            <Text>{translate('wrong_exam_answers')}</Text>
                                            <Text>{chapter.wrongAnswers}</Text>
                                        </HorizontalContainer>
                                        <HorizontalContainer style={{ marginBottom: 5 }}>
                                            <Text style={{ width:"50%" }}>{translate('unanswered_questions')}</Text>
                                            <Text>{chapter.unansweredQuestions}</Text>
                                        </HorizontalContainer>
                                        <HorizontalContainer style={{ marginBottom: 5 }}>
                                            <Text style={{ width:"50%" }}>{translate('average_time_on_question')}</Text>
                                            <Text>{new Date((chapter.averageTimeSpentOnQuestion || 0) * 1000).toISOString().substr(11, 8)}</Text>
                                        </HorizontalContainer>

                                        {
                                            params && params.practice ? (
                                                null
                                            ) : (
                                                    <Button
                                                        text={translate('practice_chapter')}
                                                        textButton
                                                        loading={this.state.practiceLoading}
                                                        textStyle={{ alignSelf: 'center' }}
                                                        onPress={() => {

                                                        }}
                                                    />
                                                )
                                        }




                                    </View>
                                ))
                            }
                        </View>
                        <View style={{ marginTop: Theme.spacing.sectionVerticalSpacing, marginBottom: 100 }}>
                            {
                                // params && params.practice ? (
                                //     <Button
                                //         text={translate('go_back_home')}
                                //         arrow
                                //         textStyle={{ alignSelf: 'center' }}
                                //         onPress={() => {
                                //             this.props.navigation.navigate("Home")
                                //         }}
                                //     />
                                // ) : (
                                        <Button
                                            text={translate('view_corrections')}
                                            arrow
                                            textStyle={{ alignSelf: 'center' }}
                                            onPress={() => {
                                                var questions = []
                                                console.log("CHAPTERs : ", this.state.chapters)
                                                this.state.chapters.map((chapter) => {
                                                    chapter.questions.map((question) => {
                                                        var tempQuestion = question
                                                        if(question.type !== "context"){
                                                            var questionCorrection = this.props.mainStore.checkIfQuestionAnswerIsCorrect(tempQuestion)
                                                            if (questionCorrection && questionCorrection.correct) {
                                                                tempQuestion.result = true
                                                                tempQuestion.userMark = questionCorrection ? questionCorrection.mark : 0
                                                            } else {
                                                                tempQuestion.result = false
                                                                tempQuestion.userMark = questionCorrection ? questionCorrection.mark : 0
                                                            }

                                                            questions.push(tempQuestion)
                                                        }
                                                        
                                                    })
                                                })
                                                console.log("QUESTIONS : ", questions)
                                                this.props.navigation.navigate("Corrections", { questions })
                                            }}
                                        />
                                    // )
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