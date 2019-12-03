import React, { Component } from 'react';
import withStyles from 'react-jss';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import decode from "jwt-decode";
import CreateIcon from '@material-ui/icons/Create';

import Checker from '../helpers/Checker';
import ToastComponent from './Toast';
import { dataService } from '../services/data.service';
const styles = theme => ({
    root: {
        width: '85%',
        margin: 'auto'
    },
    paper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        backgroundColor: 'red',
        marginTop: '20px'
    },
    form: {
        //width: '100%', // Fix IE 11 issue.
        width: '33%',
        marginTop: '20px'
    },
    formControl: {
        minWidth: '200px',
        width: '100%',
        padding: '5px !important'
    },
    container: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    submitBtn: {
        marginTop: "20px"
    }
});

class TemplateComponent extends Component {
    constructor(props) {
        super(props);
        let token = localStorage.getItem('token');
        this.state = {
            id: props.match.params.testId || props.match.params.examId,
            path: props.match.params.testId ? "tests" : "exams",
            docType: props.match.params.testId ? "test" : "exam",
            isLoading: true,
            item: [],
            answerValue: null,
            userAnswers: {},
            result: 0,
            userId: token ? decode(token).id : ""
        }
        // if (token) {
        //     let decoded = decode(token);
        //     this.setState({
        //         ...this.state,
        //         userId: decoded.id
        //     })
        // }
        this.getItemsById();
        this.handleChange = this.handleChange.bind(this);
        this.onTestSubmit = this.onTestSubmit.bind(this);
    }
    getItemsById() {
        fetch(`/api/${this.state.path}/${this.state.id}`).then(res => {
            res.json().then(re => {
                this.setState({
                    ...this.state,
                    isLoading: false,
                    item: re
                });
            })
        })
            .catch(err => {
                // console.error(err);
                // alert('Error logging in please try again');
            });
    }


    handleChange = (question, event) => {
        let updated = { [question.target.name]: event };

        this.setState({
            ...this.state,
            // test: {
            //     ...this.state.test,
            //     answers: {
            //         ...this.state.test.answers,
            //         [question.target.name]: event
            //     }
            // },
            answers: Object.assign(this.state.userAnswers, updated)
        });
        // console.log(this.state);
        // console.log(Object.values(this.state.userAnswers));
    }
    onTestSubmit() {
        if (Object.keys(this.state.userAnswers).length === 0) {
            this.setState({
                ...this.state,
                submitError: "Няма маркирани отговори!"
            });
            return;
        }
        this.setState({
            ...this.state,
            result: null
        })
        const answers = Object.values(this.state.userAnswers);
        const questions = this.state.item.questions;
        const correct = questions.map(qs => qs.answers.find(a => a.isCorrect === true))
        let result = new Checker(answers, correct);
        this.setState({
            ...this.state,
            result: result.result
        })
        if (Number(result.result)) {
            this.onTestCompleted(result.result);
        }
        // console.log(result);
    }

    onTestCompleted(result) {
        fetch(`/api/usr/${this.state.path}/${this.state.userId}`, {
            method: 'PATCH',
            body: JSON.stringify({
                documentType: this.state.docType,
                documentId: this.state.id,
                points: result
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            res.json().then(re => {
                console.log(re);
                dataService.postResolvedTests(this.state.id, this.state.item.bySubject, this.state.userId, result)
                    .then(res => {
                        console.log(res)
                    })
            })
        })
            .catch(err => {
                // console.error(err);
                // alert('Error logging in please try again');
            });
    }

    render() {
        const { classes } = this.props;
        const { item, isLoading, answerValue, result, submitError } = this.state;
        return (
            <div className={classes.root}>
                {submitError ? (
                    <ToastComponent text={submitError} />
                ) : ''}
                {result ? (
                    <ToastComponent text={`Твоят резултат е ${result} точки.`} />
                ) : ''}
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <CreateIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        {item.displayName}
                    </Typography>
                    <div className={classes.container}>
                        {isLoading === false && item ? item.questions.map((question, i) => (
                            <form className={classes.form} noValidate key={i}>
                                <FormControl component="fieldset" className={classes.formControl}>
                                    <FormLabel component="legend">{question.text}</FormLabel>
                                    <RadioGroup
                                        aria-label="role"
                                        name={question._id}
                                        value={answerValue}
                                        onChange={(question, event) => this.handleChange(question, event)}
                                    >
                                        {question.answers.map((answer, j) => (
                                            <FormControlLabel key={j} value={answer.value} control={<Radio />} label={answer.value} />
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                            </form>
                        )) : 'No available questions!'
                        }
                    </div>
                </div>
                <Button fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submitBtn}
                    onClick={this.onTestSubmit}>
                    Предай
                </Button>
            </div>
        );
    }
}

export default withStyles(styles)(TemplateComponent);