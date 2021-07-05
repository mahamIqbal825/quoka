import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Dimensions,
  StatusBar,
  View,
  TouchableOpacity,
  FlatList,
  Alert,
  ScrollView,
  Image,
  Modal,
} from 'react-native';
import {NavigationEvents} from 'react-navigation';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import Spinner from 'react-native-spinkit';
import {SketchCanvas} from '@terrylinla/react-native-sketch-canvas';
import RNSketchCanvas from '@terrylinla/react-native-sketch-canvas';

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
  Matching,
} from '../../../components';

import {translate} from '../../../../utils/localize';

import _ from 'lodash';

import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

import {Icon, Item} from 'native-base';
import {inject, observer} from 'mobx-react';

@inject('userStore', 'mainStore')
@observer
export default class Question extends Component {
  state = {
    questions: [],
    totalTimer: 0,
    questionTimer: 0,
    timer: null,
    currentQuestionIndex: 0,
    currentQuestionGroupIndex: 0,
    nextPartLoading: false,
    duration: 0,
    questionLoading: true,
    fillInTheBlankValue: '',
    selectedQuestionIndex: 0,
    answerImage: null,
    drawingModal: false,
  };

  constructor(props) {
    super(props);
    this._scrollView = null;
    this.startTime = 0;
  }

  async componentDidMount() {
    //console.log("question parts : ", this.props.mainStore.sessions)

    this.getQuestions();

    this.startTime = new Date() * 1;

    let timer = setInterval(this.tick, 1000);
    this.setState({timer});
  }

  componentWillUnmount() {}
  componentBlurred() {
    let endTime = new Date() * 1;
    var elapsed = endTime - this.startTime;
    if (
      this.props.navigation.state.params &&
      this.props.navigation.state.params.practice
    ) {
      this.props.mainStore.setTimer(elapsed, 'practiceModeTimer');
    } else {
      this.props.mainStore.setTimer(elapsed, 'examModeTimer');
    }
  }

  async getQuestions() {
    this.setState({
      questionLoading: true,
    });
    let questions = [];
    if (
      this.props.navigation.state.params &&
      this.props.navigation.state.params.practice
    ) {
      questions = await this.props.mainStore.fetchChapterQuestion(
        this.props.mainStore.sessions[0].id,
      );
    } else {
      var data = await this.props.mainStore.fetchQuestionGroupQuestion(
        this.props.mainStore.sessions[this.state.currentQuestionGroupIndex].id,
      );
      if (data) {
        questions = data.Questions;
        this.setState({duration: data.duration * 60});
      }
    }

    var formattedQuestions = [];
    if (questions && questions.length === 0) {
      this.finishSession();
    } else {
      formattedQuestions = this.props.mainStore.prepareQuestionData(questions);
    }
    console.log('formattedQuestions : ', formattedQuestions);
    this.setState({
      questions: formattedQuestions,
      nextPartLoading: false,
      questionLoading: false,
    });
  }

  tick = () => {
    this.setState({
      questionTimer: this.state.questionTimer + 1,
      totalTimer: this.state.totalTimer + 1,
      duration: this.state.duration - 1,
    });
    if (Math.round(this.state.duration) === 0) {
      this.finishSession();
    }
  };

  componentWillUnmount() {
    clearInterval(this.state.timer);
  }

  _keyExtractor = (item, index) => `${item.id}_${index}`;

  onChoiceSelected(choice, choiceIndex) {
    var newQuestions = [];
    this.state.questions.map((questions, index) => {
      var tempQuestions = questions;
      var newChoice = [];
      if (index === this.state.currentQuestionIndex) {
        //console.log("tempQuestions.choices",tempQuestions.choices)
        tempQuestions.choices.map((c, cindex) => {
          var tempChoice = c;
          if (cindex === choiceIndex) {
            tempChoice.selected = true;
            tempQuestions.userAnswer = tempChoice;
          } else {
            tempChoice.selected = false;
          }
          newChoice.push(tempChoice);
        });
        tempQuestions.choices = newChoice;
      }
      newQuestions.push(tempQuestions);
    });
    this.setState({questions: newQuestions});
  }

