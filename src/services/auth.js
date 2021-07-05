

import config from "./config";

export default {
    async headers() {
        return await {
            Accept: "application/json",
            "Content-Type": "application/json"
        };
    },
    async post(url, data, header) {
        return fetch(`${config.BASE_URL}${url}`, {
            method: "POST",
            headers: await this.headers(),
            body: JSON.stringify(data)
        });
    },
    async get(url, data, header) {
        return fetch(`${config.BASE_URL}${url}`, {
            method: "GET",
            headers: header,
            body: JSON.stringify(data)
        });
    },
    async put(url, data, header) {
        
        return fetch(`${config.BASE_URL}${url}`, {
            method: "PUT",
            headers: header,
            body: JSON.stringify(data)
        });
    },
    async patch(url, data) {
        return fetch(`${config.BASE_URL}${url}`, {
            method: "PATCH",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });;
    },
    async register(data) {
        try {
            const res = await this.post("auth/sign-up", data);
            //console.log("res auth : ", res)
            return res.json();
        } catch (error) {
            return error
        }
    },
    async login(data) {
        try {
            const res = await this.post("auth/sign-in", data);
            console.log("LOGIN RES : ", res)
            return res.json();
        } catch (error) {
            
            return error
        }
    }
};
