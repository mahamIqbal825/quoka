
import React, { PureComponent } from 'react';

import {
  TouchableOpacity,
  View,
  Text as RNText,
  StyleSheet,
  ImageBackground,
  Modal,
  Image,
  ScrollView,
  Touchable
} from 'react-native';

import { Theme } from './Theme'
import { Input } from './Input'

import { ModalContainer } from './Containers'
import { Text } from './Text'
import { Dropdown } from './Dropdown'
import { Button } from './Button'
import { Loading } from './Loading'
import { translate } from '../../utils/localize'
import { toast } from '../../utils/toast'


import { observer, inject } from 'mobx-react'
import { Icon } from 'native-base';


@inject('mainStore', 'userStore')
@observer
class EditProfileModal extends PureComponent {


  state = {
    loading: false,
    selectedGrade: "",
    selectedLanguage: "",
    selectedMethod: "",
    name: this.props.userStore.userData.fullName ? this.props.userStore.userData.fullName : ""
  }

  componentDidMount() {
    //console.log("GRADES DATA : ", this.props.mainStore.grades)
  }


  async updateProfile() {
    const { name } = this.state
    const { onFinish } = this.props

    this.setState({ loading: true })
    let res = await this.props.userStore.updateUser({
      fullName: name,
      Roles: []
    })
    this.setState({ loading: false })


    if (res && res.error) {
      toast(res.message)
    } else {
      onFinish()
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

          <TouchableOpacity
            style={{
              width: 50,
              height: 50,
              alignSelf:'flex-end'
            }}
            onPress={()=>this.props.onFinish()}
          >
            <Icon
              type="Ionicons"
              name="close"
              style={{
              }}
            />
          </TouchableOpacity>


          <View style={{
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
          }}>
            <Image
              source={require('../../assets/images/user_placeholder.jpg')}
              style={{
                width: 90,
                height: 90,
                borderRadius: 50,
                marginBottom: 20
              }}
            />
            <TouchableOpacity
              style={{
                width: 50,
                height: 50,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#fff',
                marginTop: -30,
                borderRadius: 50
              }}
            >
              <Icon
                type="Feather"
                name="edit"
                style={{
                }}
              />
            </TouchableOpacity>

          </View>
          <Input
            style={{
              paddingLeft: 20,
              height: 50,
              marginBottom: 10,
              width: "100%"
            }}
            onChange={(value) => {
              this.setState({ name: value })
            }}
            value={this.state.name}
          />



          <Button
            gradient
            text={translate('update')}
            arrow
            width="50%"
            loading={this.state.loading}
            onPress={() => {
              this.updateProfile()
            }}
          />

        </ModalContainer>


      </Modal>
    )

  }

}
const styles = StyleSheet.create({


})

export { EditProfileModal };
