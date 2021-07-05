import React, { Component } from 'react'
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native'

import { withNavigation } from 'react-navigation';

import { Icon } from 'native-base'

// DrawerActions is a specific type of navigation dispatcher
import { DrawerActions } from 'react-navigation-drawer';
import { inject, observer } from 'mobx-react'
import { translate } from '../../utils/localize';



@inject('userStore')
@observer
class DrawerToggle extends Component {
  render() {

    const { backButton } = this.props

    return (
      <View style={{  
        marginLeft: 50
      }}>
        <TouchableOpacity style={styles.trigger}
          onPress={() => {
            if (backButton) {
              this.props.navigation.goBack()
            } else {
              this.props.navigation.dispatch(DrawerActions.openDrawer())
            }

          }}
        >
          <Icon
            type="Feather"
            name="menu"
            style={{
              color: "#fff"
            }}
          />
        </TouchableOpacity>
        <Text style={{
          transform: [{ scaleX: -1 }],
          fontWeight: 'bold',
          color: "#fff",
          marginRight: 50,
        }}>
          {translate('hello')}, {`\n`}
          {
            this.props.userStore.userData.fullName.split(" ")[0]
          }
          </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  trigger: {
    width: 40,
    height: 40,
    marginLeft: 20,
    alignItems:'flex-start',
    justifyContent:'flex-start'
  }
});

export default withNavigation(DrawerToggle)