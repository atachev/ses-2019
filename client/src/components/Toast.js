import React, { Component } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import withStyles from 'react-jss';

const styles = theme => ({
});

class ToastComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: this.props.text ? true : false,
            message: this.props.text
        }
        this.handleClose = this.handleClose.bind(this);
    }

    handleClose() {
        this.setState({
            ...this.state,
            open: false,
            message: ''
        })
    }

    render() {
        const { classes } = this.props;
        const { open, message } = this.state;
        return (
            <div>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={open}
                    autoHideDuration={6000}
                    onClose={this.handleClose}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id="message-id">{message}</span>}
                    action={[
                        <IconButton
                            key="close"
                            aria-label="close"
                            color="inherit"
                            className={classes.close}
                            onClick={this.handleClose}
                        >
                            <CloseIcon />
                        </IconButton>,
                    ]}
                />
            </div>
        );
    }
}
export default withStyles(styles)(ToastComponent);