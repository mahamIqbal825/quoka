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
    ExamPapers
} from '../../../components'

import { translate } from '../../../../utils/localize'

const deviceWidth = Dimensions.get('window').width
const deviceHeight = Dimensions.get('window').height

import { Icon } from 'native-base'
import {inject, observer} from 'mobx-react'


@inject('userStore','mainStore')
@observer
export default class ExamTypes extends Component {

    componentDidMount(){

        if(this.props.navigation.state.params && this.props.navigation.state.params.subjectId){
            this.props.mainStore.fetchSubjectExamTypes(this.props.navigation.state.params.subjectId)

        }


    }

    

    _keyExtractor = (item,index) => `${item.id}_${index}`;
    

    render() {  
        return (
            <View style={{ flex: 1 }}>
                <StatusBar barStyle="dark-content" />
                <KeyboardAwareScrollView style={{ flex: 1 }}>

                    <HeaderShape left>
                    </HeaderShape>

                    <ContentContainer>

                        <HorizontalContainer >

                            <Text large bold>
                                {
                                this.props.navigation.state.params && this.props.navigation.state.params.type === "study" ?
                                translate('study')
                                :translate('exam_lbl')}
                            </Text>
                            
                        </HorizontalContainer>
                        
                        {
                            this.props.mainStore.examTypesLoading ? (
                                <Loading
                                    height={310}
                                    quantity={["","",""]}
                                    radius={10}
                                    width={"90%"}
                                    containerMarginRight={0}
                                />
                            ):(
                                <FlatList
                                    data={this.props.mainStore.examTypes}

                                    keyExtractor={this._keyExtractor}
                                    renderItem={({ item })=>(
                                        <ExamPapers
                                            item={item}
                                            onPress={(examTypeId, name)=>{ 

                                                this.props.navigation.navigate("Year",{ examTypeId, name })

                                            }}
                                        />
                                    )}
                                />
                            )
                        }
                        

                        

                    </ContentContainer>



                </KeyboardAwareScrollView>

            </View>

        )

    }
}

const styles = StyleSheet.create({



})