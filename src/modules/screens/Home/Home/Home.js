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
} from 'react-native';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import LinearGradient from 'react-native-linear-gradient';
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
  NewSignupModal,
  ComingSoonModal,
} from '../../../components';

import {setI18nConfig, translate} from '../../../../utils/localize';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

import {Icon} from 'native-base';
import {inject, observer} from 'mobx-react';

const appModes = [
  {
    image: require('../../../../assets/images/exam_mode.png'),
    screen: 'ExamTypes',
    type: 'exam',
  },
  {
    image: require('../../../../assets/images/study_mode.png'),
    screen: 'Study',
    type: 'study',
  },
  {
    image: require('../../../../assets/images/practical_mode.png'),
    screen: 'Practical',
    type: 'analytics',
  },
  {
    image: require('../../../../assets/images/practice_mode.png'),
    screen: 'Practice',
    type: 'practice',
  },
  {
    image: require('../../../../assets/images/analytics_mode.png'),
    screen: 'Analytics',
    type: 'analytics',
  },
  {
    image: require('../../../../assets/images/classroom_mode.png'),
    screen: 'ClassRoom',
    type: 'analytics',
  },
];

@inject('userStore', 'mainStore')
@observer
export default class Home extends Component {
  state = {
    selectedSubject: '',
    selectedSubjectName: '',
    onBoardingModal: false,
    comingSoonModal: false,
  };

  componentDidMount() {
    this.props.mainStore.fetchPricingPackages();

    console.log('USER DATA : ', this.props.userStore.userData);
    console.log('SAVED PROFILES : ', this.props.userStore.userProfiles);

    if (this.props.userStore.userData.grade) {
      this.props.mainStore.fetchGradeSubjects(
        this.props.userStore.userData.grade,
      );
    } else {
      // this.setState({ onBoardingModal: true })
      this.props.mainStore.getAllGrades();
    }
  }

  checkSubjectAndNavigate(route, type) {  
    // if (this.props.mainStore.selectedSubject === '') {
    //   toast(translate('select_subject'));
    // } else {
      //console.log("ROUTE : ", route);
    if (route === 'Practical' || route === 'ClassRoom') {
      this.setState({comingSoonModal: true});
    } else if (this.props.mainStore.selectedSubject !== '') {
      this.props.navigation.navigate(route, {
        type,
        subjectId: this.props.mainStore.selectedSubject,
      });
    } else {
      toast(translate('select_subject'));
    }
  }

  _keyExtractor = (item, index) => `${item.id}_${index}`;

  render() {
    return (
      <View style={{flex: 1}}>
        <StatusBar barStyle="dark-content" />
        <KeyboardAwareScrollView style={{flex: 1}}>
          <HeaderShape left></HeaderShape>

          <ContentContainer>
            <HorizontalContainer>
              <Text large bold>
                {translate('home')}
              </Text>
              <View style={{alignItems: 'flex-end'}}>
                <Text small>{translate('select_subject_lbl')}</Text>
                {this.props.mainStore.subjectLoading ? (
                  <Loading
                    height={50}
                    quantity={['']}
                    radius={3}
                    width={200}
                    containerMarginRight={0}
                  />
                ) : (
                  <Dropdown
                    noMarginTop
                    placeholder={translate('select_lbl')}
                    data={this.props.mainStore.getFormattedSubjectData(
                      this.props.mainStore.subjects,
                    )}
                    onChange={(value) => {
                      var subjectData = value ? value.split('#') : '';
                      value
                        ? this.props.mainStore.setSelectedSubject(
                            subjectData[0],
                            subjectData[1],
                          )
                        : this.props.mainStore.setSelectedSubject('');
                    }}
                    // value={this.props.mainStore.selectedSubject}
                  />
                )}
              </View>
            </HorizontalContainer>

            <FlatList
              data={appModes}
              numColumns={2}
              keyExtractor={this._keyExtractor}
              renderItem={({item}) => (
                <AppModes
                  item={item}
                  onPress={(screen, type) => {
                    this.checkSubjectAndNavigate(screen, type);
                  }}
                />
              )}
            />

            <Text large bold>
              {translate('shop_lbl')}
            </Text>

            {this.props.mainStore.pricingPackages
              .filter(
                (pc) => pc.gradeId === this.props.userStore.userData.grade,
              )
              .map((pa) => (
                <TouchableOpacity
                  style={{
                    width: '100%',
                    marginBottom: 15,
                  }}
                  onPress={() => {
                    this.props.mainStore.puchasePackage(
                      pa,
                      this.props.userStore.userData.id,
                    );
                  }}>
                  <LinearGradient
                    colors={[Theme.palette.primary, Theme.palette.primaryDark]}
                    // start={{x:0, y:1}}
                    // end={{x:1, y:0}}
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingVertical: 13,
                      borderRadius: 10,
                      width: '100%',
                      paddingHorizontal: 20,
                    }}>
                    <View>
                      <Text bold white>
                        {' '}
                        {pa.title}{' '}
                      </Text>
                      <Text small white>
                        {' '}
                        {JSON.parse(pa.subjects).length} Subjects{' '}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 100,
                        backgroundColor: Theme.palette.darkGray,
                        paddingHorizontal: 15,
                        paddingVertical: 5,
                      }}
                      onPress={() => {
                        this.props.mainStore.puchasePackage(
                          pa,
                          this.props.userStore.userData.id,
                        );
                      }}>
                      <Text white small>
                        Purchase
                      </Text>
                    </TouchableOpacity>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
          </ContentContainer>

          <NewSignupModal
            visible={this.state.onBoardingModal}
            navigation={this.props.navigation}
            onFinish={() => this.setState({onBoardingModal: false})}
          />

          <ComingSoonModal
            visible={this.state.comingSoonModal}
            onFinish={() => this.setState({comingSoonModal: false})}
          />
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({});
