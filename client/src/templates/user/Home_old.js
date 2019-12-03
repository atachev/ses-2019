import React, { Component } from "react";
import axios from "axios";
import Typography from '@material-ui/core/Typography';

export class Home extends Component {
    // get only available exams
    // create API endpoint for that
    state = {
        tests: [],
        hasInterval: false,
        message: String
    };

    componentDidMount() {
        if (!this.state.hasInterval) {
            let interval = setInterval(() => {
                // console.log("tests")
                this.getAvailableTests();
            }, 1000);
            this.setState({ hasInterval: interval });
        }
    }
    componentWillUnmount() {
        if (this.state.hasInterval) {
            clearInterval(this.state.hasInterval);
            this.setState({ hasInterval: null });
        }
    }

    getAvailableTests = () => {
        fetch("http://localhost:3001/api/tests/")
            .then(data => data.json())
            .then(res => this.setState({ tests: res.tests }))
    }

    generateTest() {
        fetch("http://localhost:3001/api/questions/generateTest")
            .then(data => data.json())
            .then(res => {
                return res;
            })
    }
    removeItem(item) {
        //deleted from the state
        // const filtered = this.state.tests.filter(t => {
        //     return t !== item;
        // });
        // this.setState({
        //     tests: [...filtered]
        // })
        // console.log(filtered);
        // axios.delete("http://localhost:3001/api/tests/", {
        //     data: {
        //         testId: item.id
        //     }
        // }).then(function (response) {
        //     console.log(response);
        // })
        // .catch(error => {
        //     console.log(error.response)
        // });
        return fetch(`http://localhost:3001/api/tests/${item.id}`, {
            method: 'delete'
        })
            .then(response => response.json())
            .then(data => {
                this.setState({ message: data.message })
            })
            .catch(error => error)

    }

    render() {
        const { tests } = this.state;
        const { message } = this.state;
        return (
            <div>
                <h1>Hello, {this.props.name}</h1>
                {/* <section>
                    <div>
                        <button onClick={(e) => this.generateTest()}>Generate test</button><br></br>
                        {message ?
                            <span> message</span>
                        : ''}
                        {<Typography variant="title" color="inherit">{tests.length} аvailable exams for the next 24h</Typography>}
                        {tests.map((t, i) => {
                            return (
                                <div key={i}>
                                    <h1 key={i}>Тест: {t.id} - {t.bySubject} - created on: {t.createdOn}</h1>
                                    <button onClick={(e) => this.removeItem(t)}>Remove test</button>
                                    {t.questions.map((q, y) => {
                                        return (
                                            <ul key={y}>
                                                <li key={y}>{q.text}</li>
                                                <ol>
                                                    {q.answers.map((a, k) => {
                                                        return (
                                                            <li key={k}>{a.value}</li>
                                                        )
                                                    })}
                                                </ol>
                                            </ul>
                                        )
                                    })}
                                </div>
                            )

                        })}
                    </div>
                </section> */}
            </div>
        )

    }
}