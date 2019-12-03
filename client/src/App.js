// /client/App.js
import React, { Component } from "react";
// material font
import "typeface-roboto";
import Drawer from './components/Drawer';
import AuthenticationService from './services/Authentication.service';
import withStyles from 'react-jss';

const styles = theme => ({
    '@global': {
        html: {
            height: '100%',
            minHeight: '100%;'
        },
        body: {
            height: '100%',
            minHeight: '100%;'
        }
    },
    root: {
        height: '100%',
        minHeight: '100%;'
    }
});

class App extends Component {
    token = new AuthenticationService().getDecodedToken();
    constructor(props) {
        super(props);
        this.state = {
            role: this.token ? this.token.role : "no-role"
        }
        this.logout = this.logout.bind(this);
    }
    logout() {
        localStorage.removeItem('token');
        window.location.reload(true);
    }

    login() {

    }
    render() {
        // return (
        //   <AppRouter />
        // );
        // const { role } = this.state;
        return (
            <div style={{ height: '100%', maxHeight: '100%' }}>
                {/* <Router>
          <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/secret">Secret</Link></li>
          </ul> 
          <Route path="/" exact component={Home} />
          <Route path="/secret" component={Secret} />
        </Router> */}
                <Drawer />
                {/* <Router>
                    <Navigation>
                        {role === 'student' ? (
                            <div>
                                <Link to="/">Начало</Link>
                                <Link to="/tests">Tests</Link>
                                <Link to="/exams">Exams</Link>
                            </div>
                        ) : ''}
                        {role === 'teacher' ? (
                            <div>
                                <Link to="/dash/">Начало</Link>
                                <Link to="/dash/tests">Тестове</Link>
                                <Link to="/dash/exams">Изпити</Link>
                                <Link to="/dash/students">Students</Link>
                            </div>
                        ) : ''}
                        {this.token ? <LogoutButton onClick={this.logout} /> : <RegisterButton />}
                    </Navigation>
                    <div style={{ height: 'calc(100% - 64px)', maxHeight: 'calc(100% - 64px)' }}>
                        <Route exact={true} path="/" component={auth(() => <Home />)} />
                        <Route exact={true} path="/tests" component={auth(Tests)} />
                        <Route exact={true} path="/exams" component={auth(Exams)} />
                        <Route path="/register" component={Register} />
                        <Route path="/login" component={Login} />
                        <Route path="/tests/:testId" component={auth(TemplateComponent)} />
                        <Route path="/exams/:examId" component={auth(TemplateComponent)} />
                        <Route exact path="/dash" component={auth(Dashboard)} />
                        <Route exact path="/dash/tests" component={auth(AdminTests)} />
                        <Route exact path="/dash/exams" component={auth(AdminExams)} />
                        <Route exact path="/dash/students" component={auth(Students)} />
                    </div>
                </Router> */}
            </div>
        );
    }
}

export default withStyles(styles)(App);