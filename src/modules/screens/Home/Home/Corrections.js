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
    Text,
    ContentContainer,
    Theme,
    HorizontalContainer,
    BackButton,
    MCQQuestion,
    TrueOrFalse,
    EssayType,
    ShortAnswer,
    FillInTheBlank,
    Matching
} from '../../../components'

import { Container, Header, Content, Tab, Tabs } from 'native-base';

import { translate } from '../../../../utils/localize'

import config from '../../../../services/config'

const deviceWidth = Dimensions.get('window').width
const deviceHeight = Dimensions.get('window').height

import { Icon } from 'native-base'
import { inject, observer } from 'mobx-react'
import { ScrollView } from 'react-native-gesture-handler';

import FastImage from 'react-native-fast-image'
@inject('userStore', 'mainStore')
@observer
export default class Corrections extends Component {

    state = {
        questions: [],
        selectedQuestionIndex: 0
    }

    componentWillMount() {

        if (this.props.navigation.state.params && this.props.navigation.state.params.questions) {
            this.setState({ questions: this.props.navigation.state.params.questions })
        }

    }

    componentDidMount() {

        if (this.props.navigation.state.params && this.props.navigation.state.params.subjectId) {
            this.props.mainStore.fetchSubjectExamTypes(this.props.navigation.state.params.subjectId)

        }


    }



    _keyExtractor = (item, index) => `${item.id}_${index}`;

    getQuestionBasedOnType(question) {
        if (question.type === 'mcq') {
            return (
                <MCQQuestion
                    data={this.state.questions[this.state.selectedQuestionIndex]}
                    serialNumber={this.state.selectedQuestionIndex + 1}
                    onChoiceSelected={(choice, choiceIndex) => { }}
                />
            )
        } else if (question.type === "true or false") {

            return (
                <TrueOrFalse
                    data={this.state.questions[this.state.selectedQuestionIndex]}
                    serialNumber={this.state.selectedQuestionIndex + 1}
                    onTrueFalseSelected={(choice, choiceIndex) => { }}
                />
            )
        } else if (question.type === "essay") {
            return (
                <EssayType
                    data={this.state.questions[this.state.selectedQuestionIndex]}
                    serialNumber={this.state.selectedQuestionIndex + 1}
                    disabled={true}

                />
            )
        } else if (question.type === "short answer") {
            return (
                <ShortAnswer
                    data={this.state.questions[this.state.selectedQuestionIndex]}
                    serialNumber={this.state.selectedQuestionIndex + 1}
                    onAnswerFieldChanged={(value) => { }}
                    value={question.userAnswer ? question.userAnswer.answer : ''}
                    disabled={true}
                />
            )
        } else if (question.type === "fill in the blank") {
            return (
                <FillInTheBlank
                    data={this.state.questions[this.state.selectedQuestionIndex]}
                    serialNumber={this.state.currentQuestionIndex + 1}
                    onAnswerFieldChanged={(value, index, blankCount) => { }}
                    disabled={true}

                />
            )
        }else if(question.type === "matching"){
            return(
                <Matching
                    data={this.state.questions[this.state.selectedQuestionIndex]}
                    serialNumber={this.state.currentQuestionIndex + 1 }
                    onMatchingAnswered={(value, index)=>{  }}
                    disabled={true}
                />
            )
        }
    }

    getUserAnswer() {

        if (this.state.questions[this.state.selectedQuestionIndex].type === "true or false") {
            return (
                <Text  >{this.state.questions[this.state.selectedQuestionIndex].userAnswer.answer}</Text>
            )
        } else if (this.state.questions[this.state.selectedQuestionIndex].type === "mcq") {
            return (
                <View>
                    <Text bold >{this.state.questions[this.state.selectedQuestionIndex].userAnswer.letter}</Text>
                    <Text  >{this.state.questions[this.state.selectedQuestionIndex].userAnswer.choice}</Text>
                </View>
            )
        } else if (this.state.questions[this.state.selectedQuestionIndex].type === "fill in the blank") {
            console.log("USER ANSWER : ", this.state.questions[this.state.selectedQuestionIndex].userAnswer)
            return (
                <Text>
                    {
                        this.state.questions[this.state.selectedQuestionIndex].userAnswer.map((ans) => {
                            if (ans) {
                                return `${ans}, `
                            }
                        })
                    }
                </Text>

            )
        } else if (this.state.questions[this.state.selectedQuestionIndex].type === "matching") {
            return (
                <Text>
                    {
                        this.state.questions[this.state.selectedQuestionIndex].userAnswer.map((ans) => {
                            if (ans) {
                                return `${ans}, `
                            }
                        })
                    }
                </Text>

            )
        }

    }

