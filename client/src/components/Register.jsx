import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";

import withStyles from 'react-jss';
function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://material-ui.com/">
                Your Website
      </Link>{' '}
            {new Date().getFullYear()}
            {'. Built with '}
            <Link color="inherit" href="https://material-ui.com/">
                Material-UI.
      </Link>
        </Typography>
    );
}

const styles = theme => ({
    paper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
    },
    form: {
        width: '100%', // Fix IE 11 issue.
    },
    submit: {

    },
});

class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            role: 'student'
        };
        this.onSubmit = this.onSubmit.bind(this);
    }

    handleInputChange = (event) => {
        const { value, name } = event.target;
        this.setState({
            [name]: value
        });
    }

    onSubmit = (event) => {
        event.preventDefault();
        fetch('/api/register', {
            method: 'POST',
            body: JSON.stringify(this.state),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (res.status === 200) {
                    // this.props.history.push('/');
                    console.log(res)
                } else {
                    const error = new Error(res.error);
                    throw error;
                }
            })
            .catch(err => {
                console.error(err);
                // alert('Error in registration, please try again');
            });
    }
    render() {
        const { classes } = this.props;
        const { role } = this.state;
        return (
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <form className={classes.form} noValidate onSubmit={this.onSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    type="text"
                                    autoComplete="fname"
                                    name="name"
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="name"
                                    label="Name"
                                    autoFocus
                                    onChange={this.handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    type="text"
                                    autoComplete="secondName"
                                    name="secondName"
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="secondName"
                                    label="Second Name"
                                    autoFocus
                                    onChange={this.handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    type="text"
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="surname"
                                    label="Surname"
                                    name="surname"
                                    onChange={this.handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl component="fieldset" className={classes.formControl}>
                                    <FormLabel component="legend">Choose role</FormLabel>
                                    <RadioGroup
                                        aria-label="role"
                                        name="role"
                                        className={classes.group}
                                        value={role}
                                        onChange={this.handleInputChange}
                                    >
                                        <FormControlLabel value="student" control={<Radio />} label="Student" />
                                        <FormControlLabel value="teacher" control={<Radio />} label="Teacher" />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                            {role == "student" ? (
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id="fnum"
                                        label="Faculty Number"
                                        type="text"
                                        name="fnum"
                                        onChange={this.handleInputChange}
                                    />
                                </Grid>
                            ) : (
                                    <Grid item xs={12}>
                                        <TextField
                                            variant="outlined"
                                            required
                                            fullWidth
                                            id="tnum"
                                            label="Teacher Number"
                                            type="text"
                                            name="tnum"
                                            onChange={this.handleInputChange}
                                        />
                                    </Grid>
                                )
                            }
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    onChange={this.handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    onChange={this.handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    name="faculty"
                                    label="Faculty"
                                    type="text"
                                    id="faculty"
                                    onChange={this.handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    name="semester"
                                    label="Semester"
                                    type="number"
                                    id="semester"
                                    onChange={this.handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    name="group"
                                    label="Group"
                                    type="number"
                                    id="group"
                                    onChange={this.handleInputChange}
                                />
                            </Grid>
                            {/* <Grid item xs={12}>
                                <FormControlLabel
                                    control={<Checkbox value="allowExtraEmails" color="primary" />}
                                    label="I want to receive inspiration, marketing promotions and updates via email."
                                />
                            </Grid> */}
                        </Grid>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            onClick={this.onSubmit}
                        >
                            Sign Up
                        </Button>
                        <Grid container justify="flex-end">
                            <Grid item>
                                <Link href="/login" variant="body2">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
                <Box mt={5}>
                    <Copyright />
                </Box>
            </Container>
        );
    }
}
export default withStyles(styles)(SignUp);