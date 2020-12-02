import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AuthRoute from './components/AuthRoute';
import UnAuthRoute from './components/UnAuthRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Ask from './pages/Ask';
import Question from './pages/Question';
import Main from './pages/Main';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path='/' component={Main} />
        <UnAuthRoute path='/register' component={Register} />
        <UnAuthRoute path='/login' component={Login} />
        <AuthRoute path='/ask' component={Ask} />
        <Route path='/question/:qid' component={Question} />
      </Switch>
    </Router>
  );
}

export default App;
