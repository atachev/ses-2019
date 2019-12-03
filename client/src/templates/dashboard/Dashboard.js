import React, { Component } from "react";
import withStyles from 'react-jss';
import AuthenticationService from '../../services/Authentication.service';

import Grid from '@material-ui/core/Grid';

import Avatar from '@material-ui/core/Avatar';
import AccountCircleRounded from '@material-ui/icons/AccountCircleRounded';

import { dataService } from '../../services/data.service';

import CompletedCardComponent from '../../components/CompletedCard';
import LineChartComponent from '../../components/LineChart';
const styles = theme => ({
    root: {
        margin: 'auto',
        width: '85%'
    },
    container: {
        width: "100%"
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
    completedTitle: {
        margin: '0 0 10px 0',
        fontWeight: 400
    },
    completed: {
        display: 'flex',
        flexDirection: 'row'
    },
    circle: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        border: '3px solid #007f7f',
        width: '48px',
        height: '48px',
        marginRight: '10px'
    },
    circleCount: {

    },
    circleText: {
        margin: 0,
        fontSize: '11px',
        marginTop: '-5px'
    },
    completedTests: {
        display: 'flex',
        flexDirection: 'column'
    },
    items: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    charts: {
        display: 'flex',
        flexDirection: 'row'
    },
    flex: {
        flex: 1
    }
});

class Dashboard extends Component {
    token = new AuthenticationService().getDecodedToken();
    constructor(props) {
        super(props);
        this.state = {
            message: 'Loading...',
            userId: this.token.id,
            email: this.token.email,
            username: this.token.username,
            surname: this.token.surname,
            role: this.token.role,
            faculty: this.token.faculty,
            semester: this.token.semester,
            group: this.token.group,
            user: {},
            tests: [],
            exams: [],
            resolved: [],
            size: 20,
            subject: 'Изберете',
            name: '',
            filter: 'select',
            data: [
                { name: 'p', displayName: 'ПИК', count: 2 },
                { name: 'm', displayName: 'Математика 1', count: 1 },
                { name: 'c', displayName: 'Математика 2', count: 0 },
                { name: 'd', displayName: 'Математика 3', count: 5 },
                { name: 'e', displayName: 'Физика 1', count: 1 },
                { name: 'f', displayName: 'Физика 2', count: 30 },
                { name: 'g', displayName: 'ОИП', count: 0 },
            ],
            marks: [
                { name: 36, uv: 2, count: 2 },
                { name: 37, uv: 1, count: 3 },
                { name: 38, uv: 0, count: 4 },
                { name: 39, uv: 5, count: 5 },
                { name: 40, uv: 1, count: 6 }
            ],
            testsData: [],
            examsData: []
        }
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.generateTest = this.generateTest.bind(this);
        this.generateExam = this.generateExam.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    componentDidMount() {
        dataService.getResolvedTests().then(tests => {
            dataService.getResolvedExams().then(exams => {
                this.setState({
                    ...this.state,
                    tests,
                    exams
                });
                this.fillData("tests", tests.tests);
                this.fillData("exams", exams.exams);
                this.getLastResolved();
            })
        });
    }

    fillData(collection, data) {
        let mappedData = data.map(record => {
            return {
                name: record.subject,
                count: data.length
            }
        });
        this.setState({
            ...this.state,
            [`${collection}Data`]: mappedData
        })
        console.log(mappedData);
    }
    sort(a, b) {
        if (a.submitionDate < b.submitionDate) {
            return -1;
        }
        if (a.submitionDate > b.submitionDate) {
            return 1;
        }
        return 0;
    }

    getLastResolved() {
        const { tests, exams } = this.state;
        let resolved = [];
        if (this.state.tests.length !== 0 && this.state.exams.length !== 0) {
            resolved = [...tests.tests, ...exams.exams];
            resolved.sort(this.sort);
            this.setState({
                resolved
            })
        }
    }
    generateTest() {
        const { size, subject, name } = this.state;
        dataService.generateTest(size, subject, name).then(test => {
            // console.log(test);
        })
    }

    generateExam() {
        const { size, subject, name } = this.state;
        dataService.generateExam(size, subject, name).then(exam => {
            // console.log(exam);
        })
    }

    handleFilterChange(event) {
        const { value, name } = event.target;
        this.setState({
            ...this.state,
            [name]: value
        });
    }
    handleInputChange(event) {
        const { value, name } = event.target;
        this.setState({
            ...this.state,
            [name]: value
        });
    }
    render() {
        const {
            classes
        } = this.props;
        const { email, username, surname, user, resolved, data, marks, testsData, examsData } = this.state;
        return (
            <div className={classes.container}>
                <div className={classes.header}>
                    <div className={classes.headerWrapper}>
                        <div className={classes.left}>
                            <div className={classes.avatar}>
                                <Grid container justify="center" alignItems="center">
                                    <Avatar className={classes.avatar}>
                                        <AccountCircleRounded />
                                    </Avatar>
                                </Grid>
                            </div>
                            <div className={classes.info}>
                                <h1 className={classes.title}>Добре дошли, {username} {surname}!</h1>
                                {/* <span>{group} група, {faculty}</span> */}
                            </div>
                        </div>
                        {!!user.completedTests && !!user.completedExams ? (
                            <div className={classes.right}>
                                <p className={classes.completedTitle}>Завършени</p>
                                <div className={classes.completed}>
                                    <div className={classes.circle}>
                                        <span className={classes.circleCount}>{user.completedTests.length}</span>
                                        <p className={classes.circleText}>Теста</p>
                                    </div>
                                    <div className={classes.circle}>
                                        <span className={classes.circleCount}>{user.completedExams.length}</span>
                                        <p className={classes.circleText}>Изпита</p>
                                    </div>
                                </div>
                            </div>
                        ) : ''}
                    </div>
                </div>
                <div className={classes.root}>
                    <div>
                        {/* <h1>Статистики</h1> */}
                        <div className={classes.charts}>
                            <div className={classes.flex}>
                                <h1>Решени тестове по предмети</h1>
                                {testsData.length !== 0 ? (
                                    <LineChartComponent data={testsData} />
                                ) : "Няма решени тестове в момента"}
                            </div>
                            <div className={classes.flex}>
                                <h1>Решени изпити по предмети</h1>
                                {testsData.length !== 0 ? (
                                    <LineChartComponent data={examsData} />
                                ) : "Няма решени тестове в момента"}
                            </div>
                        </div>
                    </div>
                    {/* <div>
                        <div className={classes.charts}>
                            <div className={classes.flex}>
                                <p>Решени тестове по предмети</p>
                                <LineChartComponent data={data} />
                            </div>
                            <div className={classes.flex}>
                                <p>Решени изпити по предмети</p>
                                <LineChartComponent data={data} />
                            </div>
                            <div className={classes.flex}>
                                <h1>Оценки по предмет</h1>
                                <LineChartComponent data={marks} />
                            </div>
                        </div>
                    </div> */}
                    <div>
                        <h1>Последно предадени</h1>
                        <div className={classes.items}>
                            {resolved.length !== 0 ? resolved.map((r, i) => (
                                <CompletedCardComponent key={i} item={r} />
                            )) : 'В момента няма достъпни изпити'
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(Dashboard);