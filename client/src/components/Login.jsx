// Login.jsx
import React, { Component } from 'react';
import withStyles from 'react-jss';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import ToastComponent from './Toast';

import * as faceapi from 'face-api.js';
import { loadModels } from '../helpers/face';


import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import PaperSheet from "./Paper";

//camera

import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';

import CircularProgress from '@material-ui/core/CircularProgress';


const styles = theme => ({
    root: {
        height: '100%',
        minHeight: '100%'
    },
    marginTop10: {
        marginTop: '10px'
    },
    marginTopBottom20: {
        margin: '10px 0 20px'
    },
    paddingTop100: {
        paddingTop: '100px;'
    },
    paper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        backgroundColor: 'red'
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        margin: '20px 0'
    },
    submit: {
    },
    uploaded: {
    },
    image: {
        width: '396px',
        height: '297px;'
    },
    cameraContainer: {
        width: '200px',
        height: '200px;',
        maxWidth: '250px',
        maxHeight: '250px'
    },
    loading: {
        position: 'fixed',
        zIndex: 9999,
        background: 'rgba(0, 0, 0, .6)',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    progress: {
        color: '#fff'
    },
    cameraIMG: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    imageURLcontainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%'
    }
});

class Login extends Component {
    threshold = 0.6;
    descriptors = { desc1: null, desc2: null }
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            fnum: {},
            tnum: {},
            password: '',
            isFaceValid: false,
            validFnum: false,
            imageURL: '',
            savedURL: '',
            text: '',
            role: '',
            messages: [],
            cameraError: false,
            loading: false,
            loginErr: null,
            imageErr: null,
            demo: false
        };
        this.handleUploadImage = this.handleUploadImage.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.getUserImage = this.getUserImage.bind(this);
        this.reSubmitImage = this.reSubmitImage.bind(this);
    }
    onTakePhoto(dataUri) {
        // Do stuff with the dataUri photo...
        // console.log('takePhoto');
        // console.log(dataUri);
        this.setState({
            ...this.state,
            imageURL: dataUri,
            loading: true
        })
        this.proceedVerification();
    }
    componentWillMount = async () => {
        await loadModels();
    };

    proceedVerification = async () => {
        await this.handleSelection(1, this.state.savedURL);
        await this.handleSelection(2, this.state.imageURL);
        this.updateResult();
    }

    handleSelection = async (which, url = this.state.img) => {
        const input = await faceapi.fetchImage(url);
        const imgEl = document.querySelector(`#face${which}`);
        imgEl.src = input.src;
        this.descriptors[`desc${which}`] = await faceapi.computeFaceDescriptor(input);
        // console.log(this.descriptors.desc1);
        // console.log(this.descriptors.desc2);
        // console.log("finished");
    }
    getUserImage(key, value) {
        fetch('/api/getImageURL', {
            method: 'POST',
            body: JSON.stringify({
                [key]: value
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                res.json().then(re => {
                    if (re.error) {
                        this.setState({
                            ...this.state,
                            imageErr: re.error
                        })
                    } else {
                        this.setState({
                            ...this.state,
                            imageErr: null,
                            savedURL: `http://localhost:3001/${re.imageURL}`,
                        });
                    }
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
    updateResult() {
        const distance = faceapi.round(
            faceapi.euclideanDistance(this.descriptors.desc1, this.descriptors.desc2)
        )
        let text = distance;
        // let bgColor = '#ffffff';
        if (distance > this.threshold) {
            text += ' (no match)'
            // bgColor = '#ce7575'
        }
        if (text) {
            this.setState({
                ...this.state,
                loading: false
            })
        }
        this.setState({
            ...this.state,
            text: text,
            isFaceValid: true
        })
        // console.log(text);
    }
    handleUploadImage(event) {
        const data = new FormData();
        data.append('file', this.uploadInput.files[0]);
        data.append('filename', `${this.uploadInput.files[0].name}_${Date.now()}` || 'example');
        fetch('/api/upload', {
            method: 'POST',
            body: data,
        }).then((response) => {
            response.json().then((body) => {
                this.setState({ ...this.state, imageURL: `http://localhost:3001/${body.file}` });
            });
            this.proceedVerification();
        });
    }

    handleRoleChange = (event) => {
        const { value, name } = event.target;

        this.setState({
            ...this.state,
            [name]: value,
            imageURL: '',
            fnum: {},
            tnum: {}
        });
    }
    handleInputChange = (event) => {
        const { value, name } = event.target;
        // console.log(value + ' -' + name)
        let isValid = this.withValidation(name, value);

        this.setState({
            ...this.state,
            imageErr: null,
            loginErr: null,
            [name]: {
                'value': value,
                'isValid': isValid,
                'key': name
            }
        });

        if (isValid) {
            this.getUserImage(name, value)
        }
    }

    onSubmit = (event) => {
        // event.preventDefault();
        localStorage.removeItem('token');
        fetch('/api/authenticate', {
            method: 'POST',
            // body: JSON.stringify(this.state),
            body: JSON.stringify({
                'fnum': this.state.fnum.value,
                'tnum': this.state.tnum.value,
                'isFaceDetectionValid': this.state.text <= 0.5 ? true : false,
                'password': this.state.password.value || undefined
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                res.json().then(re => {
                    if (re.error) {
                        this.setState({
                            ...this.state,
                            loginErr: re.error
                        })
                    } else {
                        this.setState({
                            ...this.state,
                            loginErr: null
                        })
                        window.localStorage.setItem('token', re.token);
                        this.props.history.push('/');
                        // need to be fixed
                        window.location.reload();
                    }
                })
                // if (res.status === 200) {
                //     this.props.history.push('/');
                //     console.log("Logged In")
                // } else {
                //     const error = new Error(res.error);
                //     throw error;
                // }
            })
            .catch(err => {
                console.error(err);
                // alert('Error logging in please try again');
            });
    }

    withValidation(name, value) {
        if (name === 'fnum' && value.length === 9) {
            return true;
        }

        if (name === 'tnum' && value.length === 9) {
            return true;
        }
        return false;
    }
    onChangeHandler(event) {
        // console.log(event.target.files[0])
        this.setState({
            ...this.state,
            selectedFile: event.target.files[0],
            loaded: 0,
        })
    }
    onCameraError(error) {
        console.error('onCameraError', error);
        this.setState({
            ...this.state,
            cameraError: true
        })
    }

    onCameraStarted(stream) {
        console.log(stream);
        // console.log("Camera started")
        // console.log(stream);
    }

    onCameraStop() {
        // console.log('onCameraStop');
    }
    reSubmitImage() {
        this.setState({
            ...this.state,
            imageURL: null
        })
    }

    handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            this.onSubmit();
        }
    }
    render() {
        const { classes } = this.props;
        const { imageURL, savedURL, text, role, fnum, tnum, loading, loginErr, imageErr, demo } = this.state;
        return (
            <Container className={classes.paddingTop100} component="main" maxWidth="xs">
                {loginErr ? (
                    <ToastComponent text={loginErr} />
                ) : ''}
                {imageErr ? (
                    <ToastComponent text={imageErr} />
                ) : ''}
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Вход
                    </Typography>
                    {/* Message: {message} */}
                    <form className={classes.form} noValidate>
                        <FormControl component="fieldset" className={classes.formControl}>
                            <FormLabel component="legend">Изберете роля</FormLabel>
                            <RadioGroup
                                aria-label="role"
                                name="role"
                                value={role}
                                className={classes.marginTopBottom20}
                                onChange={this.handleRoleChange}
                            >
                                <FormControlLabel value="student" control={<Radio />} label="Студент" />
                                <FormControlLabel value="teacher" control={<Radio />} label="Преподавател" />
                            </RadioGroup>
                        </FormControl>
                        {/* <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                onChange={this.handleInputChange}
                            /> */}
                        {role === 'student' ? (
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="fnum"
                                label="Fac number"
                                name="fnum"
                                autoComplete="fnum"
                                autoFocus
                                onChange={this.handleInputChange}
                            />
                        ) : ''}
                        {role === 'teacher' ? (
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="tnum"
                                label="Teacher number"
                                name="tnum"
                                autoComplete="tnum"
                                autoFocus
                                onChange={this.handleInputChange}
                            />
                        ) : ''}
                        {(fnum.isValid === true || !!tnum.isValid === true) && !imageErr && !imageURL ?
                            (
                                <div>
                                    <Camera
                                        className={classes.video}
                                        imageCompression={0.97}
                                        isDisplayStartCameraError={false}
                                        onCameraStart={(stream) => this.onCameraStarted(stream)}
                                        onTakePhoto={(dataUri) => { this.onTakePhoto(dataUri); }}
                                        onCameraStop={() => { this.onCameraStop(); }}
                                    />
                                </div>
                            ) : ''
                        }
                        {loading === true ? (
                            <div className={classes.loading}>
                                <div className={classes.progress}>
                                    <CircularProgress color="inherit" size={60} />
                                    <p>Loading</p>
                                </div>
                            </div>
                        ) : ''}
                        {fnum.isValid === true && demo === true ?
                            (
                                <div>
                                    <input ref={(ref) => { this.uploadInput = ref; }} type="file" onChange={(event) => this.handleUploadImage(event)} />
                                    <input ref={(ref) => { this.fileName = ref; }} type="text" placeholder="Enter the desired name of file" />
                                </div>
                            ) : ''
                        }
                        {fnum.isValid === true || tnum.isValid === true ?
                            (
                                <div>
                                    <div>
                                        <div style={{ display: 'none' }}>
                                            <span>image 1</span>
                                            <img id="face1" className={classes.image} src={savedURL} />
                                        </div>
                                        <div className={classes.cameraIMG}>
                                            {/* {imageURL => (
                                                <span>Uploaded image</span>
                                            )} */}
                                            {imageURL &&
                                                <div className={classes.imageURLcontainer}>
                                                    <h1>Вашата снимка</h1>
                                                    <img id="face2" className={classes.image} src={imageURL} />
                                                </div>
                                            }
                                            {text => (
                                                <span>Similarity: {text}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : ''
                        }
                        {/* {imageURL &&
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    onClick={this.proceedVerification}
                                >
                                    Check
                                </Button>
                            } */}
                        {text >= 0.5 && text != '' && (fnum.isValid === true || tnum.isValid === true) && imageURL ? (
                            <div className={classes.marginTop10}>
                                {/* ${((1 - text) * 100).toFixed(2)} */}
                                <PaperSheet
                                    title={`Само на ${((1 - text) * 100).toFixed(2)} % сме сигурни, че това си ти :)`}
                                    subheader={"Моля, въведи и своята парола."}
                                    button={
                                        <Button fullWidth
                                            variant="contained"
                                            color="primary"
                                            className={classes.submit}
                                            onClick={this.reSubmitImage}>
                                            Или опитайте отново
                                        </Button>
                                    } />
                                {/* <p>We are just {((1 - text) * 100).toFixed(2)} % sure that`s you :) Please add password too!</p> */}
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoFocus
                                    onKeyDown={this.handleKeyDown}
                                    onChange={this.handleInputChange}
                                />
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                    onClick={this.onSubmit}
                                >
                                    Вход
                                </Button>
                                <Grid container className={classes.marginTop10}>
                                    <Grid item xs>
                                        <Link href="#" variant="body2">
                                            Забравена парола?
                                        </Link>
                                    </Grid>
                                    <Grid item>
                                        <Link href="/register" variant="body2">
                                            Нямаш акаунт? Регистрирай се
                                        </Link>
                                    </Grid>
                                </Grid>
                            </div>
                        ) : ''}
                        {text <= 0.5 && text != '' && (fnum.isValid === true || tnum.isValid === true) && imageURL ? (
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                                onClick={this.onSubmit}
                            >
                                Вход
                        </Button>
                        ) : ""}
                        {/* <div className={classes.uploaded}>
                                {imageURL &&
                                    <div>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                            onClick={this.updateResult}
                                        >
                                            Are you sure?
                                        </Button>
                                        <Button
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                        >
                                            Submit Again
                                        </Button>
                                    </div>
                                }
                            </div> */}
                    </form>
                </div>
            </Container>
        );
    }
}

export default withStyles(styles)(Login);