  nextQuestion() {
    var questions = this.state.questions;
    questions[
      this.state.currentQuestionIndex
    ].timeTaken = this.state.questionTimer;

    console.log(
      'CURRENT QUESTION : ',
      questions[this.state.currentQuestionIndex],
    );

    var questionCorrection = this.props.mainStore.checkIfQuestionAnswerIsCorrect(
      questions[this.state.currentQuestionIndex],
    );

    console.log('QUESTION CORRECTION  :', questionCorrection);

    var studentAnswerData = {
      sessionId: this.props.mainStore.serverExamSessionId,
      questionId: questions[this.state.currentQuestionIndex] ? questions[this.state.currentQuestionIndex].questionId : 1,
      mark: questionCorrection ? questionCorrection.mark : null,
      totalTime: this.state.questionTimer,
      answer: questions[this.state.currentQuestionIndex].userAnswer
        ? JSON.stringify(questions[this.state.currentQuestionIndex].userAnswer)
        : null,
      result: questionCorrection ? questionCorrection.mark : null,
      userId: this.props.userStore.userData ? this.props.userStore.userData.id : "",
    };

    console.log('studentAnswerData', studentAnswerData);

    this.props.mainStore.storeUserAnswer(studentAnswerData);

    this.setState(
      {
        questions,
        currentQuestionIndex: this.state.currentQuestionIndex + 1,
        questionTimer: 0,
        fillInTheBlankValue: '',
        answerImage: null,
      },
      () => {
        this._scrollView.scrollTo(0);
        this._scrollView.scrollTo({y: 0, animated: true});
      },
    );
  }
  prevQuestion() {
    this.setState(
      {
        currentQuestionIndex: this.state.currentQuestionIndex - 1,
        questionTimer: this.state.questions[this.state.currentQuestionIndex - 1]
          .timeTaken,
      },
      () => {
        // this._scrollView.scrollTop();
        this._scrollView.scrollTo(0);
        this._scrollView.scrollTo({y: 0, animated: true});
      },
    );
    console.log(
      'CURRENT QUESTION : ',
      this.state.questions[this.state.currentQuestionIndex - 1],
    );
  }

  async proceedToNextPart() {
    //console.log("QUESTIONS : ", this.state.questions)
    var questions = this.state.questions;
    questions[
      this.state.currentQuestionIndex
    ].timeTaken = this.state.questionTimer;
    var sessions = this.props.mainStore.sessions;
    sessions[this.state.currentQuestionGroupIndex].questions = questions;

    console.log('SESSIONS*& : ', sessions);

    this.props.mainStore.setSession(sessions);

    this.setState(
      {
        nextPartLoading: true,
        currentQuestionGroupIndex: this.state.currentQuestionGroupIndex,
        currentQuestionIndex: 0,
        questionTimer: 0,
        fillInTheBlankValue: '',
      },
      async () => {
        // await this.getQuestions()
        this.finishSession();
      },
    );
  }

  finishSession() {
    var questions = this.state.questions;
    questions[
      this.state.currentQuestionIndex
    ].timeTaken = this.state.questionTimer;
    var sessions = this.props.mainStore.sessions;

    console.log('SESISONS : ', sessions);

    sessions[this.state.currentQuestionGroupIndex].questions = questions;
    this.props.mainStore.setSession(sessions);

    if (
      this.props.navigation.state.params &&
      this.props.navigation.state.params.practice
    ) {
      this.props.navigation.navigate('Summary', {practice: true});
    } else {
      this.props.navigation.navigate('Summary');
    }
  }

  onAnswer(answer) {
    var newQuestions = [];
    this.state.questions.map((questions, index) => {
      var tempQuestions = questions;
      if (index === this.state.currentQuestionIndex) {
        tempQuestions.userAnswer = {answer};
      }

      newQuestions.push(tempQuestions);
    });

    this.setState({questions: newQuestions, fillInTheBlankValue: answer});
  }

