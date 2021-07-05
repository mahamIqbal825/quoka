
import React, { PureComponent } from 'react';

import {
  TouchableOpacity,
  View,
  Text as RNText,
  StyleSheet,
  ImageBackground,
  Modal,
  Image,
  ScrollView
} from 'react-native';

import { Theme } from './Theme'
import { ModalContainer } from './Containers'
import { Text } from './Text'
import { Dropdown } from './Dropdown'
import { Button } from './Button'
import { Loading } from './Loading'
import { setI18nConfig, translate } from '../../utils/localize'
import { toast } from '../../utils/toast'


import { observer, inject } from 'mobx-react'


@inject('mainStore', 'userStore')
@observer
class NewSignupModal extends PureComponent {


  state = {
    loading: false,
    selectedGrade: "",
    selectedLanguage: "",
    selectedMethod: ""
  }

  componentDidMount() {
    //console.log("GRADES DATA : ", this.props.mainStore.grades)
  }


  async updateUserPreference() {
    const { selectedGrade, selectedLanguage } = this.state
    const { onFinish } = this.props
    if (selectedGrade === "") {

      toast(translate('grade_error'))
    } else {
      if (selectedLanguage === "") {
        toast(translate('language_error'))
      } else {
        this.setState({ loading: true })
        console.log("selectedLanguage", selectedLanguage)




        let res = await this.props.userStore.updateUser({
          language: selectedLanguage,
          grade: selectedGrade,
          Roles: []
        })
        this.setState({ loading: false })


        if (res && res.error) {
          toast(res.message)
        } else {
          this.props.mainStore.fetchGradeSubjects(selectedGrade)
          //console.log("On FINISH : ", onFinish)
          if (onFinish) { onFinish() }

          setI18nConfig(selectedLanguage)
          this.forceUpdate()
          this.props.mainStore.saveLanguage(selectedLanguage)
          this.props.navigation.push("Home")
        }

      }
    }


  }


  render() {

    const { visible } = this.props

    return (
      <Modal
        animated={true}
        visible={visible}
        animationType="slide"
        transparent={true}
      >

        <ModalContainer>

          <Image

            source={require('../../assets/images/welcome_image.jpg')}
            style={{
              width: 200,
              height: 150,
              alignSelf: 'center'
            }}

          />
          <View style={{ marginTop: Theme.spacing.sectionVerticalSpacing }}>
            <Text bold medium>
              {`${translate('hello')}${this.props.userStore.userData && this.props.userStore.userData.fullName && this.props.userStore.userData.fullName.split(" ")[0]}`}
            </Text>

            <View style={{ marginTop: Theme.spacing.sectionVerticalSpacing }}>
              <Text small>
                {
                  translate('what_grade_are_you')
                }
              </Text>
              {
                this.props.mainStore.gradeLoading ? (
                  <Loading
                    height={50}
                    quantity={[""]}
                    radius={3}

                  />
                ) : (
                  <Dropdown
                    data={this.props.mainStore.getFormattedGradeData(this.props.mainStore.grades)}
                    onChange={(value) => this.setState({ selectedGrade: value })}
                  />
                )
              }

              <Text small>
                {
                  translate('choose_language')
                }
              </Text>
              <Dropdown
                data={[
                  { label: "English", value: 'en' },
                  { label: "தமிழ்", value: 'ta' },
                  { label: "සිංහල", value: 'si' },

                ]}
                onChange={(value) => this.setState({ selectedLanguage: value })}

              />

              <Text small>
                {
                  translate('how_did_hear')
                }
              </Text>
              <Dropdown

                data={[
                  { label: "Social Media", value: 'Social Media' },
                  { label: "TV", value: 'TV' },
                  { label: "Radio", value: 'Radio' },
                  { label: "Word of mouth", value: 'Word of mouth' },
                  { label: "Banners", value: 'Banners' },
                  { label: "Search Engine", value: 'Search Engine' },
                ]}
                onChange={(value) => this.setState({ selectedMethod: value })}
              />

              <Text small>
                {
                  translate('country')
                }
              </Text>
              <Dropdown

                data={[
                  { label: "Srilanka", value: 'sri' },
                  { label: "India", value: 'ind' },
                  { label: "Pakistan", value: 'pak' },

                ]}
                onChange={(value) => this.setState({ selectedMethod: value })}
              />


              <Text small>
                {
                  translate('medium')
                }
              </Text>
              <Dropdown

                data={[
                  { label: "abc", value: 'abc' },
                ]}
                onChange={(value) => this.setState({ selectedMethod: value })}
              />


              <Text small>
                {
                  translate('institude')
                }
              </Text>
              <Dropdown

                data={[
                  { label: "abc", value: 'abc' },
                ]}
                onChange={(value) => this.setState({ selectedMethod: value })}
              />

              <View style={{
                width: "70%",
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
                marginTop: Theme.spacing.sectionVerticalSpacing
              }}>

              </View>
              <Button
                gradient
                text={translate('continue_proceed')}
                arrow
                width="50%"
                loading={this.state.loading}
                onPress={() => {
                  this.updateUserPreference()
                }}
              />


            </View>


          </View>



        </ModalContainer>


      </Modal>
    )

  }

}
const styles = StyleSheet.create({


})

export { NewSignupModal };