    getCorrectAnswer(){
        var answer = ""
        if(this.state.questions[this.state.selectedQuestionIndex].type === "matching"){
            var matchingAnswer = JSON.parse(this.state.questions[this.state.selectedQuestionIndex].context).answer
            matchingAnswer.map((ans) => 
            {
                answer += `${ans}, `
            })
        }else{
            this.state.questions[this.state.selectedQuestionIndex].answer &&
            this.state.questions[this.state.selectedQuestionIndex].answer.map((ans) => 
            {
                answer += `${ans.answer}, `
            })
        }

        return answer
        
    }

    render() {



        return (
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar barStyle="dark-content" />
                <KeyboardAwareScrollView style={{ flex: 1 }}>


                    <ContentContainer>

                        <BackButton
                            onPress={() => this.props.navigation.goBack()}
                        />
                        <HorizontalContainer >

                            <Text medium bold>
                                {translate('corrections')}
                            </Text>

                        </HorizontalContainer>

                        <Tabs

                        >
                            <Tab
                                heading={translate('question')}
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
                                <View style={{ marginTop: Theme.spacing.sectionVerticalSpacing }}>
                                    <HorizontalContainer>
                                        <View>
                                            <Text small bold style={{ fontSize: 13 }}>
                                                {
                                                    translate('correct_answer')
                                                }
                                            </Text>
                                            <Text bold>
                                                {
                                                    this.getCorrectAnswer()
                                                }
                                            </Text>
                                            <Text small>
                                                {
                                                    this.state.questions[this.state.selectedQuestionIndex].answer && 
                                                    this.state.questions[this.state.selectedQuestionIndex].answer[0] && 
                                                    this.state.questions[this.state.selectedQuestionIndex].answer[0].description
                                                }
                                            </Text>
                                            {
                                                this.state.questions[this.state.selectedQuestionIndex].answer &&
                                                this.state.questions[this.state.selectedQuestionIndex].answer[0] &&
                                                this.state.questions[this.state.selectedQuestionIndex].answer[0].Images &&
                                                this.state.questions[this.state.selectedQuestionIndex].answer[0].Images.length > 0 &&
                                                (
                                                    <View>
                                                        <FastImage
                                                            source={{ uri: `${config.BASE_URL}image/${this.state.questions[this.state.selectedQuestionIndex].answer[0].Images[0].url.slice(8)}` }}
                                                            style={{
                                                                width: "80%",
                                                                height: 150
                                                            }}
                                                            resizeMode="contain"
                                                        />
                                                        <Text small>

                                                            {
                                                                this.state.questions[this.state.selectedQuestionIndex].answer[0].Images[0].description
                                                            }

                                                        </Text>
                                                    </View>

                                                )
                                            }
                                        </View>
                                        <Icon
                                            type="AntDesign"
                                            name={
                                                this.state.questions[this.state.selectedQuestionIndex].result ?
                                                    "checkcircle" : "closecircle"}
                                            style={{
                                                color: this.state.questions[this.state.selectedQuestionIndex].result ?
                                                    "green" : "red",
                                                fontSize: 25
                                            }}
                                        />

                                    </HorizontalContainer>

                                    <Text small bold style={{ fontSize: 13 }}>
                                        {
                                            translate('time_spent')
                                        }, {new Date((this.state.questions[this.state.selectedQuestionIndex].timeTaken || 0) * 1000).toISOString().substr(11, 8)}
                                    </Text>





                                    {
                                        this.getQuestionBasedOnType(this.state.questions[this.state.selectedQuestionIndex])
                                    }
                                </View>
                            </Tab>
                            <Tab
                                heading={translate('your_answer')}
                                tabStyle={{
                                    backgroundColor: Theme.palette.primaryLight
                                }}
                                activeTabStyle={{
                                    backgroundColor: Theme.palette.primaryDark
                                }}
                                textStyle={{
                                    color: "#000"
                                }}
                            >
                                <View style={{
                                    marginTop: Theme.spacing.sectionVerticalSpacing
                                }}>
                                    {
                                        this.state.questions[this.state.selectedQuestionIndex].userAnswer ? (
                                            <View>
                                                {
                                                    this.getUserAnswer()

                                                }

                                            </View>
                                        ) : (
                                                <View style={{ alignItems: 'center' }}>
                                                    <FastImage
                                                        source={require('../../../../assets/images/no_answer.jpg')}
                                                        style={{
                                                            width: "100%",
                                                            height: 250,
                                                        }}
                                                        resizeMode="contain"
                                                    />
                                                    <Text style={{ marginTop: 20, textAlign: 'center' }}>{translate('no_answer')}</Text>
                                                </View>

                                            )
                                    }
                                </View>
                            </Tab>
                        </Tabs>


                        <View style={{ marginVertical: Theme.spacing.sectionVerticalSpacing }}>
                            <TouchableOpacity
                                style={{
                                    width: "100%",
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    paddingVertical: 15,
                                    borderColor: 
                                    this.state.questions[this.state.selectedQuestionIndex].result ? 
                                    "red" : "green",
                                    borderWidth: 2,
                                    borderRadius: 10,
                                    backgroundColor: 
                                    this.state.questions[this.state.selectedQuestionIndex].result ? 
                                    "rgba(255,0,0,0.1)" : "rgba(0,255,0,0.1)",
                                }}
                                onPress={()=>{
                                    if(this.state.questions[this.state.selectedQuestionIndex].result){
                                        var questions = this.state.questions
                                        questions[this.state.selectedQuestionIndex].result = false
                                        this.setState({ questions })
                                    }else{
                                        var questions = this.state.questions
                                        questions[this.state.selectedQuestionIndex].result = true
                                        this.setState({ questions })
                                    }
                                }}
                            >
                                {
                                    this.state.questions[this.state.selectedQuestionIndex].result ? (
                                        <Text small style={{ fontSize: 15 }}>
                                            {
                                                translate('mark_wrong').consoloe .item.replace().consg(ite) 
                                            }
                                        </Text>
                                    ) : (
                                            <Text small style={{ fontSize: 15 }}>
                                                {
                                                    translate('mark_correct')
                                                }
                                            </Text>
                                        )
                                }

                            </TouchableOpacity>

                        </View>



                    </ContentContainer>

                </KeyboardAwareScrollView>
                <View style={{ backgroundColor: Theme.palette.primaryDark, height: 100 }}>
                    <ScrollView
                        horizontal
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingLeft: 20 }}>
                            {
                                this.state.questions.map((question, index) => (
                                    <TouchableOpacity style={{
                                        backgroundColor:
                                            this.state.selectedQuestionIndex === index ? "#000" : Theme.palette.primaryLight,
                                        width: 60,
                                        height: 60,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 10,
                                        marginRight: 10
                                    }}
                                        onPress={() => {
                                            //console.log("SELECTED QUESTION : ", this.state.questions[index])
                                            this.setState({ selectedQuestionIndex: index })
                                        }}
                                    >
                                        <Text
                                            bold
                                            medium
                                            white={this.state.selectedQuestionIndex === index}
                                        >{index + 1}</Text>
                                    </TouchableOpacity>
                                ))
                            }




                        </View>
                    </ScrollView>
                </View>

            </SafeAreaView>

        )

    }
}

const styles = StyleSheet.create({



})