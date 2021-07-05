
import { action, observable } from 'mobx';

import Auth from "../services/auth";
import User from "../services/user";

import {toast} from '../utils/toast'

import AsyncStorage from '@react-native-community/async-storage';
import { persist } from 'mobx-persist'

import _, { update } from 'lodash'
import { translate } from '../utils/localize';

export class UserStore {

    @persist @observable userToken = null
    @persist('object') @observable userData = null

    @persist('list') @observable userProfiles = []

    @observable userSessionLoading = false
    @persist('list') @observable userSessions = []

    @observable sessionStats = null

    @action setUserToken(token){
        this.userToken = token
    }
    @action setUserData(data){
        this.userData = data
    }
    @action setUserProfiles(data){
        this.userProfiles = data
    }

    @observable userSessionData = []

    @observable userWallet = 0

    @observable userTransactions = []



    @action setUserSessionData(value){
        this.userSessionData = value
    }   

    @action logout(navigation){

        if(this.userProfiles.length > 1){

            var userProfiles = this.userProfiles.filter((profile)=>profile.selected === false)

            this.userProfiles = userProfiles
            this.userProfiles[0] = { ...this.userProfiles[0],selected:true }
            this.userData = userProfiles[0]
            this.userToken = userProfiles[0].accessToken

            toast(translate('user_loggedout'))

        }else{
            this.userProfiles = []
            this.userData = []
            this.userToken = null
            navigation.navigate("Login")
        }

    }


    @action switchUserAccount(data){
        this.userProfiles = this.userProfiles.map((profile)=>{
            var existingProfiles = profile
            if(data.id !== profile.id){
                existingProfiles.selected = false
            }
            return existingProfiles
        })

        this.userData = data
        this.userToken = data.accessToken
    }

    @action async register(data) {
        try {
            let response = await Auth.register(data)
            //console.log('res : ', response)
            if(response.code === 400){
                return { error: true, message: "Phone Number already exists, try login instead" }
            }else if(response.code === 201 || response.code === 200){
                return {error: false, data: response}
            }else if(response.code === 422){
                return { error: true, message: response.message }
            }else{
                return { error: true, message: "Sorry something went wrong, please try again." }
            }
            
        } catch (e) {
            //console.log("NETWORK ERROR : ", e)
            return { error: true, message: "Sorry something went wrong, please try again." }
        }
    }


    @action async login(data) {

        try {
            let response = await Auth.login(data)
            console.log('res : ', response)
            if(response.code === 404){
                return { error: true, message: "User not found, please correct the info" }
            }else if(response && response.accessToken){
                return {error: false, data: response}
            }else if(response.code === 400){
                return { error: true, message: "Incorrect phone number or password" }
            }else{
                return { error: true, message: "Sorry something went wrong, please try again." }
            }
            
        } catch (e) {
            //console.log("NETWORK ERROR : ", e)
            return { error: true, message: "Sorry something went wrong, please try again." }
        }
    }

    @action async updateUser(data) {

        try {
            //console.log("data : ", data)
            let response = await User.updateUser(data, this.userData.id)
            console.log('update res : ', response)
            if(response.code === 200){
                console.log("USER PFOIELS : ", this.userProfiles);
                var newUserProfiles = []
                this.userProfiles.map((profile)=>{
                    var updateProfile = profile
                    if(updateProfile.id === response.data.id){
                        updateProfile = response.data
                    }
                    newUserProfiles.push(updateProfile)
                })

                this.userProfiles = newUserProfiles

                this.userData = response.data

                return { error: false}
            }else{
                return { error: true, message: "Sorry something went wrong, please try again." }
            }
            
        } catch (e) {
            //console.log("NETWORK ERROR : ", e)
            return { error: true, message: "Sorry something went wrong, please try again." }
        }
    }
    @action async getProfile(token, updateProfile = false) {

        try {
            let response = await User.getProfile(token)
            //console.log('GET PROFILE RESPONSE : ', response)
            if(response.code === 200){
                if(updateProfile){
                    this.setUserData(response.data)
                }
                return { error: false, data:response.data}
            }else{
                return { error: true, message: "Sorry something went wrong, please try again." }
            }
            
        } catch (e) {
            //console.log("NETWORK ERROR : ", e)
            return { error: true, message: "Sorry something went wrong, please try again." }
        }
    }


    @action async getUserSessions(){

        this.userSessionLoading = true
        let response = await User.getUserSession()
        this.userSessionLoading = false
        console.log('response : ', response.data);
        if(response.code === 200){

            this.userSessions = response.data

            return { error: false, data: response.data}
        }else{
            return { error: true, message: "Sorry something went wrong, please try again." }
        }


    }

    checkPassword(password) {
        var strength = 0;

        if (password.length < 6) {
            return 0
        }

        if (password.match(/[a-z]+/)) {
            strength += 1;
        }
        if (password.match(/[A-Z]+/)) {
            strength += 1;
        }
        if (password.match(/[0-9]+/)) {
            strength += 1;
        }
        if (password.match(/[$@#&!]+/)) {
            strength += 1;
        }
        return strength
    }


    @action async getWallet(){
        try {
            let response = await User.getUserWallet()
            //console.log('GET PROFILE RESPONSE : ', response)
            if(response.code === 200){
                console.log("response.data[0].balance", response.data[0].balance)
                this.userWallet = response.data[0]
            }
            
        } catch (e) {
            //console.log("NETWORK ERROR : ", e)
            return { error: true, message: "Sorry something went wrong, please try again." }
        }
    }

    @action async addWallet(amount){
        try {
            let data ={
                "balance": parseInt(amount),
                "type": "DEPOSIT"
            }
            let response = await User.addWallet(data,this.userWallet.id)
            console.log("ADD WALLET RESPONSE : ", response)
            if(response.code === 200){
                this.getWallet()
                this.getUserTransactions()
            }
            
        } catch (e) {
            //console.log("NETWORK ERROR : ", e)
            return { error: true, message: "Sorry something went wrong, please try again." }
        }
    }

    @action async getUserTransactions(){
        try {
            let response = await User.getUserTransactions()
            console.log('GET TRANSACTIONS : ', response)
            if(response.code === 200){
                this.userTransactions = _.orderBy(response.data, ['createdAt'], ['desc'])
            }
            
        } catch (e) {
            //console.log("NETWORK ERROR : ", e)
            return { error: true, message: "Sorry something went wrong, please try again." }
        }
    }


}

export const userStore = new UserStore();