import {action, observable} from 'mobx';

import Main from '../services/main';

import AsyncStorage from '@react-native-community/async-storage';

import {persist} from 'mobx-persist';

import _ from 'lodash';
import User from '../services/user';
import {translate} from '../utils/localize';
import {userStore, UserStore} from './UserStore';

export class MainStore {
  @persist('list') @observable grades = [];
  @observable gradesLoading = false;

  @persist('list') @observable subjects = [];
  @observable subjectsLoading = false;

  @persist @observable selectedSubject = '';

  @persist @observable selectedSubjectName = '';

  @persist('list') @observable examTypes = [];
  @persist('object') @observable cachedExamTypes = {};
  @observable examTypesLoading = false;

  @persist('list') @observable years = [];
  @observable yearLoading = false;

  @persist('list') @observable questionGroups = [];
  @observable questionGroupsLoading = false;

  @persist('list') @observable questions = [];
  @observable questionLoading = false;

  @persist('list') @observable notifications = [];
  @observable notificationsLoading = false;

  @observable sessions = {};

  @persist('list') @observable chapters = [];
  @observable chaptersLoading = false;

  @action setSession(value) {
    this.sessions = value;
  }

  @observable userWallet = 0;

  @observable pricingPackages = [];

  @action setSelectedSubject(value, name) {
    //console.log("SET VALUE : ", value)
    this.selectedSubject = value;
    this.selectedSubjectName = name;
  }

  @observable serverExamSessionId = '';

  @action setServerExamSessionId(value) {
    this.serverExamSessionId = value;
  }
  @action async getAllGrades() {
    this.gradesLoading = true;
    let res = await Main.getAllGrades();
    this.gradesLoading = false;
    if (res && res.code === 200) {
      //console.log(" grades res : ", res)
      this.grades = res.data;
    }
  }

  @action getFormattedGradeData(grades) {
    var formattedGrades = [];

    this.grades.map((grade) => {
      formattedGrades.push({label: grade.name, value: grade.id});
    });
    //console.log("Formatted grade data : ", formattedGrades)
    return formattedGrades;
  }
  @action getFormattedSubjectData() {
    var formattedSubjects = [];

    this.subjects.map((subject) => {
      formattedSubjects.push({
        label: subject.name,
        value: `${subject.id}#${subject.name}`,
      });
    });
    return formattedSubjects;
  }

  @action async fetchGradeSubjects(grade) {
    if (grade) {
      this.subjectsLoading = true;
      let res = await Main.getGrade(grade);
      this.subjectsLoading = false;
      if (res && res.code === 200) {
        this.subjects = res.data.Subjects;
      }
      //console.log("res : ", res)
    }
  }

  @action async fetchSubjectExamTypes(subjectId) {
    //console.log("cached exam types : ", this.cachedExamTypes)
    // var cache = false
    // if(this.cachedExamTypes[`${subjectId}`] && this.cachedExamTypes[`${subjectId}`].length > 0){
    //     this.examTypes = this.cachedExamTypes[`${subjectId}`]
    //     cache = true
    // }else{
    //     this.examTypesLoading = true
    // }
    let res = await Main.getSubject(subjectId);
    //console.log("exam type res : ", res)
    this.examTypesLoading = false;
    if (res && res.code === 200) {
      this.examTypes = res.data.ExamTypes;
      // if(res.data.ExamTypes && res.data.ExamTypes.length > 0){
      //     this.cachedExamTypes[`${subjectId}`] = res.data.ExamTypes
      // }
    }
    // else{
    //     if(!cache){
    //         this.examTypes = []
    //     }
    // }
  }

  @action async fetchExamTypeYears(examTypeId) {
    this.yearLoading = true;
    let res = await Main.getExamType(examTypeId);
    this.yearLoading = false;
    if (res && res.code === 200) {
      this.years = res.data.Years.sort((a, b) => b.name - a.name);
    }
  }
  @action async fetchYearQuestionGroup(yearId) {
    this.questionGroupsLoading = true;
    let res = await Main.getYear(yearId);
    this.questionGroupsLoading = false;
    if (res && res.code === 200) {
      this.questionGroups = _.orderBy(
        res.data.QuestionGroups,
        ['createdAt'],
        ['asc'],
      );
    }
  }

  @action async fetchQuestionGroupQuestion(partId) {
    //console.log("part id : ", partId)
    this.questionLoading = true;
    let res = await Main.getQuestionGroup(partId);
    console.log('QUETION GROUP RES : ', res);
    this.questionLoading = false;
    if (res && res.code === 200) {
      this.question = res.data.Questions;
      return res.data.Questions;
    }
  }

