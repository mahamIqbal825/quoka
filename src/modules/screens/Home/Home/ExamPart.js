import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Dimensions,
  StatusBar,
  View,
  TouchableOpacity,
  FlatList,
  Modal,
} from 'react-native';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';

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
} from '../../../components';

import {translate} from '../../../../utils/localize';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

import {Icon, Item} from 'native-base';
import {inject, observer} from 'mobx-react';

@inject('userStore', 'mainStore')
@observer
export default class ExamPart extends Component {
  componentDidMount() {
    if (
      this.props.navigation.state.params &&
      this.props.navigation.state.params.yearId
    ) {
      this.props.mainStore.fetchYearQuestionGroup(
        this.props.navigation.state.params.yearId,
      );
    }
  }

  state = {
    showConfirmationDialog: false,
    selectedPartQuestionNumber: '',
  };

  _keyExtractor = (item, index) => `${item.id}_${index}`;

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <StatusBar barStyle="dark-content" />
        <KeyboardAwareScrollView style={{flex: 1}}>
          <ContentContainer>
            <BackButton onPress={() => this.props.navigation.goBack()} />
            <HorizontalContainer>
              <Text medium bold>
                {this.props.navigation.state.params.name}
              </Text>
            </HorizontalContainer>

            {this.props.mainStore.questionGroupsLoading ? (
              <Loading
                height={100}
                quantity={['', '', '']}
                radius={10}
                width={'100%'}
                containerMarginRight={0}
              />
            ) : (
              <FlatList
                data={this.props.mainStore.questionGroups}
                keyExtractor={this._keyExtractor}
                renderItem={({item}) => (
                  <ItemCard
                    item={item}
                    onPress={(id, name, numberOfQuestions) => {
                      if (this.props.navigation.state.params.study) {
                        this.props.navigation.navigate('StudyQuestion', {
                          partId: id,
                        });
                      } else {
                        this.setState({
                          showConfirmationDialog: true,
                          selectedPart: id,
                          selectedPartName: name,
                          //  selectedPartQuestionNumber: numberOfQuestions.numberOfQuestions
                          //resulting some errror @minte
                        });
                      }
                    }}
                  />
                )}
              />
            )}
          </ContentContainer>

          <Modal
            transparent
            animated={true}
            animationType="slide"
            visible={this.state.showConfirmationDialog}>
            <ModalContainer>
              <Text bold medium>
                {translate('are_you_sure_start')}
              </Text>

              <View
                style={{
                  marginTop: Theme.spacing.sectionVerticalSpacing,
                }}>
                <Text small>{translate('confirm_start')}</Text>
              </View>

              <View
                style={{
                  marginTop: Theme.spacing.sectionVerticalSpacing,
                }}>
                <HorizontalContainer>
                  <Button
                    text={translate('no')}
                    arrow
                    loading={this.state.loading}
                    onPress={() => {
                      this.setState({showConfirmationDialog: false});
                    }}
                  />
                  <Button
                    text={translate('yes')}
                    arrow
                    loading={this.state.loading}
                    onPress={() => {
                      this.setState({showConfirmationDialog: false});
                      // console.log("QUESTION GROUPS : ", this.state.selectedPart)
                      var questionGroups = this.props.mainStore.questionGroups;
                      var selectedQuestionGroupData = questionGroups.filter(
                        (group) => group.id === this.state.selectedPart,
                      );

                      this.props.mainStore.createExamSession(
                        this.props.navigation.state.params.examTypeName,
                        this.props.mainStore.selectedSubjectName,
                        this.props.userStore.userData.id,
                      );

                      this.props.mainStore.setSession(
                        selectedQuestionGroupData,
                      );
                      this.props.navigation.navigate('Question', {
                        partId: this.state.selectedPart,
                        name: this.state.selectedPartName,
                        numberOfQuestions: this.state
                          .selectedPartQuestionNumber,
                      });
                    }}
                  />
                </HorizontalContainer>
              </View>
            </ModalContainer>
          </Modal>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({});
