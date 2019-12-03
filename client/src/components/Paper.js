import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3, 2),
    },
    marginTop10: {
        marginTop: '10px'
    }
}));

export default function PaperSheet(props) {
    const classes = useStyles();
    return (
        <div>
            <Paper className={classes.root}>
                <Typography variant="h5" component="h3">
                    {props.title}
                </Typography>
                <Typography component="p">
                    {props.subheader}
                </Typography>
                <div className={classes.marginTop10}>
                {props.button}
                </div>
            </Paper>
        </div>
    );
}