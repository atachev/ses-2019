import React from 'react';
import withStyles from 'react-jss';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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

class LineChartComponent extends React.Component {
    render() {
        return (
            <ResponsiveContainer width="100%" height={200}>
                <LineChart data={this.props.data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line connectNulls={true} type='monotone' dataKey='count' stroke='#8884d8' fill='#8884d8' />
                </LineChart>
            </ResponsiveContainer>
        );
    }
}
export default withStyles(styles)(LineChartComponent);