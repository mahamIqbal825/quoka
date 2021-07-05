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
    async put(url, data) {
        return fetch(`${config.BASE_URL}${url}`, {
            method: "PUT",
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
    async get(url, token) {
        //alert(`${config.BASE_URL}${url}`)
        // 
        return fetch(`${config.BASE_URL}${url}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token || stores.userStore.userToken}`
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
    async getUser(){
        try {
            const res = await this.get('me');
            return res.json();
        } catch (error) {
            
        }
    },
    async updateUser(data,id) {
        try {
            const res = await this.put(`user/${id}`, data);
            //console.log("USER ID : ", id)
            //console.log("UPDATE USER RES : ", res)
            return res.json();
        } catch (error) {
            
            return error
        }
    },
    async getProfile(token) {
        try {
            const res = await this.get('profile', token);
            return res.json();
        } catch (error) {
            
            return error
        }
    },
    async getUserSession() {
        try {
            const res = await this.get('sessions');
            console.log("GET USER SESSION RES", res)
            return res.json();
        } catch (error) {
            
            return error
        }
    },
    async getUserWallet() {
        try {
            const res = await this.get('wallet');
            console.log("GET USER SESSION RES", res)
            return res.json();
        } catch (error) {
            
            return error
        }
    },
    async addWallet(data, id) {
        try {
            const res = await this.post(`wallet/${id}`, data);
            console.log("GET USER SESSION RES", res)
            return res.json();
        } catch (error) {
            
            return error
        }
    },
    async getUserTransactions(){
        try {
            const res = await this.get('transactions');
            console.log("GET USER SESSION RES", res)
            return res.json();
        } catch (error) {
            
            return error
        }
    },
    async checkPurchase(data){
        try {
            const res = await this.post('checkPurchase',data);
            console.log("CHECK PURCHASE RES", res)
            return res.json();
        } catch (error) {
            
            return error
        }
    }
};
