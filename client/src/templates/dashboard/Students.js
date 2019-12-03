import React, { Component } from "react";
import withStyles from 'react-jss';

import EnhancedTable from '../../components/Table';

const styles = theme => ({
    root: {
        display: 'flex',
        width: '85%',
        margin: 'auto'
    }
});

class Students extends Component {
    constructor(props) {
        super(props);
        this.state = {
            students: []
        };
    }
    componentDidMount() {
    }
    render() {
        const { } = this.state;
        const {
            classes
        } = this.props;

        return (
            <div className={classes.root}>
                <EnhancedTable data={"data"} />
            </div>
        )
    }
}

export default withStyles(styles)(Students);