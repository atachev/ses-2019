import React, { Component } from 'react';
import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import InsertDriveFile from '@material-ui/icons/InsertDriveFile'
import DashboardIcon from '@material-ui/icons/Dashboard';
import { Route } from 'react-router-dom';

import withStyles from 'react-jss';
import { BrowserRouter as Router } from 'react-router-dom';

import auth from '../auth';
import Home from '../Home';
import Login from '../components/Login';
import Register from '../components/Register';
import Exams from '../templates/Exams';
import Tests from '../templates/Tests';
import AdminTests from "../templates/dashboard/Tests";
import AdminExams from "../templates/dashboard/Exams";
import Dashboard from "../templates/dashboard/Dashboard";
import Students from "../templates/dashboard/Students";
import TemplateComponent from '../components/TemplateComponent';
import MenuComponent from '../components/Menu';
import AuthenticationService from '../services/Authentication.service';
import Logout from '../components/Logout';
import Menu from '@material-ui/icons/Menu';
import FormatListNumberedOutlinedIcon from '@material-ui/icons/FormatListNumberedOutlined';

const drawerWidth = 240;

const styles = theme => ({
    root: {
        display: 'flex',
        background: theme.customColor
    },
    appBar: {
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
    },
    menuButton: {
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    content: {
        flexGrow: 1,
        marginLeft: -drawerWidth,
        marginTop: '64px'
    },
    contentShift: {
        marginLeft: 0,
    },
    flex: {
        flex: 1
    }
});

class PersistentDrawerLeft extends Component {
    token = new AuthenticationService().getDecodedToken();
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            token: this.token,
            role: this.token ? this.token.role : "no-role",
            anchorEl: null,
            openMenu: true
        }
        // this.setState({
        //     ...this.state,
        //     openMenu: Boolean(this.state.anchorEl)
        // })
        this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
        this.handleDrawerClose = this.handleDrawerClose.bind(this);
        this.handleMenu = this.handleMenu.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }
    handleDrawerOpen() {
        let token = this.state.token ? true : false;
        this.setState({
            ...this.state,
            open: token
        })
    }
    handleMenu(event) {
        this.setState({
            anchorEl: event.currentTarget
        });
    }
    handleClose() {
        this.setState({
            ...this.state,
            anchorEl: null
        });
    }
    handleDrawerClose() {
        this.setState({
            ...this.state,
            open: false
        })
    }
    render() {
        const { classes } = this.props;
        const { open, role, token } = this.state;
        return (
            <div className={classes.root}>
                <CssBaseline />
                <AppBar
                    color="inherit"
                    position="fixed"
                    className={clsx(classes.appBar, {
                        [classes.appBarShift]: open,
                    })}
                >
                    <Toolbar>
                        {token ? (
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                onClick={this.handleDrawerOpen}
                                edge="start"
                                className={clsx(classes.menuButton, open && classes.hide)}
                            >
                                <Menu />
                            </IconButton>
                        ) : ''}
                        <Typography variant="h6" noWrap>
                            GES
                        </Typography>
                        <div className={classes.flex}></div>
                        {!!token && (
                            <MenuComponent />
                        )}
                    </Toolbar>
                </AppBar>
                <Drawer
                    className={classes.drawer}
                    variant="persistent"
                    anchor="left"
                    open={open}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    <div className={classes.drawerHeader}>
                        <IconButton onClick={this.handleDrawerClose}>
                            {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                        </IconButton>
                    </div>
                    <Divider />
                    <List>
                        {role === 'student' ? (
                            <div>
                                <ListItem button component="a" href="/">
                                    <ListItemIcon><HomeIcon /></ListItemIcon>
                                    <ListItemText primary="Home" />
                                </ListItem>
                                <ListItem button component="a" href="/tests">
                                    <ListItemIcon><InsertDriveFile /></ListItemIcon>
                                    <ListItemText primary="Tests" />
                                </ListItem>
                                <ListItem button component="a" href="/exams">
                                    <ListItemIcon><InsertDriveFile /></ListItemIcon>
                                    <ListItemText primary="Exams" />
                                </ListItem>
                            </div>
                        ) : (
                                <div>
                                    <ListItem button component="a" href="/dash">
                                        <ListItemIcon><DashboardIcon /></ListItemIcon>
                                        <ListItemText primary="Табло" />
                                    </ListItem>
                                    <ListItem button component="a" href="/dash/tests">
                                        <ListItemIcon><InsertDriveFile /></ListItemIcon>
                                        <ListItemText primary="Тестове" />
                                    </ListItem>
                                    <ListItem button component="a" href="/dash/exams">
                                        <ListItemIcon><InsertDriveFile /></ListItemIcon>
                                        <ListItemText primary="Изпити" />
                                    </ListItem>
                                    <ListItem button component="a" href="/dash/students">
                                        <ListItemIcon><FormatListNumberedOutlinedIcon /></ListItemIcon>
                                        <ListItemText primary="Студенти" />
                                    </ListItem>
                                </div>
                            )}
                    </List>
                </Drawer>
                <main
                    className={clsx(classes.content, {
                        [classes.contentShift]: open,
                    })}
                >
                    <Router>
                        <div style={{ height: 'calc(100% - 64px)', maxHeight: 'calc(100% - 64px)' }}>
                            <Route exact={true} path="/" component={auth(() => <Home />)} />
                            <Route exact={true} path="/tests" component={auth(Tests)} />
                            <Route exact={true} path="/exams" component={auth(Exams)} />
                            <Route path="/register" component={Register} />
                            <Route path="/login" component={Login} />
                            <Route path="/tests/:testId" component={auth(TemplateComponent)} />
                            <Route path="/exams/:examId" component={auth(TemplateComponent)} />
                            <Route exact path="/dash" component={auth(Dashboard)} />
                            <Route exact path="/dash/tests" component={auth(AdminTests)} />
                            <Route exact path="/dash/exams" component={auth(AdminExams)} />
                            <Route exact path="/dash/students" component={auth(Students)} />
                            <Route exact path="/logout" component={auth(Logout)} />
                        </div>
                    </Router>
                </main>
            </div>
        );
    }
}

export default withStyles(styles)(PersistentDrawerLeft)