import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { BsFillTriangleFill, BsTriangle, BsCheckCircle } from 'react-icons/bs';
import ShowMoreText from 'react-show-more-text';

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false,
      uid: '',
      uname: '',
      questions: [],
      space: ['Algorithm', 'Machine Learning', 'System', 'JavaScript'],
      search: '',
      expandedQuestionId: '',
      ansFormOpen: false,
      ansFormValue: '',
    };

    this.logout = this.logout.bind(this);
    this.viewHot = this.viewHot.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSpace = this.handleSpace.bind(this);
    this.likeQuestion = this.likeQuestion.bind(this);
    this.unlikeQuestion = this.unlikeQuestion.bind(this);
    this.handleExpansion = this.handleExpansion.bind(this);
    this.submitAnswer = this.submitAnswer.bind(this);
    this.redirectToAsk = this.redirectToAsk.bind(this);
    this.convertTimeToDate = this.convertTimeToDate.bind(this);

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
  }

  componentDidMount() {
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
    var temp = this.state.questions;
    temp = temp.sort((a, b) => b.upvotes.length - a.upvotes.length);
    this.setState({ questions: temp });
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSpace = (event) => {
    this.setState({ space: [event.target.name] });
    console.log(this.state.space);
  };

  redirectToAsk = (event) => {
    this.props.history.push('/ask');
  };

  likeQuestion = (qid, qIndex) => {
    const like = { uid: this.state.uid };
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(like),
    };
    fetch(`http://localhost:8000/questions/like/${qid}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.log({ errors: data.error });
        } else if (data.message) {
          var temp = this.state.questions;
          temp[qIndex]['upvotes'] = [
            ...temp[qIndex]['upvotes'],
            this.state.uid,
          ];
          this.setState({
            questions: temp,
          });
        }
      });
  };

  unlikeQuestion = (qid, qIndex) => {
    const like = { uid: this.state.uid };
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(like),
    };
    fetch(`http://localhost:8000/questions/unlike/${qid}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.log({ errors: data.error });
        } else if (data.message) {
          var temp = this.state.questions;
          temp[qIndex]['upvotes'].splice(
            temp[qIndex]['upvotes'].indexOf(this.state.uid),
            1
          );
          this.setState({
            questions: temp,
          });
        }
      });
  };

  handleExpansion = (qid) => {
    if (this.state.expandedQuestionId == qid) {
      this.setState({ expandedQuestionId: '' });
    } else {
      this.setState({
        expandedQuestionId: qid,
        ansFormOpen: false,
        ansFormValue: '',
      });
    }
  };

  handleAnsFormChange = (event) => {
    this.setState({ ansFormValue: event.target.value });
  };

  submitAnswer = (qid, qIndex, e) => {
    e.preventDefault();
    const answer = {
      content: this.state.ansFormValue,
      creatorId: this.state.uid,
      creatorName: this.state.uname,
    };
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(answer),
    };
    fetch(`http://localhost:8000/answers/create/${qid}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          var temp = this.state.questions;
          const ans = {
            content: this.state.ansFormValue,
            creatorId: this.state.uid,
            creatorName: this.state.uname,
            time: new Date().toISOString(),
          };
          console.log(ans.time);
          temp[qIndex]['answers'] = [...temp[qIndex]['answers'], ans];
          this.setState({
            questions: temp,
            ansFormOpen: false,
            ansFormValue: '',
          });
        }
      });
  };

  render() {
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
          <button onClick={this.logout}>Logout</button>
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

    console.log(this.state.questions);

    const questionCards = this.state.questions
      .filter((question) => this.state.space.includes(question.space))
      .filter(
        (question) =>
          searchQuery == '' ||
          question.title.toLowerCase().includes(searchQuery)
      )
      .map((question) => (
        <div>
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
                <p
                  className='questionTitle'
                  onClick={() =>
                    this.props.history.push(`/question/${question.qid}`)
                  }
                  style={{ cursor: 'pointer' }}
                >
                  {question.title}
                </p>
                <ShowMoreText
                  lines={3}
                  more='Show More'
                  less='Show Less'
                  className='questionContent'
                  anchorClass='showMore'
                  onClick={() => this.executeOnClick}
                  expanded={false}
                  width={0}
                >
                  {question.content}
                </ShowMoreText>
              </div>
            </div>
            <div className='questionFooter'>
              {!this.state.uid ? (
                <button className='voteButton' disabled='true'>
                  <BsTriangle />
                  <span> Upvote</span>
                </button>
              ) : question.upvotes.includes(this.state.uid) ? (
                <button
                  className='voteButton'
                  onClick={() =>
                    this.unlikeQuestion(
                      question.qid,
                      this.state.questions.indexOf(question)
                    )
                  }
                >
                  <BsFillTriangleFill />
                  <span> Unvote</span>
                </button>
              ) : (
                <button
                  className='voteButton'
                  onClick={() =>
                    this.likeQuestion(
                      question.qid,
                      this.state.questions.indexOf(question)
                    )
                  }
                >
                  <BsTriangle />
                  <span> Upvote</span>
                </button>
              )}
              <small>({question.upvotes.length}) </small>
              <button
                className='voteButton'
                onClick={() => this.handleExpansion(question.qid)}
              >
                <BsCheckCircle />
                <span> Answers</span>
              </button>
              <small>({question.answers.length})</small>
            </div>
          </div>
          {this.state.expandedQuestionId == question.qid &&
            question.answers.map((answer) => (
              <div className='answerCard'>
                <div className='answerHead'>
                  <span className='creator'>{answer.creatorName}</span>
                  <span className='createdOn'>
                    {' '}
                    answered on {this.convertTimeToDate(answer.time)}
                  </span>
                </div>
                <div className='answerBody'>
                  <p className='answerContent'>{answer.content}</p>
                </div>
              </div>
            ))}
          {this.state.loggedIn &&
            this.state.expandedQuestionId == question.qid &&
            (this.state.ansFormOpen ? (
              <div className='answerForm'>
                <div className='answerHead'>
                  <span className='creator'>{this.state.uname}</span>
                </div>
                <div>
                  <form>
                    <textarea
                      id='content'
                      name='content'
                      rows='4'
                      cols='50'
                      value={this.state.ansFormValue}
                      onChange={this.handleAnsFormChange}
                    />
                    <br />
                    <button
                      className='editQuestionButton'
                      disabled={this.state.ansFormValue == ''}
                      onClick={(e) => {
                        this.submitAnswer(
                          question.qid,
                          this.state.questions.indexOf(question),
                          e
                        );
                      }}
                    >
                      Submit
                    </button>
                    <button
                      className='editQuestionButton'
                      style={{ marginLeft: '10px' }}
                      onClick={() =>
                        this.setState({ ansFormValue: '', ansFormOpen: false })
                      }
                    >
                      Cancel
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className='answerForm'>
                <div className='answerHead'>
                  <span className='creator'>{this.state.uname}</span>
                </div>
                <div className='Placeholder'>
                  <p onClick={() => this.setState({ ansFormOpen: true })}>
                    Post your new answer...
                  </p>
                </div>
              </div>
            ))}
        </div>
      ));

    return (
      <div>
        {topbar}
        {sidebar}
        {this.state.loggedIn && (
          <Fragment>
            <button className='askQuestion' onClick={this.redirectToAsk}>
              Ask Question
            </button>
            <br />
            <div
              className='questionCard'
              style={{ marginTop: '20px', padding: '10px 20px' }}
            >
              <div className='answerHead'>
                <span className='creator'>{this.state.uname}</span>
                <div className='Placeholder'>
                  <p onClick={this.redirectToAsk} style={{ cursor: 'pointer' }}>
                    What is your question?
                  </p>
                </div>
              </div>
            </div>
          </Fragment>
        )}
        {questionCards}
      </div>
    );
  }
}

export default Main;
