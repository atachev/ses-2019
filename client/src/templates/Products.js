import React, { Component } from "react";

// material
import LinearProgress from '@material-ui/core/LinearProgress';

export class Products extends Component {
    // state
    state = {
        products: [],
        hasInterval: false
    };

    componentDidMount() {
        if (!this.state.hasInterval) {
            let interval = setInterval(() => {
                this.getProducts();
            }, 1000);
            this.setState({ hasInterval: interval });
        }
    }
    componentWillUnmount() {
        if (this.state.hasInterval) {
            clearInterval(this.state.hasInterval);
            this.setState({ hasInterval: null });
        }
    }

    getProducts = () => {
        fetch("http://localhost:3001/api/products/")
            .then(data => data.json())
            .then(res => this.setState({ products: res.products }))
    }
    render() {
        const { products } = this.state;
        return (
            <div>
                {products.length !== 0 ? products.map(p => (
                    <li key={p._id}>
                        {p.name}
                    </li>
                )) : <LinearProgress />}

            </div>
        )
    }
}