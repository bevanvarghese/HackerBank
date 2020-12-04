import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

// const TopBar = ({ viewHot, searchTerm, handleChange, loggedIn, logout }) => {
//   return (

//   );
// };

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false,
      uid: '',
      uname: '',
      questions: [],
      space: ['Algorithm', 'Machine Learning', 'System', 'JavaScript'],
      sort: 'time',
      search: '',
      expandedQuestionId: '',
    };

    fetch(`http://localhost:8000/questions`)
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        if (data) {
          this.setState({
            questions: data,
          });
        }
      })
      .catch((err) => console.log(err));

    if (localStorage.getItem('uid') != null) {
      this.setState({
        uid: localStorage.getItem('uid'),
        uname: localStorage.getItem('uname'),
        loggedIn: true,
      });
    }
  }

  logout = (event) => {
    localStorage.clear();
    this.setState({ uid: '', uname: '', loggedIn: false });
  };

  convertTimeToDate = (date) => {
    return (
      date.substr(8, 2) + '/' + date.substr(5, 2) + '/' + date.substr(0, 4)
    );
  };

  viewHot = () => {
    this.setState({ sort: 'upvotes' });
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSpace = (event) => {
    this.setState({ space: [event.target.name] });
    console.log(this.state.space);
  };

  render() {
    // const right = ;

    // console.log(this.state.questions);

    const topbar = (
      <div className='topbar'>
        <Link to='/'>Home</Link>
        <button onClick={this.viewHot}>Hot</button>
        <input
          type='text'
          name='search'
          onChange={this.handleChange}
          value={this.state.search}
        ></input>
        {this.state.loggedIn ? (
          <Link to={this.logout}>Logout</Link>
        ) : (
          <Fragment>
            <Link to='/login'>Login</Link>
            <Link to='/register'>Register</Link>
          </Fragment>
        )}
      </div>
    );

    const sidebar = (
      <div className='sidebar'>
        <ul>
          <button
            name='Algorithm'
            onClick={this.handleSpace}
            className={
              this.state.space == ['Algorithm']
                ? 'activeSpace'
                : 'inactiveSpace'
            }
          >
            Algorithm
          </button>
          <button
            name='Machine Learning'
            onClick={this.handleSpace}
            className={
              this.state.space == ['Machine Learning']
                ? 'activeSpace'
                : 'inactiveSpace'
            }
          >
            Machine Learning
          </button>
          <button
            name='System'
            onClick={this.handleSpace}
            className={
              this.state.space == ['System'] ? 'activeSpace' : 'inactiveSpace'
            }
          >
            System
          </button>
          <button
            name='JavaScript'
            onClick={this.handleSpace}
            className={
              this.state.space == ['JavaScript']
                ? 'activeSpace'
                : 'inactiveSpace'
            }
          >
            JavaScript
          </button>
        </ul>
      </div>
    );

    const searchQuery = this.state.search.toLowerCase();

    const questionCards = this.state.questions
      .filter((question) => this.state.space.includes(question.space))
      .filter(
        (question) =>
          searchQuery == '' ||
          question.title.toLowerCase().includes(searchQuery)
      )
      .map((question) => (
        <div className='questionCardMain'>
          <div className='questionHeadMain'>
            <span className='questionSpace' style={{ float: 'none' }}>
              {question.space}
            </span>
          </div>
          <div className='questionFloat'>
            <div className='questionLeft'>
              <span className='questionAsker'>{question.creatorName}</span>
              <span className='createdOn'>
                {this.convertTimeToDate(question.time)}
              </span>
            </div>
            <div className='questionRight'>
              <p className='questionTitle'>{question.title}</p>
              <p className='questionContent'>{question.content}</p>
            </div>
          </div>
          <div className='questionFooter'></div>
        </div>
      ));

    return (
      <div>
        {topbar}
        {sidebar}
        {questionCards}
      </div>
    );
  }
}

export default Main;
