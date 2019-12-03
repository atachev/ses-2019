import React, { Component } from "react";
import CardComponent from './components/Card';
import CompletedCardComponent from './components/CompletedCard';

import withStyles from 'react-jss';
import AuthenticationService from './services/Authentication.service';

import Grid from '@material-ui/core/Grid';

import Avatar from '@material-ui/core/Avatar';
import AccountCircleRounded from '@material-ui/icons/AccountCircleRounded';

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
	}
});

class Home extends Component {
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
			exams: []
		}
		if (this.token.role === 'teacher') {
			window.location.replace('http://localhost:3000/dash');
		}
	}
	componentDidMount() {
		this.getUser();
		this.getAvailableTests();
		this.getAvailableExams();
		//GET message from server using fetch api
		// fetch('/api/home')
		// 	.then(res => res.text())
		// 	.then(res => this.setState({ message: res }));
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
	getAvailableTests() {
		fetch('/api/tests').then(res => {
			res.json().then(re => {
				this.setState({
					...this.state,
					tests: re.tests
				});
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

	getAvailableExams() {
		fetch('/api/exams').then(res => {
			res.json().then(re => {
				this.setState({
					...this.state,
					exams: re.exams
				});
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
	render() {
		const {
			classes
		} = this.props;
		const { username, surname, faculty, group, tests, exams, user } = this.state;
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
								<span>{group} група, {faculty}</span>
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
						<h1>Достъпни изпити</h1>
						<div className={classes.items}>
							{exams.length !== 0 ? exams.map((exam, i) => (
								<CardComponent key={i} item={exam} collection="exams" />
							)) : 'В момента няма достъпни изпити'
							}
						</div>
					</div>
					<div>
						<h1>Достъпни тестове</h1>
						<div className={classes.items}>
							{tests.length !== 0 ? tests.map((test, i) => (
								<CardComponent key={i} item={test} collection="tests" />
							)) : 'В момента няма достъпни тестове'
							}
						</div>
					</div>
					<div>
						<h1>Завръшени изпити</h1>
						<div className={classes.items}>
							{!!user.completedExams && !!user.completedExams.length !== 0 ? user.completedExams.map((exam, i) => (
								<CompletedCardComponent key={i} item={exam} collection="exams" />
							)) : 'Все още нямате завършени изпити'}
						</div>
					</div>
				</div>
			</div>
		);
	}
}
export default withStyles(styles)(Home);