  @action async fetchChapterQuestion(chapterId) {
    //console.log("part id : ", chapterId)
    this.questionLoading = true;
    let res = await Main.getChapter(chapterId);
    //console.log("QUETION GROUP RES : ", res)
    this.questionLoading = false;
    if (res && res.code === 200) {
      this.question = res.data.Questions;
      return res.data.Questions;
    }
  }

  prepareQuestionData(
    questions,
    allowChildQuestions = false,
    userAnswer = null,
  ) {
    console.log('QUESTIONS : ', questions);
    var formattedQuestions = [];
    questions.map((question) => {
      if (allowChildQuestions || question.parentId == null) {
        var questionObj = {};

        if (question.questionType === 'context') {
          question.SubQuestions.map((subQuestion) => {
            questionObj = {
              parentQuestion: question,
              title: subQuestion.title,
              questionId: subQuestion.id,
              context: subQuestion.description,
              type: subQuestion.questionType,
              serialNumber: subQuestion.serialNumber,
              answer: subQuestion.Answers,
              subQuestions: subQuestion.SubQuestions,
              timeTaken: 0,
              parentId: subQuestion.parentId,
              result: null,
              images: subQuestion.Images,
              createdAt: subQuestion.createdAt,
              categories: subQuestion.Categories,
              chapter: subQuestion.Chapter,
              userAnswer: null,
              mark: subQuestion.mark,
              userMark: 0,
              studyMaterials: subQuestion.StudyMaterials
                ? subQuestion.StudyMaterials.reverse()
                : [],
              questionGroup: subQuestion.QuestionGroup,
              year: subQuestion.QuestionGroup && subQuestion.QuestionGroup.Year,
              examType:
                subQuestion.QuestionGroup &&
                subQuestion.QuestionGroup.Year &&
                subQuestion.QuestionGroup.Year.ExamType,
              subject:
                subQuestion.QuestionGroup &&
                subQuestion.QuestionGroup.Year &&
                subQuestion.QuestionGroup.Year.ExamType &&
                subQuestion.QuestionGroup.Year.ExamType.Subject,
            };
            if (question.questionType === 'true or false') {
              questionObj.choices = [
                {
                  choice: 'True',
                  selected: false,
                },
                {
                  choice: 'False',
                  selected: false,
                },
              ];
            } else if (question.questionType === 'mcq') {
              questionObj.choices = _.orderBy(
                question.Choices,
                ['letter'],
                ['asc'],
              );
            }

            formattedQuestions.push(questionObj);
          });
        } else {
          questionObj = {
            title: question.title,
            context: question.description,
            type: question.questionType,
            serialNumber: question.serialNumber,
            answer: question.Answers,
            subQuestions: question.SubQuestions,
            timeTaken: 0,
            questionId: question.id,
            result: null,
            images: question.Images,
            parentId: question.parentId,
            createdAt: question.createdAt,
            categories: question.Categories,
            chapter: question.Chapter,
            userAnswer: userAnswer ? JSON.parse(userAnswer) : null,
            mark: question.mark,
            userMark: 0,
            studyMaterials: question.StudyMaterials
              ? question.StudyMaterials.reverse()
              : [],
            questionGroup: question.QuestionGroup,
            year: question.QuestionGroup && question.QuestionGroup.Year,
            examType:
              question.QuestionGroup &&
              question.QuestionGroup.Year &&
              question.QuestionGroup.Year.ExamType,
            subject:
              question.QuestionGroup &&
              question.QuestionGroup.Year &&
              question.QuestionGroup.Year.ExamType &&
              question.QuestionGroup.Year.ExamType.Subject,
          };
          if (question.questionType === 'true or false') {
            questionObj.choices = [
              {
                choice: 'True',
                selected: false,
              },
              {
                choice: 'False',
                selected: false,
              },
            ];
          } else if (question.questionType === 'mcq') {
            questionObj.choices = _.orderBy(
              question.Choices,
              ['letter'],
              ['asc'],
            );
          }

          formattedQuestions.push(questionObj);
        }
      }
    });

    return _.orderBy(formattedQuestions, ['createdAt'], ['asc']);
  }

  @action async getUserNotifications(partId) {
    this.notifications = true;
    let res = await Main.getUserNotification();
    //console.log("USER NOTIFICATIONS : ", res)
    this.notifications = false;
    if (res && res.code === 200) {
      this.notifications = res.data.data;
    }
  }

