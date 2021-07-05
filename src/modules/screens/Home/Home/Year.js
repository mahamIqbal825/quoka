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
    ExamPapers,
    BackButton,
    ItemCard
} from '../../../components'

import { translate } from '../../../../utils/localize'

const deviceWidth = Dimensions.get('window').width
const deviceHeight = Dimensions.get('window').height

import { Icon, Item } from 'native-base'
import {inject, observer} from 'mobx-react'


@inject('userStore','mainStore')
@observer
export default class Year extends Component {

    componentDidMount(){

        if(this.props.navigation.state.params && this.props.navigation.state.params.examTypeId){
            this.props.mainStore.fetchExamTypeYears(this.props.navigation.state.params.examTypeId)

        }


    }

    async checkPurchase(yearId, name, study, examTypeName){

        let checkPurchase = await this.props.mainStore.checkPurchase(yearId, name, study, examTypeName, this.props.navigation)
        

    }

    _keyExtractor = (item,index) => `${item.id}_${index}`;
    

    render() {  
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar barStyle="dark-content" />
                <KeyboardAwareScrollView style={{ flex: 1 }}>
                    <ContentContainer>
                        <BackButton
                            onPress={()=> this.props.navigation.goBack() }
                        />
                        <HorizontalContainer >

                            <Text medium bold>
                                {
                                    this.props.navigation.state.params.name
                                }
                            </Text>
                            
                        </HorizontalContainer>

                        
                        {
                            this.props.mainStore.yearLoading ? (
                                <Loading
                                    height={100}
                                    quantity={["","",""]}
                                    radius={10}
                                    width={"100%"}
                                    containerMarginRight={0}
                                />
                            ):(
                                <FlatList
                                    data={this.props.mainStore.years}
                                    keyExtractor={this._keyExtractor}
                                    renderItem={({ item })=>(
                                        <ItemCard
                                            item={item}
                                            onPress={(yearId, name)=>{ 
                                                console.log("YEAR ID : ", yearId)
                                                console.log("examTypeName : ", this.props.navigation.state.params.name)

                                                if(this.props.navigation.state.params.name === "கடந்தகால வினாத்தாள்" && yearId === "454eed9a-d920-4ee3-a7f4-39f2ed679874"){
                                                    this.props.navigation.navigate("ExamPart",
                                                        { 
                                                            yearId,
                                                            name,
                                                            study: this.props.navigation.state.params.study,
                                                            examTypeName: this.props.navigation.state.params.name 
                                                        })
                                                }else{
                                                    this.checkPurchase(yearId,name,this.props.navigation.state.params.study, this.props.navigation.state.params.name)
                                                }

                                                
                                             }}
                                        />
                                    )}
                                />
                            )
                        }
                        

                        

                    </ContentContainer>



                </KeyboardAwareScrollView>

            </SafeAreaView>

        )

    }
}

const styles = StyleSheet.create({



})