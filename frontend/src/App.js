import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AuthRoute from './components/AuthRoute';
import UnAuthRoute from './components/UnAuthRoute';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path='/' component={main} />
        <UnAuthRoute path='/register' component={register} />
        <UnAuthRoute path='/login' component={login} />
        <AuthRoute path='/ask' component={ask} />
        <Route path='/question/:qid' component={question} />
      </Switch>
    </Router>
  );
}

export default App;
