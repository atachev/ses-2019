import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import MoreVertIcon from '@material-ui/icons/MoreVert';

const useStyles = makeStyles(theme => ({
    root: {
        padding: '8px'
    },
    card: {
        maxWidth: 360,
        width: 360
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: red[500],
    },
}));

export default function CardComponent(props) {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <Card className={classes.card}>
                <CardHeader
                    avatar={
                        <Avatar aria-label="recipe" className={classes.avatar}>
                            R
                        </Avatar>
                    }
                    action={
                        <IconButton aria-label="settings">
                            <MoreVertIcon />
                        </IconButton>
                    }
                    title={props.item ? props.item.displayName : ''}
                    subheader={`${props.item ? props.item.bySubject : ''} created on ${new Date(props.item ? props.item.createdOn : '').toLocaleDateString()}`}
                />
                <CardMedia
                    className={classes.media}
                    image="https://www.moonstone.co.za/upmedia/uploads/Fias-Exam.png"
                    title="Paella dish"
                />
                <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {/* name: {props.item ? props.item.displayName : ''} */}
                        {/* doc: {props.item.documentType} */}
                        {/* subject: {props.item ? props.item.bySubject : ''} */}
                        {props.item ? props.item.questions.length : 0} въпроса
                    </Typography>
                </CardContent>
            </Card>
        </div>
    );
}
