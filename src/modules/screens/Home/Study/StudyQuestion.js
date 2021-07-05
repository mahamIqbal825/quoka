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
    ScrollView
} from 'react-native'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import { NavigationEvents } from 'react-navigation';

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
    MCQQuestion,
    TrueOrFalse,
    EssayType,
    ShortAnswer,
    FillInTheBlank,
    Matching
} from '../../../components'

import YoutubePlayer from "react-native-youtube-iframe";

import { translate } from '../../../../utils/localize'
import FastImage from 'react-native-fast-image'
import config from '../../../../services/config'
const deviceWidth = Dimensions.get('window').width
const deviceHeight = Dimensions.get('window').height

import { Icon, Item } from 'native-base'
import { inject, observer } from 'mobx-react'


@inject('userStore', 'mainStore')
@observer
export default class StudyQuestion extends Component {

    async componentDidMount() {

        this.startTime = new Date() * 1;

        this.getQuestions()

        // let timer = setInterval(this.tick, 1000);
        // this.setState({timer});

    }


    constructor(props) {
        super(props)
        this.startTime = 0
    }

    async getQuestions() {
        let questions = []
        if (this.props.navigation.state.params && this.props.navigation.state.params.partId) {

            questions = await this.props.mainStore.fetchQuestionGroupQuestion(this.props.navigation.state.params.partId)
        }
        //console.log("QUESTIONS :" , questions)
        let formattedQuestions = this.props.mainStore.prepareQuestionData(questions.Questions)
        console.log("FORMATTED QUESTIONS :", formattedQuestions)

        this.setState({
            questions: formattedQuestions,
            nextPartLoading: false
        })
    }



    state = {
        questions: [],
        totalTimer: 0,
        questionTimer: 0,
        timer: null,
        currentQuestionIndex: 0,
        currentQuestionGroupIndex: 0,
        nextPartLoading: false,
        playing: false
    }

    tick = () => {
        this.setState({
            questionTimer: this.state.questionTimer + 1,
            totalTimer: this.state.totalTimer + 1,
        });
    }

    componentWillUnmount() {
        clearInterval(this.state.timer);
    }



    _keyExtractor = (item, index) => `${item.id}_${index}`;

    nextQuestion() {

        var questions = this.state.questions
        // questions[this.state.currentQuestionIndex].timeTaken = this.state.questionTimer
        this.setState({
            questions,
            currentQuestionIndex: this.state.currentQuestionIndex + 1,
        })

    }
    prevQuestion() {

        this.setState({
            currentQuestionIndex: this.state.currentQuestionIndex - 1,
            questionTimer: this.state.questions[this.state.currentQuestionIndex - 1].timeTaken
        })
    }


    finishSession() {



        this.props.navigation.goBack()

    }

    getQuestionBasedOnType(question) {
        if (question.type === 'mcq') {
            return (
                <MCQQuestion
                    data={this.state.questions[this.state.currentQuestionIndex]}
                    serialNumber={this.state.currentQuestionIndex + 1}
                    onChoiceSelected={(choice, choiceIndex) => { }}
                />
            )
        } else if (question.type === "true or false") {
            return (
                <TrueOrFalse
                    data={this.state.questions[this.state.currentQuestionIndex]}
                    serialNumber={this.state.currentQuestionIndex + 1}
                    onTrueFalseSelected={(choice, choiceIndex) => { }}
                />
            )
        } else if (question.type === "essay") {
            return (
                <EssayType
                    data={this.state.questions[this.state.currentQuestionIndex]}
                    serialNumber={this.state.currentQuestionIndex + 1}
                />
            )
        } else if (question.type === "short answer") {
            return (
                <ShortAnswer
                    data={this.state.questions[this.state.currentQuestionIndex]}
                    serialNumber={this.state.currentQuestionIndex + 1}
                    onAnswerFieldChanged={(value) => { }}

                />
            )
        } else if (question.type === "fill in the blank") {
            return (
                <FillInTheBlank
                    data={this.state.questions[this.state.currentQuestionIndex]}
                    serialNumber={this.state.currentQuestionIndex + 1}
                    onAnswerFieldChanged={(value, index, blankCount) => { }}

                />
            )
        } else if (question.type === "matching") {
            return (
                <Matching
                    data={this.state.questions[this.state.currentQuestionIndex]}
                    serialNumber={this.state.currentQuestionIndex + 1}
                    onMatchingAnswered={(value, index) => { }}
                />
            )
        }
    }

    onStateChange(state) {
        if (state === "ended") {
            this.setState({ playing: false })
            Alert.alert("video has finished playing!");
        }
    }

