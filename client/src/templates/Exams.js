import React, { Component } from "react";
import CardComponent from '../components/Card';
import withStyles from 'react-jss';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import decode from "jwt-decode";
import { dataService } from '../services/data.service';

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

class Exams extends Component {

    constructor(props) {
        super(props);
        let token = localStorage.getItem('token');
        this.state = {
            exams: [],
            subjects: [],
            filter: 'all',
            filteredExams: [],
            user: {},
            userId: token ? decode(token).id : ""
        }
        this.handleFilterChange = this.handleFilterChange.bind(this);
    }
    componentDidMount() {
        this.getUser();
        dataService.getUser(this.state.userId).then(user => {
            this.setState({
                ...this.state,
                user: user
            })
        })
        this.getAllExams();
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

    getAllExams() {
        fetch('/api/exams').then(res => {
            res.json().then(re => {
                this.setState({
                    ...this.state,
                    exams: re.exams,
                    filteredExams: re.exams
                });
                this.getExamsSubjects(re.exams);
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

    getExamsSubjects(exams) {
        let subjects = exams.map(t => {
            return t.bySubject;
        });
        let filteredSubjects = ["all", ...new Set(subjects)];
        this.setState({
            ...this.state,
            subjects: filteredSubjects
        })
    }

    handleFilterChange(event) {
        const { value, name } = event.target;
        const { exams } = this.state;
        if (value === "all") {
            this.setState({
                ...this.state,
                filteredExams: exams,
                [name]: value
            })
        } else {
            this.setState({
                ...this.state,
                filteredExams: exams.filter(t => {
                    return t.bySubject === value;
                }),
                [name]: value
            })
        }
    }

    render() {
        const { filter, subjects, filteredExams, user } = this.state;
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
                    {filteredExams.length} резултата
                    <h1>Достъпни изпити по предмети</h1>
                    <div className={classes.items}>
                        {filteredExams.length !== 0 ? filteredExams.map((exam, i) => (
                            <CardComponent key={i} item={exam} collection="exams" />
                        )) : 'В момента няма достъпни тестове'
                        }
                    </div>
                </div>
                <div>
                    <h1>Завършени изпити</h1>
                    <div className={classes.items}>
                        {!!user.completedExams && !!user.completedExams.length !== 0 ? user.completedExams.map((exam, i) => (
                            <CompletedCardComponent key={i} item={exam} collection="exams" />
                        )) : 'Все още нямате завършени изпити'}
                    </div>
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(Exams);