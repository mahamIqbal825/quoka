// @flow
import config from "./config";

import { stores } from '../mobx/'
export default {
    async headers() {
        return await {
            Accept: "application/json",
            "Content-Type": "application/json"
        };
    },
    async post(url, data) {
        return fetch(`${config.BASE_URL}${url}`, {
            method: "POST",
            headers: {
            Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${stores.userStore.userToken}`
        },
            body: JSON.stringify(data)
        });
    },
    async postMultiPartForm(url, data) {
        return fetch(`${config.BASE_URL}${url}`, {
            method: "POST",
            headers: {
            Accept: "application/json",
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${stores.userStore.userToken}`
        },
            body: data
        });
    },
    async get(url, data) {
        //alert(`${config.BASE_URL}${url}`)
        // 
        return fetch(`${config.BASE_URL}${url}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${stores.userStore.userToken}`
            },
        });
    },
    async patch(url, data) {

        return fetch(`${config.BASE_URL}${url}`, {
            method: "PATCH",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${stores.userStore.userToken}`
            },
            body: JSON.stringify(data)
        });;
    },
    async put(url, data) {

        return fetch(`${config.BASE_URL}${url}`, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${stores.userStore.userToken}`
            },
            body: JSON.stringify(data)
        });;
    },
    async getAllGrades(){
        try {
            const res = await this.get('grade');
            return res.json();
        } catch (error) {
            
        }
    },
    async getGrade(id){
        try {
            const res = await this.get(`grade/${id}`);
            return res.json();
        } catch (error) {
            
        }
    },
    async getSubject(id){
        try {
            const res = await this.get(`subject/${id}`);
            return res.json();
        } catch (error) {
            
        }
    },
    async getExamType(id){
        try {
            const res = await this.get(`examType/${id}`);
            return res.json();
        } catch (error) {
            
        }
    },
    async getYear(id){
        try {
            const res = await this.get(`year/${id}`);
            return res.json();
        } catch (error) {
            
        }
    },
    async getQuestionGroup(id){
        try {
            const res = await this.get(`questionGroup/${id}`);
            console.log("QUESTION GROUP RES:  ", res)
            return res.json();
        } catch (error) {
            
        }
    },
    async getChapter(id){
        try {
            const res = await this.get(`chapter/${id}`);
            return res.json();
        } catch (error) {
            
        }
    },
    async getUserNotification(){
        try {
            const res = await this.get(`userNotification`);
            return res.json();
        } catch (error) {
            
        }
    },
    async saveUserSession(data){
        try {
            const res = await this.post(`session`,data);
            console.log("save session res : ", res)
            return res.json();
        } catch (error) {
            
        }
    },
    async storeUserAnswer(data){
        try {
            const res = await this.post(`studentAnswer`,data);
            console.log("save session res : ", res)
            return res.json();
        } catch (error) {
            
        }
    },
    async updateExamSession(data){
        try {
            const res = await this.put(`session/${data.id}`,data);
            console.log("update exam session : ", res)
            return res.json();
        } catch (error) {
            console.log("UPDATE EXAM SESISON EROR : ", error)
        }
    },
    async getPricingPackages(){
        try {

            const res = await this.get(`pricingPackages`);
            console.log("PRICING PACKAGE RES : ", res)
            return res.json();
        } catch (error) {
            console.log("pricingPackages EROR : ", error)
        }
    },
    async purchasePackage(data){
        try {
            const res = await this.post(`purchase`,data);
            console.log("PRICING PACKAGE RES : ", res)
            return res.json();
        } catch (error) {
            console.log("pricingPackages EROR : ", error)
        }
    },
    async getQrCode(id){
        try {
            const res = await this.get(`coupon/${id}`);
            console.log("Get COUPON : ", res)
            return res.json();
        } catch (error) {
            console.log("GET COUPON : ", error)
        }
    }

};