  showConfirmEndExam() {
    Alert.alert(
      translate('exit_exam'),
      translate('exit_exam_message'),
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Yes', onPress: () => this.proceedToNextPart()},
      ],
      {cancelable: false},
    );
  }

  onFillBlankAnswerFill(value, index, blankCount) {
    var newQuestions = [];
    this.state.questions.map((questions, i) => {
      var tempQuestions = questions;
      var userAnswer = tempQuestions.userAnswer;
      if (userAnswer && userAnswer.length === blankCount) {
        userAnswer[index] = value;
      } else {
        userAnswer = Array(blankCount);
        userAnswer[index] = value;
      }

      tempQuestions.userAnswer = userAnswer;

      newQuestions.push(tempQuestions);
    });

    this.setState({questions: newQuestions});
  }
  onMatchingAnswered(value, questionIndex) {
    var newQuestions = [];
    this.state.questions.map((questions, index) => {
      var tempQuestions = questions;
      if (index === this.state.currentQuestionIndex) {
        if (tempQuestions.userAnswer && tempQuestions.userAnswer.length > 0) {
          tempQuestions.userAnswer[questionIndex] = value;
        } else {
          tempQuestions.userAnswer = [value];
        }
      }

      newQuestions.push(tempQuestions);
    });
    console.log('NEW QUESTIONS MATCHING WITH ANSWER : ', newQuestions);
    this.setState({questions: newQuestions});
  }

  getQuestionBasedOnType(question, gotQuestionData = false) {
    if (question.type === 'mcq') {
      return (
        <MCQQuestion
          data={
            gotQuestionData
              ? question
              : this.state.questions[this.state.currentQuestionIndex]
          }
          serialNumber={this.state.currentQuestionIndex + 1}
          onChoiceSelected={(choice, choiceIndex) =>
            this.onChoiceSelected(choice, choiceIndex)
          }
        />
      );
    } else if (question.type === 'true or false') {
      return (
        <TrueOrFalse
          data={
            gotQuestionData
              ? question
              : this.state.questions[this.state.currentQuestionIndex]
          }
          serialNumber={this.state.currentQuestionIndex + 1}
          onTrueFalseSelected={(choice, choiceIndex) =>
            this.onChoiceSelected(choice, choiceIndex)
          }
        />
      );
    } else if (question.type === 'essay') {
      return (
        <EssayType
          data={
            gotQuestionData
              ? question
              : this.state.questions[this.state.currentQuestionIndex]
          }
          serialNumber={this.state.currentQuestionIndex + 1}
        />
      );
    } else if (question.type === 'short answer') {
      return (
        <ShortAnswer
          data={
            gotQuestionData
              ? question
              : this.state.questions[this.state.currentQuestionIndex]
          }
          serialNumber={this.state.currentQuestionIndex + 1}
          onAnswerFieldChanged={(value) => this.onAnswer(value)}
          value={this.state.fillInTheBlankValue}
        />
      );
    } else if (question.type === 'fill in the blank') {
      return (
        <FillInTheBlank
          data={
            gotQuestionData
              ? question
              : this.state.questions[this.state.currentQuestionIndex]
          }
          serialNumber={this.state.currentQuestionIndex + 1}
          onAnswerFieldChanged={(value, index, blankCount) =>
            this.onFillBlankAnswerFill(value, index, blankCount)
          }
        />
      );
    } else if (question.type === 'matching') {
      return (
        <Matching
          data={
            gotQuestionData
              ? question
              : this.state.questions[this.state.currentQuestionIndex]
          }
          serialNumber={this.state.currentQuestionIndex + 1}
          onMatchingAnswered={(value, index) =>
            this.onMatchingAnswered(value, index)
          }
        />
      );
    }
  }

  openImagePicker() {
    launchImageLibrary({}, (value) => {
      this.setState({
        answerImage: value.uri,
      });
    });
  }

  getQuestionsCount(question) {
    var questions = question.filter((q) => !q.parentQuestion);
    var parentQuestions = question.filter((q) => q.parentQuestion);
    var parentQuestionsFiltered = _.uniqBy(
      parentQuestions,
      'parentQuestion.id',
    );
    return questions.length + parentQuestionsFiltered.length;
  }

  renderLoading() {
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flex: deviceHeight,
          deviceWidth,
        }}>
        <Spinner type="Circle" color={Theme.palette.primaryDark} />
      </View>
    );
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <NavigationEvents onDidBlur={(payload) => this.componentBlurred()} />
        <StatusBar barStyle="dark-content" />
        <ScrollView ref={(ref) => (this._scrollView = ref)} style={{flex: 1}}>
          <ContentContainer>
            <BackButton onPress={() => this.props.navigation.goBack()} />
            <HorizontalContainer>
              <Text medium bold>
                {this.props.navigation.state.params &&
                this.props.navigation.state.params.practice
                  ? this.props.mainStore.sessions &&
                    this.props.mainStore.sessions.name
                  : this.props.mainStore.sessions[
                      this.state.currentQuestionGroupIndex
                    ] &&
                    this.props.mainStore.sessions[
                      this.state.currentQuestionGroupIndex
                    ].name}
              </Text>
            </HorizontalContainer>

            {this.state.questionLoading ? (
              this.renderLoading()
            ) : (
              <View>
                {this.props.navigation.state.params &&
                this.props.navigation.state.params.practice ? (
                  <Text>
                    {this.state.currentQuestionIndex + 1}/
                    {this.getQuestionsCount(this.state.questions)}
                  </Text>
                ) : (
                  <View>
                    <HorizontalContainer>
                      {this.props.navigation.state.params &&
                        this.props.navigation.state.params.practice}
                      <Text
                        style={{
                          color:
                            this.state.duration * 60 < 18000 ? 'red' : '#000',
                          fontWeight:
                            this.state.duration * 60 < 18000
                              ? 'bold'
                              : 'normal',
                        }}>
                        {new Date(this.state.duration * 1000)
                          .toISOString()
                          .substr(11, 8)}
                      </Text>

                      <Text>
                        {this.state.currentQuestionIndex + 1}/
                        {this.getQuestionsCount(this.state.questions)}
                      </Text>
                    </HorizontalContainer>

                    <HorizontalContainer>
                      <Text>
                        {new Date(this.state.questionTimer * 1000)
                          .toISOString()
                          .substr(11, 8)}
                      </Text>
                    </HorizontalContainer>
                  </View>
                )}

                {!this.state.nextPartLoading &&
                  this.state.questions &&
                  this.state.questions.length > 0 &&
                  this.state.questions[this.state.currentQuestionIndex]
                    .parentQuestion && (
                    <View>
                      <Text>
                        {
                          this.state.questions[this.state.currentQuestionIndex]
                            .parentQuestion.title
                        }
                      </Text>
                      <Text>
                        {
                          this.state.questions[this.state.currentQuestionIndex]
                            .parentQuestion.description
                        }
                      </Text>
                    </View>
                  )}

                {!this.state.nextPartLoading &&
                  this.state.questions &&
                  this.state.questions.length > 0 &&
                  this.getQuestionBasedOnType(
                    this.state.questions[this.state.currentQuestionIndex],
                  )}
                {this.state.questions[this.state.currentQuestionIndex].type !==
                  'mcq' &&
                  this.state.questions[this.state.currentQuestionIndex].type !==
                    'true or false' && (
                    <View>
                      <View
                        style={{
                          marginTop: Theme.spacing.sectionVerticalSpacing,
                        }}>
                        <Text>Upload answer image</Text>
                        <TouchableOpacity
                          style={{
                            width: 70,
                            height: 70,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderWidth: 1,
                            borderColor: '#a7a7a7',
                            borderRadius: 5,
                            marginTop: 10,
                          }}
                          onPress={() => {
                            this.openImagePicker();
                          }}>
                          <Icon
                            type="Ionicons"
                            name="ios-add"
                            style={{
                              color: '#a7a7a7',
                              fontSize: 40,
                            }}
                          />
                        </TouchableOpacity>
                        {this.state.answerImage && (
                          <Image
                            source={{uri: this.state.answerImage}}
                            style={{
                              width: '100%',
                              height: 200,
                              marginTop: 20,
                            }}
                            resizeMode="contain"
                          />
                        )}
                      </View>
                      <TouchableOpacity
                        style={{
                          width: '50%',
                          height: 70,
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderWidth: 1,
                          borderColor: '#a7a7a7',
                          borderRadius: 5,
                          marginTop: 10,
                        }}
                        onPress={() => {
                          this.setState({drawingModal: true});
                        }}>
                        <Text>Draw Answer</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                <View
                  style={{
                    marginTop: Theme.spacing.sectionVerticalSpacing,
                  }}>
                  <HorizontalContainer>
                    <Button
                      disabled={this.state.currentQuestionIndex === 0}
                      text={translate('previous')}
                      arrow
                      back
                      onPress={() => {
                        this.prevQuestion();
                      }}
                    />
                    {this.state.currentQuestionIndex ===
                    this.state.questions.length - 1 ? (
                      this.state.currentQuestionGroupIndex <
                      this.props.mainStore.sessions.length - 1 ? (
                        <Button
                          text={
                            this.props.navigation.state.params &&
                            this.props.navigation.state.params.practice
                              ? translate('next_chapter')
                              : translate('finish')
                          }
                          arrow
                          Loading={this.state.nextPartLoading}
                          onPress={() => {
                            this.proceedToNextPart();
                          }}
                        />
                      ) : (
                        <Button
                          text={translate('finish')}
                          arrow
                          onPress={() => {
                            this.finishSession();
                          }}
                        />
                      )
                    ) : (
                      <Button
                        disabled={
                          this.state.currentQuestionIndex ===
                          this.state.questions.length - 1
                        }
                        text={translate('next_question')}
                        arrow
                        onPress={() => {
                          this.nextQuestion();
                        }}
                      />
                    )}
                  </HorizontalContainer>
                  <Button
                    text={translate('finish_test_exam')}
                    textButton
                    style={{
                      backgroundColor: 'red',
                    }}
                    onPress={() => {
                      this.showConfirmEndExam();
                    }}
                  />
                </View>
              </View>
            )}
          </ContentContainer>

          {!this.state.questionLoading && (
            <View
              style={{backgroundColor: Theme.palette.primaryDark, height: 100}}>
              <ScrollView horizontal>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingLeft: 20,
                  }}>
                  {this.state.questions.map((question, index) => (
                    <TouchableOpacity
                      style={{
                        backgroundColor:
                          this.state.currentQuestionIndex === index
                            ? '#000'
                            : Theme.palette.primaryLight,
                        width: 60,
                        height: 60,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 10,
                        marginRight: 10,
                      }}
                      onPress={() => {
                        //console.log("SELECTED QUESTION : ", thdis.state.questions[index])
                        this.setState({currentQuestionIndex: index});
                        this._scrollView.scrollTo(0);
                        this._scrollView.scrollTo({y: 0, animated: true});
                      }}>
                      <Text
                        bold
                        medium
                        white={this.state.currentQuestionIndex === index}>
                        {index + 1}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}
        </ScrollView>

        <Modal visible={this.state.drawingModal} animationType="slide">
          <SafeAreaView>
            <View style={styles.container}>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <RNSketchCanvas
                  containerStyle={{backgroundColor: 'transparent', flex: 1}}
                  canvasStyle={{backgroundColor: '#e7e7e7', flex: 1}}
                  defaultStrokeIndex={0}
                  defaultStrokeWidth={5}
                  closeComponent={
                    <View style={styles.functionButton}>
                      <Text style={{color: 'white'}}>Close</Text>
                    </View>
                  }
                  undoComponent={
                    <View style={styles.functionButton}>
                      <Text style={{color: 'white'}}>Undo</Text>
                    </View>
                  }
                  clearComponent={
                    <View style={styles.functionButton}>
                      <Text style={{color: 'white'}}>Clear</Text>
                    </View>
                  }
                  eraseComponent={
                    <View style={styles.functionButton}>
                      <Text style={{color: 'white'}}>Eraser</Text>
                    </View>
                  }
                  strokeComponent={(color) => (
                    <View
                      style={[
                        {backgroundColor: color},
                        styles.strokeColorButton,
                      ]}
                    />
                  )}
                  strokeSelectedComponent={(color, index, changed) => {
                    return (
                      <View
                        style={[
                          {backgroundColor: color, borderWidth: 2},
                          styles.strokeColorButton,
                        ]}
                      />
                    );
                  }}
                  strokeWidthComponent={(w) => {
                    return (
                      <View style={styles.strokeWidthButton}>
                        <View
                          style={{
                            backgroundColor: 'white',
                            marginHorizontal: 2.5,
                            width: Math.sqrt(w / 3) * 10,
                            height: Math.sqrt(w / 3) * 10,
                            borderRadius: (Math.sqrt(w / 3) * 10) / 2,
                          }}
                        />
                      </View>
                    );
                  }}
                  saveComponent={
                    <View style={styles.functionButton}>
                      <Text style={{color: 'white'}}>Save</Text>
                    </View>
                  }
                  savePreference={() => {
                    return {
                      folder: 'RNSketchCanvas',
                      filename: String(Math.ceil(Math.random() * 100000000)),
                      transparent: false,
                      imageType: 'png',
                    };
                  }}
                />
              </View>
            </View>
            <TouchableOpacity
              style={{
                width: 60,
                height: 60,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: '#a7a7a7',
                borderRadius: 5,
                marginTop: 10,
                position: 'absolute',
                right: 20,
                top: 50,
              }}
              onPress={() => {
                this.setState({drawingModal: false});
              }}>
              <Icon
                type="Ionicons"
                name="ios-close"
                style={{
                  color: '#a7a7a7',
                  fontSize: 30,
                }}
              />
            </TouchableOpacity>
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: deviceWidth,
    height: deviceHeight,
  },
  strokeColorButton: {
    marginHorizontal: 2.5,
    marginVertical: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  strokeWidthButton: {
    marginHorizontal: 2.5,
    marginTop: 100,
    marginBottom: 20,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#39579A',
  },
  functionButton: {
    marginHorizontal: 2.5,
    marginTop: 100,
    marginBottom: 20,
    height: 30,
    width: 60,
    backgroundColor: '#39579A',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
});
