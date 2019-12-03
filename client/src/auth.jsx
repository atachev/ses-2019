import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import decode from "jwt-decode";

export default function withAuth(ComponentToProtect) {
    return class extends Component {
        constructor(props) {
            super(props);
            this.state = {
                loading: true,
                redirect: false,
                teacher: false
            };
        }

        componentDidMount() {
            let token = localStorage.getItem('token');
            if (token) {
                let decoded = decode(localStorage.getItem('token'));
                if (decoded.exp < Date.now() / 1000) {
                    localStorage.clear();
                    window.location.reload(true);
                } else {
                    this.setState({
                        ...this.state,
                        teacher: decoded.role === "teacher" ? true : false
                    })
                }
            }
            fetch('/api/checkToken', {
                headers: {
                    'x-access-token': token
                }
            })
                .then(res => {
                    if (res.status === 200) {
                        this.setState({ loading: false });
                    } else {
                        const error = new Error(res.error);
                        throw error;
                    }
                })
                .catch(err => {
                    this.setState({ loading: false, redirect: true });
                });
        }

        render() {
            const { loading, redirect } = this.state;
            if (loading) {
                return null;
            }
            if (redirect) {
                return <Redirect to={{
                    pathname: '/login',
                    state: {
                        message: "Login first"
                    }
                }} />;
            }

            // if (teacher) {
            //     return <Redirect to={{
            //         pathname: '/dash'
            //     }} />;
            // }
            return (
                // <React.Fragment>
                //     <ComponentToProtect {...this.props} />
                // </React.Fragment>
                <ComponentToProtect {...this.props} />
            );
        }
    }
}