    componentBlurred() {
        let endTime = new Date() * 1;
        var elapsed = endTime - this.startTime;
        if (this.props.navigation.state.params && this.props.navigation.state.params.practice) {
            this.props.mainStore.setTimer(elapsed, "practiceModeTimer")
        } else {
            this.props.mainStore.setTimer(elapsed, "examModeTimer")
        }
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <NavigationEvents
                    onDidBlur={payload => this.componentBlurred()}
                />
                <StatusBar barStyle="dark-content" />
                <KeyboardAwareScrollView style={{ flex: 1 }}>
                    <ContentContainer>
                        <BackButton
                            onPress={() => this.props.navigation.goBack()}
                        />
                        <HorizontalContainer >

                            <Text medium bold>
                                {
                                    translate('study')
                                }
                            </Text>

                        </HorizontalContainer>

                        <HorizontalContainer>

                            <Text>

                            </Text>

                            <Text>
                                {this.state.currentQuestionIndex + 1}/{this.state.questions.length}
                            </Text>

                        </HorizontalContainer>



                        {
                            !this.state.nextPartLoading && this.state.questions && this.state.questions.length > 0 && (
                                this.getQuestionBasedOnType(this.state.questions[this.state.currentQuestionIndex])

                            )
                        }
                        <View style={{
                            marginTop: Theme.spacing.sectionVerticalSpacing
                        }}>

                            {
                                this.state.questions[this.state.currentQuestionIndex] &&
                                this.state.questions[this.state.currentQuestionIndex].studyMaterials &&
                                this.state.questions[this.state.currentQuestionIndex].studyMaterials.length > 0 && (
                                    this.state.questions[this.state.currentQuestionIndex].studyMaterials.map((study) => (
                                        <View>
                                            <Text small>
                                                {study.description}
                                            </Text>
                                            {
                                                study.Images && study.Images.map((img) => (
                                                    <View>
                                                        <FastImage
                                                            source={{ uri: `${config.BASE_URL}image/${img.url.slice(8)}` }}
                                                            style={{
                                                                width: "100%",
                                                                height: 150
                                                            }}
                                                            resizeMode="contain"
                                                        />
                                                        <Text small>
                                                            {img.description}
                                                        </Text>
                                                    </View>
                                                ))
                                            }
                                            {
                                                study.videoUrl && study.videoUrl !== "" ? (
                                                    <YoutubePlayer
                                                        height={300}
                                                        play={this.state.playing}
                                                        videoId={`${study.videoUrl}`}
                                                        volume={100}
                                                        onChangeState={(state) => this.onStateChange(state)}
                                                    />
                                                ) : (null)
                                            }


                                        </View>
                                    ))
                                )
                            }


                        </View>
                        <View style={{
                            marginTop: Theme.spacing.sectionVerticalSpacing
                        }}>
                            <HorizontalContainer>
                                <Button
                                    disabled={this.state.currentQuestionIndex === 0}
                                    text={translate('prev')}
                                    arrow
                                    back
                                    onPress={() => {
                                        this.prevQuestion()
                                    }}
                                />
                                {
                                    this.state.currentQuestionIndex === this.state.questions.length - 1 ?
                                        (
                                            this.state.currentQuestionGroupIndex < this.props.mainStore.sessions.length - 1 ?
                                                (
                                                    <Button

                                                        text={translate('finish')}
                                                        arrow
                                                        Loading={this.state.nextPartLoading}
                                                        onPress={() => {
                                                            this.finishSession()
                                                        }}
                                                    />
                                                ) : (
                                                    <Button

                                                        text={translate('finish')}
                                                        arrow
                                                        onPress={() => {
                                                            this.finishSession()

                                                        }}
                                                    />
                                                )
                                        )
                                        : (
                                            <Button
                                                disabled={this.state.currentQuestionIndex === this.state.questions.length - 1}
                                                text={translate('next')}
                                                arrow
                                                onPress={() => {
                                                    this.nextQuestion()
                                                }}
                                            />
                                        )
                                }

                            </HorizontalContainer>
                        </View>


                    </ContentContainer>
                    <View style={{ backgroundColor: Theme.palette.primaryDark, height: 100 }}>
                        <ScrollView
                            horizontal
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingLeft: 20 }}>
                                {
                                    this.state.questions.map((question, index) => (
                                        <TouchableOpacity style={{
                                            backgroundColor:
                                                this.state.currentQuestionIndex === index ? "#000" : Theme.palette.primaryLight,
                                            width: 60,
                                            height: 60,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: 10,
                                            marginRight: 10
                                        }}
                                            onPress={() => {
                                                //console.log("SELECTED QUESTION : ", thdis.state.questions[index])
                                                this.setState({ currentQuestionIndex: index })
                                                // this._scrollView.scrollTo(0);
                                            }}
                                        >
                                            <Text
                                                bold
                                                medium
                                                white={this.state.currentQuestionIndex === index}
                                            >{index + 1}</Text>
                                        </TouchableOpacity>
                                    ))
                                }




                            </View>
                        </ScrollView>
                    </View>

                </KeyboardAwareScrollView>

            </SafeAreaView>

        )

    }
}

const styles = StyleSheet.create({



})