  @action async fetchSubjectChapters(subjectId) {
    this.chaptersLoading = true;
    let res = await Main.getSubject(subjectId);
    //console.log('subject res : ', res)
    this.chaptersLoading = false;
    if (res && res.code === 200) {
      this.chapters = res.data.Chapters;
    }
  }

  @action async fetchQuestionGroupQuestion(partId) {
    //console.log("part id : ", partId)
    this.questionLoading = true;
    let res = await Main.getQuestionGroup(partId);
    console.log('QUETION GROUP RES : ', res);
    this.questionLoading = false;
    if (res && res.code === 200) {
      this.question = res.data.Questions;
      return res.data;
    }
  }
  @action async saveUserSession(mark, examType, subject, userId) {
    console.log('Mark : ', mark);
    console.log('Exam Type : ', examType);
    console.log('Subject : ', subject);
    console.log('User Id : ', userId);

    let sessionData = {
      examType,
      mark,
      subject,
      sessionData: JSON.stringify(this.sessions),
      userId,
    };

    let res = await Main.saveUserSession(sessionData);

    console.log('save session data res: ', res);
  }

  @action async createExamSession(examType, subject, userId) {
    let sessionData = {
      examType,
      subject,
      userId,
    };

    let res = await Main.saveUserSession(sessionData);

    console.log('SET SESSION res :', res);

    if ((res && res.code === 201) || res.code === 200) {
      console.log('SET SESSION IF :', res.data.id);
      this.serverExamSessionId = res.data.id;
    }
    console.log('save session data res: ', res);
  }

  @action async storeUserAnswer(data) {
    let res = await Main.storeUserAnswer(data);
    console.log('Store user answer res: ', res);
  }

  @action async updateExamSession(data) {
    let res = await Main.updateExamSession(data);
    console.log('Update exam session===: ', res);
  }

  @action checkIfQuestionAnswerIsCorrect(question) {
    console.log('SEE QUESTION : ', question);

    if (question.type === 'mcq') {
      if (
        question.answer &&
        question.answer[0] &&
        question.answer.length > 0 &&
        question.answer[0].answer ===
          (question.userAnswer && question.userAnswer.letter)
      ) {
        return {correct: true, mark: question.mark};
      } else {
        return {correct: false, mark: 0};
      }
    } else if (question.type === 'true or false') {
      if (
        question.answer &&
        question.answer.length > 0 &&
        question.answer[0].answer ===
          (question.userAnswer && question.userAnswer.choice)
      ) {
        return {correct: true, mark: question.mark};
      } else {
        return {correct: false, mark: 0};
      }
    } else if (question.type === 'short answer') {
      if (
        question.answer &&
        question.answer.length > 0 &&
        question.answer[0].answer.toLowerCase() ===
          (question.userAnswer && question.userAnswer.answer.toLowerCase())
      ) {
        return {correct: true, mark: question.mark};
      } else {
        return {correct: false, mark: 0};
      }
    } else if (question.type === 'fill in the blank') {
      if (!question.userAnswer) {
        return {correct: false, mark: 0};
      } else {
        if (question.answer.length !== question.userAnswer.length) {
          return {correct: false, mark: 0};
        } else {
          var answers = question.answer.map((ans) => ans.answer);
          var mark = 0;
          answers.map((ans, index) => {
            if (ans.toLowerCase() === question.userAnswer[index]) {
              mark += 1;
            }
          });
          if (mark > 0) {
            return {correct: true, mark: mark};
          } else {
            return {correct: false, mark: 0};
          }
        }
      }
      // return true
    } else if (question.type === 'matching') {
      const answers = JSON.parse(question.context).answer;
      var mark = 0;
      if (!question.userAnswer || question.userAnswer.length === 0) {
        return {correct: false, mark: 0};
      } else {
        answers.map((answers, index) => {
          if (
            answers.toLowerCase() ===
            (question.userAnswer[index]
              ? question.userAnswer[index].toLowerCase()
              : '')
          ) {
            mark += 1;
          }
        });
      }
      if (mark > 0) {
        return {correct: true, mark: mark};
      } else {
        return {correct: false, mark: 0};
      }
    }
    //  else if (question.type === 'essay') {
    //   if (
    //     question.answer &&
    //     question.answer[0].answer ===
    //       (question.userAnswer && question.userAnswer.choice)
    //   ) {
    //     return {correct: true, mark: question.mark};
    //   } else {
    //     return {correct: false, mark: 0};
    //   }
    // }
  }
  @action async fetchPricingPackages() {
    console.log('FETCH PRICING PACKAGES');

    let res = await Main.getPricingPackages();

    console.log('pricingPackages store', res);
    if (res && res.code === 200) {
      this.pricingPackages = res.data;
    }
  }

