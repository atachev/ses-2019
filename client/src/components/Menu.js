import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';

import { makeStyles } from '@material-ui/core/styles';
import AuthenticationService from '../services/Authentication.service';
import PersonIcon from '@material-ui/icons/Person';

import MailIcon from '@material-ui/icons/Mail';
import InfoIcon from '@material-ui/icons/Info';

const useStyles = makeStyles(theme => ({
    root: {

    },
    userContainer: {
        display: 'flex',
        flexDirection: 'column',
        padding: '16px'
    },
    userInfo: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: '10px 0'
    },
    username: {
        margin: '0 0 0 10px'
    }
}));

var token = new AuthenticationService().getDecodedToken();

export default function SimpleMenu(props) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);

    function handleClick(event) {
        setAnchorEl(event.currentTarget);
    }

    function handleClose() {
        setAnchorEl(null);
    }

    function logout() {
        localStorage.removeItem('token');
        window.location.reload(true);
    }
    return (
        <div>
            <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                <AccountCircle />
            </IconButton>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {token !== "" ? (
                    <div className={classes.userContainer}>
                        <div className={classes.userInfo}>
                            <PersonIcon />
                            <h3 className={classes.username}>{token.username} {token.surname}</h3>
                        </div>
                        <div className={classes.userInfo}>
                            <MailIcon />
                            <span className={classes.username}>{token.email}</span>
                        </div>
                        {token.fnum &&
                            <div className={classes.userInfo}>
                                <InfoIcon />
                                <span className={classes.username}>{token.faculty}, {token.semester}, {token.group}</span>
                            </div>
                        }
                    </div>
                ) : ''}
                <MenuItem onClick={logout}>Logout</MenuItem>
            </Menu>
        </div>
    );
}