import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

//material
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
//views
import { Home as StarterHome } from '../templates/Home';
import { Home } from "../templates/user/Home_old";
import { Products } from "../templates/Products";
import { DemoComponent as Demo } from "../templates/Demo.component";
import Login from "../templates/Login";
import AdminTests from "../templates/dashboard/Tests";
import Dashboard from "../templates/dashboard/Dashboard";

export function AppRouter() {
    return (
        <Router>
            <AppBar position="static">
                <Toolbar>
                    <List>
                        {/* {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                            <ListItem button key={text}>
                                <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItem>
                        ))} */}
                        <Link to="/usr/">Home</Link>
                        <Link to="/dash/">Dashboard</Link>
                        <Link to="/products">Products</Link>
                        <Link to="/demo">Demo</Link>
                        <Link to="/dash/tests">Tests</Link>
                        <Link to="/login">Login</Link>
                        <Link to="/">Logout</Link>
                    </List>
                </Toolbar>
            </AppBar>
            <div>
                <Route exact path="/" component={Login} />
                <Route path="/usr/" component={() => <Home name="Aleksa" />} />
                <Route path="/products" component={Products} />
                <Route path="/demo" component={Demo} />
                <Route path="/home" component={() => <StarterHome />} />

                <Route path="/dash" component={Dashboard} />
                <Route path="/dash/tests" component={AdminTests} />
                {/* <Route component={CannotFind} /> */}
                {/* <Route path="/topics" component={Topics} /> */}
            </div>
        </Router>
    );
}
