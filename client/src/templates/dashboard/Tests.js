import React, { Component } from "react";
import Button from '@material-ui/core/Button';
import withStyles from 'react-jss';
import { dataService } from "../../services/data.service";
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';

import CardComponent from './Card';
const styles = theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        margin: 'auto',
        width: '85%'
    },
    header: {
        background: "#8db18c",
        padding: '15px 0 20px 0',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    headerWrapper: {
        margin: 'auto',
        width: '85%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'

    },
    form: {
        display: 'flex',
        flexDirection: 'row'
    },
    formControl: {
        width: '300px',
        marginRight: '15px;'
    },
    textField: {
        width: '200px',
        marginLeft: '15px'
    },
    left: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    avatar: {

    },
    info: {
        marginLeft: '16px',
        color: '#fff'
    },
    title: {
        marginBottom: 0,
        marginTop: 0
    },
    right: {
        display: 'flex',
        flexDirection: 'column'
    },
    items: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingTop: '20px'
    }
});

class AdminTests extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tests: [],
            filter: '',
            subject: 'Изберете',
            size: 20,
            name: '',
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.generateTest = this.generateTest.bind(this);

    }
    componentDidMount() {
        this.getTests();
    }

    getTests() {
        dataService.getAllTests().then(tests => {
            let sorted = tests.tests.sort();
            sorted.reverse();
            this.setState({
                tests: sorted
            })
        })
    }

    generateTest() {
        const { size, subject, name } = this.state;
        dataService.generateTest(Number(size), subject, name).then(test => {
            this.getTests();
        })
    }

    handleInputChange(event) {
        const { value, name } = event.target;
        this.setState({
            ...this.state,
            [name]: value
        });
    }

    render() {
        const { tests, subject } = this.state;
        const {
            classes
        } = this.props;

        return (
            <div>
                <div className={classes.header}>
                    <div className={classes.headerWrapper}>
                        {/* <div>
                            <h1>Генериране на тест</h1>
                        </div> */}
                        <div className={classes.form}>
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="subject-filter">Сортиране</InputLabel>
                                <Select
                                    value={subject}
                                    inputProps={{
                                        name: 'subject',
                                        id: 'subject-filter',
                                    }}
                                    onChange={this.handleInputChange}
                                >
                                    {/* {subjects.length !== 0 ? subjects.map((subject, i) => (
                                    <MenuItem key={i} value={subject}>{subject}</MenuItem>
                                )) : ''} */}
                                    <MenuItem value={"Изберете"}>Изберете</MenuItem>
                                    <MenuItem value={"ikonomika"}>Икономика</MenuItem>
                                    <MenuItem value={"materialoznanie"}>Материалознание</MenuItem>
                                    <MenuItem value={"mashinoznanie"}>Машинознание</MenuItem>
                                </Select>
                            </FormControl>
                            <div className={classes.textField}>
                                <TextField
                                    required
                                    fullWidth
                                    id="name"
                                    label="Брой въпроси"
                                    type="number"
                                    name="size"
                                    className={classes.textField}
                                    onChange={this.handleInputChange}
                                />
                            </div>
                            <div className={classes.textField}>
                                <TextField
                                    required
                                    fullWidth
                                    id="name"
                                    label="Име на теста"
                                    type="text"
                                    name="name"
                                    className={classes.textField}
                                    onChange={this.handleInputChange}
                                />
                            </div>
                            <Button color="inherit" onClick={this.generateTest}>
                                Създаване
                            </Button>
                        </div>
                    </div>
                </div>
                <div className={classes.root}>
                    <h1>Всички достъпни тестове</h1>
                    <div className={classes.items}>
                        {tests.length !== 0 ? tests.map((test, i) => (
                            <CardComponent key={i} item={test} collection="tests" />
                        )) : 'В момента няма достъпни тестове'
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(AdminTests);