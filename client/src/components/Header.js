import React, { Component } from 'react';
import withStyles from 'react-jss';
const styles = theme => ({
    root: {
        background: theme.colorPrimary,
        fontSize: 16
    },
    active: {
        background: theme.colorActive,
        fontWeight: 'bold'
    },
    image: {
        background: `url('https://picsum.photos/id/533/1024/768') no-repeat center center fixed`,
        backgroundSize: 'cover',
        height: '350px'
    }
});

class Header extends Component {
    render() {
        const { classes } = this.props;
        return (
            <div className="header-container">
                <div className={classes.image}></div>
                {this.props.children}
            </div>
        );
    }
}

export default withStyles(styles)(Header);