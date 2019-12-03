import { Component } from 'react';
import decode from "jwt-decode";

export default class AuthenticationService extends Component {
    getToken() {
        return localStorage.getItem('token')
    }

    getDecodedToken() {
        let token = this.getToken();
        if(token) {
            return decode(this.getToken());
        }
        return "";
    }
    login() {

    }

    logout() {
        localStorage.removeItem('token');
        // this.props.history.push('/');
    }

    isLoggedIn() {
        const token = this.getToken(); // Getting token from localstorage
        return !!token && !this.isTokenExpired(token); // handwaiving here
    }

    isTokenExpired = token => {
        try {
            const decoded = decode(token);
            if (decoded.exp < Date.now() / 1000) {
                // Checking if token is expired.
                return true;
            } else return false;
        } catch (err) {
            // console.log("Изтекъл токен");
            return false;
        }
    };
}