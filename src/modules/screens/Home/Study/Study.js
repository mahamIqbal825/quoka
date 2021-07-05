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
import YoutubePlayer from "react-native-youtube-iframe";
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
    ItemCard
} from '../../../components'

import { translate } from '../../../../utils/localize'

const deviceWidth = Dimensions.get('window').width
const deviceHeight = Dimensions.get('window').height

import { Icon } from 'native-base'
import {inject, observer} from 'mobx-react'


@inject('userStore','mainStore')
@observer
export default class Study extends Component {

    componentDidMount(){

        if(this.props.navigation.state.params && this.props.navigation.state.params.subjectId){
            this.props.mainStore.fetchSubjectChapters(this.props.navigation.state.params.subjectId)
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
                                {translate('study')}
                            </Text>
                            
                        </HorizontalContainer>
                        
                        <ExamPapers
                            item={{name: translate('past_paper_lbl')}}
                            onPress={(examTypeId, name)=>{ 
                                this.props.navigation.navigate("Year",{ examTypeId, name,study: true })

                            }}

                        />
                        <ExamPapers
                            item={{name: translate('practice_paper_lbl')}}
                            onPress={()=>{
                                
                            }}
                        />
                        

                        

                    </ContentContainer>



                </KeyboardAwareScrollView>

            </View>

        )

    }
}

const styles = StyleSheet.create({



})