  @action async getWallet() {
    try {
      let response = await User.getUserWallet();
      //console.log('GET PROFILE RESPONSE : ', response)
      if (response.code === 200) {
        this.userWallet = response.data[0];
      }
    } catch (e) {
      //console.log("NETWORK ERROR : ", e)
      return {
        error: true,
        message: 'Sorry something went wrong, please try again.',
      };
    }
  }

  @action async puchasePackage(pa, userId) {
    await this.getWallet();

    var subjects = JSON.parse(pa.subjects);
    var subjectIds = [];
    subjects.map((sub) => {
      subjectIds.push(sub.id);
    });

    let data = {
      price: parseInt(pa.price),
      userId: userId,
      type: 'WITHDRAW',
      walletId: this.userWallet.id,
      subjects: JSON.stringify(subjectIds),
    };

    console.log('PURCHASE DATA : ', data);

    let response = await Main.purchasePackage(data);
    if (response && response.code === 201) {
      alert('Content Purchased');
    }
    console.log('RESPONSE PURCHASE : ', response);
  }

  @action async setTimer(time, key) {
    try {
      var timer = await AsyncStorage.getItem(key);
      console.log('TIMER : ', timer);
      if (timer) {
        var currentTime = parseInt(timer);
        var newTime = currentTime + time;
        await AsyncStorage.setItem(key, '' + newTime);
      } else {
        await AsyncStorage.setItem(key, '' + time);
      }
    } catch (e) {
      console.log('ASYNC ERROR : ', e);
    }
  }
  @action async getTimer(key) {
    try {
      var timer = await AsyncStorage.getItem(key);
      return timer;
    } catch (e) {
      return null;
    }
  }

  @action parseMillisecondsIntoReadableTime(milliseconds) {
    //Get hours from milliseconds
    var hours = milliseconds / (1000 * 60 * 60);
    var absoluteHours = Math.floor(hours);
    var h = absoluteHours > 9 ? absoluteHours : '0' + absoluteHours;

    //Get remainder from hours and convert to minutes
    var minutes = (hours - absoluteHours) * 60;
    var absoluteMinutes = Math.floor(minutes);
    var m = absoluteMinutes > 9 ? absoluteMinutes : '0' + absoluteMinutes;

    //Get remainder from minutes and convert to seconds
    var seconds = (minutes - absoluteMinutes) * 60;
    var absoluteSeconds = Math.floor(seconds);
    var s = absoluteSeconds > 9 ? absoluteSeconds : '0' + absoluteSeconds;

    return h + ':' + m + ':' + s;
  }

  @action async getSavedLanguage() {
    var selectedLanguage = 'en';
    try {
      var lang = await AsyncStorage.getItem('language');
      if (lang) {
        selectedLanguage = await AsyncStorage.getItem('language');
      }
    } catch (e) {
      console.log('ASYNC ERROR : ', e);
    }
    return selectedLanguage;
  }

  @action async saveLanguage(language) {
    await AsyncStorage.setItem('language', language);
  }

  @action async checkPurchase(yearId, name, study, examTypeName, navigation) {
    try {
      var data = {
        subjectId: this.selectedSubject,
      };
      let response = await User.checkPurchase(data);
      console.log(
        'CHECK PURCHASE RESPONSE : ',
        response.data.purchaseAvailable,
      );
      if (response.code === 200 || response.code === 201) {
        if (response.data.purchaseAvailable) {
        console.log('HERE');
        navigation.navigate('ExamPart', {
          yearId,
          name,
          study,
          examTypeName,
        });
        } else {
          alert(translate('no_purchase_error'));
        }
      }
    } catch (e) {
      //console.log("NETWORK ERROR : ", e)
      return {
        error: true,
        message: 'Sorry something went wrong, please try again.',
      };
    }
  }

  @action async checkQrCode(data) {
    try {
      let response = await Main.getQrCode(data);
      console.log('QR RESPONSE : ', response);
      if (response.code === 200 || response.code === 201) {
        var coupon = response.data;
        if (coupon.status === 'Active') {
          userStore.addWallet(coupon.amount);
        } else {
          alert('Sorry, this ticket is not longer active');
        }
      }
    } catch (e) {
      //console.log("NETWORK ERROR : ", e)
      return {
        error: true,
        message: 'Sorry something went wrong, please try again.',
      };
    }
  }
}
export const mainStore = new MainStore();
