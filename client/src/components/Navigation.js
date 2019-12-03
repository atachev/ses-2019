import React from 'react';
import withStyles from 'react-jss';

// material
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
    root: {
        fontSize: 16,
        background: theme.customColor
    },
    active: {
        background: theme.customColor,
        fontWeight: 'bold'
    },
    grow: {
        flexGrow: 1
    }
});

class Navigation extends React.Component {
    render() {
        const {
            classes, children,
        } = this.props;
        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" className={classes.title}>
                            GES
                        </Typography>
                        <div className={classes.grow} />
                        {children}
                    </Toolbar>
                </AppBar>
            </div>
        )
    }
}

export default withStyles(styles)(Navigation);