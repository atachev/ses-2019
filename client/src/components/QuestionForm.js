import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex'
    }
}));

export default function CardComponent() {
    const classes = useStyles();
    const {
        questions
    } = this.props;
    return (
        <div className={classes.root}>
            <FormControl component="fieldset">
                <FormLabel component="legend">{questions.text}</FormLabel>
                <RadioGroup
                    aria-label="gender"
                    name="gender1"
                    value={this.value}
                    onChange={(event) => this.handleChange(event)}
                >
                    {questions.answers.map(a => (
                        <FormControlLabel key={a._id} value={a.value} control={<Radio />} label={a.value} />
                    ))}
                </RadioGroup>
            </FormControl>
        </div>
    );
}
