import React, { Component } from "react";
import CardComponent from '../components/Card';
import withStyles from 'react-jss';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import decode from "jwt-decode";

import CompletedCardComponent from '../components/CompletedCard';
const styles = theme => ({
    root: {
        margin: 'auto',
        width: '85%',
        marginTop: "20px"
    },
    items: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap'
    }
});

class Tests extends Component {
    constructor(props) {
        super(props);
        let token = localStorage.getItem('token');
        this.state = {
            tests: [],
            subjects: [],
            filter: 'all',
            filteredTests: [],
            user: {},
            userId: token ? decode(token).id : ""
        }
        this.handleFilterChange = this.handleFilterChange.bind(this);
    }
    componentDidMount() {
        this.getUser();
        this.getAllTests();
    }
    getAllTests() {
        fetch('/api/tests').then(res => {
            res.json().then(re => {
                this.setState({
                    ...this.state,
                    tests: re.tests,
                    filteredTests: re.tests
                });
                this.getTestsSubjects(re.tests);
            })
        })
            .catch(err => {
                // console.error(err);
                // alert('Error logging in please try again');
                this.setState({
                    ...this.state,
                    messages: [{
                        message: 'Error logging in please try again'
                    }]
                })
            });
    }

    getTestsSubjects(tests) {
        let subjects = tests.map(t => {
            return t.bySubject;
        });
        let filteredSubjects = ["all", ...new Set(subjects)];
        this.setState({
            ...this.state,
            subjects: filteredSubjects
        })
    }
    getUser() {
        fetch(`/api/usr/${this.state.userId}`).then(res => {
            res.json().then(re => {
                this.setState({
                    ...this.state,
                    user: re
                })
            })
        })

    }
    handleFilterChange(event) {
        const { value, name } = event.target;
        const { tests } = this.state;
        // this.setState({
        //     ...this.state,
        //     [name]: value
        // });
        if (value === "all") {
            this.setState({
                ...this.state,
                filteredTests: tests,
                [name]: value
            })
        } else {
            this.setState({
                ...this.state,
                filteredTests: tests.filter(t => {
                    return t.bySubject === value;
                }),
                [name]: value
            })
        }
    }

    render() {
        const { filter, subjects, filteredTests, user } = this.state;
        const {
            classes
        } = this.props;
        return (
            <div className={classes.root}>
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="subject-filter">Сортиране</InputLabel>
                    <Select
                        value={filter}
                        inputProps={{
                            name: 'filter',
                            id: 'subject-filter',
                        }}
                        onChange={this.handleFilterChange}
                    >
                        {subjects.length !== 0 ? subjects.map((subject, i) => (
                            <MenuItem key={i} value={subject}>{subject}</MenuItem>
                        )) : ''}
                    </Select>
                </FormControl>
                <div>
                    {filteredTests.length} резултата
                    <h1>Достъпни тестове по предмети</h1>
                    <div className={classes.items}>
                        {filteredTests.length !== 0 ? filteredTests.map((test, i) => (
                            <CardComponent key={i} item={test} collection="tests" />
                        )) : 'В момента няма достъпни тестове'
                        }
                    </div>
                </div>
                <div>
                    <h1>Завръшени тестове</h1>
                    <div className={classes.items}>
                        {!!user.completedTests && !!user.completedTests.length !== 0 ? user.completedTests.map((test, i) => (
                            <CompletedCardComponent key={i} item={test} collection="tests" />
                        )) : 'Все още нямате завършени тестове'}
                    </div>
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(Tests);