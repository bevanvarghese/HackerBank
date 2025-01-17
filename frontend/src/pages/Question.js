import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import NavBack from '../components/NavBack';
import AnswerForm from '../components/AnswerForm';
import DeleteAnswer from '../components/DeleteAnswer';
import { BsFillTriangleFill, BsTriangle } from 'react-icons/bs';

const Answer = ({
  creatorId,
  creatorName,
  time,
  content,
  uid,
  deleteAnswer,
  aIndex,
  aid,
}) => {
  return (
    <div className='answerCard'>
      <div className='answerHead'>
        <span className='creator'>{creatorName}</span>
        <span className='createdOn'> answered on {time}</span>
        {uid == creatorId && (
          <span className='editDelete'>
            <button onClick={() => deleteAnswer(aIndex, aid)}>delete</button>
          </span>
        )}
      </div>
      <div className='answerBody'>
        <p className='answerContent'>{content}</p>
      </div>
    </div>
  );
};

class Question extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uid: '',
      uname: '',
      qid: this.props.match.params.qid,
      space: '',
      title: '',
      content: '',
      time: '',
      askerId: '',
      askerName: '',
      answers: [],
      upvotes: [],
      answer: '',
      edit: false,
      errors: '',
    };

    this.convertTimeToDate = this.convertTimeToDate.bind(this);
    this.deleteQuestion = this.deleteQuestion.bind(this);
    this.deleteAnswer = this.deleteAnswer.bind(this);
    this.showEdit = this.showEdit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.likeQuestion = this.likeQuestion.bind(this);
    this.unlikeQuestion = this.unlikeQuestion.bind(this);
    this.handleAnsFormChange = this.handleAnsFormChange.bind(this);
    this.submitAnswer = this.submitAnswer.bind(this);

    const qid = this.props.match.params.qid;
    fetch(`http://localhost:8000/questions/${qid}`)
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          this.setState({
            space: data.space,
            title: data.title,
            content: data.content,
            time: this.convertTimeToDate(data.time),
            askerId: data.creatorId,
            askerName: data.creatorName,
            answers: data.answers,
            upvotes: data.upvotes,
            ansFormOpen: false,
            ansFormValue: '',
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
      });
    }
  }

  convertTimeToDate = (date) => {
    return (
      date.substr(8, 2) + '/' + date.substr(5, 2) + '/' + date.substr(0, 4)
    );
  };

  deleteQuestion = (event) => {
    event.preventDefault();
    fetch(`http://localhost:8000/questions/delete/${this.state.qid}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((res) => this.props.history.push('/'));
  };

  showEdit = (event) => {
    this.setState({ edit: true });
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSelect = (event) => {
    this.setState({
      space: event.target.value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const question = {
      title: this.state.title,
      space: this.state.space,
      content: this.state.content,
    };
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(question),
    };

    if (
      question.title == '' ||
      question.space == '' ||
      question.content == ''
    ) {
      this.setState({ errors: 'Fields cannot be empty.' });
    } else {
      this.setState({ errors: '' });
      fetch(
        `http://localhost:8000/questions/edit/${this.state.qid}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            this.setState({ errors: data.error });
          } else if (data.message) {
            this.setState({
              title: question.title,
              content: question.content,
              space: question.space,
              edit: false,
            });
          }
        })
        .catch((err) =>
          this.setState({ errors: 'Something went wrong. Please try again.' })
        );
    }
  };

  likeQuestion = (event) => {
    const like = { uid: this.state.uid };
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(like),
    };
    fetch(
      `http://localhost:8000/questions/like/${this.state.qid}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.log({ errors: data.error });
        } else if (data.message) {
          this.setState({
            upvotes: [...this.state.upvotes, this.state.uid],
          });
        }
      });
  };

  unlikeQuestion = (event) => {
    const unlike = { uid: this.state.uid };
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(unlike),
    };
    var tempUpvotes = [...this.state.upvotes];
    tempUpvotes.splice(tempUpvotes.indexOf(this.state.uid), 1);
    fetch(
      `http://localhost:8000/questions/unlike/${this.state.qid}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.log({ errors: data.error });
        } else if (data.message) {
          this.setState({
            upvotes: tempUpvotes,
          });
        }
      });
  };

  handleAnsFormChange = (event) => {
    this.setState({ ansFormValue: event.target.value });
  };

  submitAnswer = (e) => {
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
    fetch(
      `http://localhost:8000/answers/create/${this.state.qid}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          var temp = this.state.answers;
          const ans = {
            content: this.state.ansFormValue,
            creatorId: this.state.uid,
            creatorName: this.state.uname,
            time: new Date().toISOString(),
            aid: data.aid,
          };
          temp = [...temp, ans];
          this.setState({
            answers: temp,
            ansFormOpen: false,
            ansFormValue: '',
          });
        }
      });
  };

  deleteAnswer = (aIndex, aid) => {
    fetch(`http://localhost:8000/answers/delete/${aid}`, {
      method: 'DELETE',
    })
      .then((res) => res.json()) // or res.json()
      .then((res) => {
        var temp = this.state.answers;
        temp.splice(aIndex, 1);
        this.setState({ asnwers: temp });
      });
  };

  render() {
    console.log(this.state.answers);
    const editAndDel =
      this.state.uid == this.state.askerId ? (
        <span className='editDelete'>
          <button onClick={this.showEdit}>edit</button>
          <button onClick={this.deleteQuestion}>delete</button>
        </span>
      ) : (
        ''
      );

    let voteButton = !this.state.uid ? (
      <button className='voteButton' disabled='true'>
        <BsTriangle />
        <span> Upvote</span>
      </button>
    ) : this.state.upvotes.includes(this.state.uid) ? (
      <button className='voteButton' onClick={this.unlikeQuestion}>
        <BsFillTriangleFill />
        <span> Unvote</span>
      </button>
    ) : (
      <button className='voteButton' onClick={this.likeQuestion}>
        <BsTriangle />
        <span> Upvote</span>
      </button>
    );

    const questionCard = this.state.edit ? (
      <div className='questionCard'>
        <form>
          Title
          <br />
          <input
            type='text'
            id='title'
            name='title'
            value={this.state.title}
            onChange={this.handleChange}
            required
          />
          <br />
          <br />
          Space
          <br />
          <input
            type='radio'
            name='space'
            value='Algorithm'
            defaultChecked={this.state.space == 'Algorithm'}
            onClick={this.handleSelect}
            required
          />
          Algorithm
          <input
            type='radio'
            name='space'
            value='Machine Learning'
            defaultChecked={this.state.space == 'Machine Learning'}
            onClick={this.handleSelect}
            required
          />
          Machine Learning
          <input
            type='radio'
            name='space'
            value='System'
            defaultChecked={this.state.space == 'System'}
            onClick={this.handleSelect}
            required
          />
          System
          <input
            type='radio'
            name='space'
            value='JavaScript'
            defaultChecked={this.state.space == 'JavaScript'}
            onClick={this.handleSelect}
            required
          />
          JavaScript
          <br />
          <br />
          Content
          <br />
          <textarea
            id='content'
            name='content'
            rows='4'
            cols='50'
            value={this.state.content}
            onChange={this.handleChange}
            required
          />
          <br />
          <br />
          <button className='editQuestionButton' onClick={this.handleSubmit}>
            Submit
          </button>
        </form>
        <p style={{ color: 'red' }}>{this.state.errors}</p>
      </div>
    ) : (
      <div className='questionCard'>
        <div className='questionHead'>
          {voteButton}
          <span> ({this.state.upvotes.length})</span>
          {editAndDel}
        </div>
        <div className='questionMain'>
          <span className='creator'>{this.state.askerName}</span>
          <span className='createdOn'> posted on {this.state.time}</span>
          <span className='questionSpace'>{this.state.space}</span>
        </div>
        <div className='questionBody'>
          <p className='questionTitle'>{this.state.title}</p>
          <p className='questionContent'>{this.state.content}</p>
        </div>
      </div>
    );

    const answerCards = this.state.answers.map((answer) => (
      <Answer
        key={answer.answerId}
        creatorName={answer.creatorName}
        content={answer.content}
        time={
          answer.time.substr(8, 2) +
          '/' +
          answer.time.substr(5, 2) +
          '/' +
          answer.time.substr(0, 4)
        }
        creatorId={answer.creatorId}
        uid={this.state.uid}
        aid={answer.aid}
        deleteAnswer={this.deleteAnswer}
        aIndex={this.state.answers.indexOf(answer)}
        aid={answer.aid}
      />
    ));

    console.log(this.state.answers);

    return (
      <Fragment>
        <NavBack />
        <div style={{ width: '90%', marginLeft: 'auto', marginRight: 'auto' }}>
          {questionCard}
          {answerCards}
          {this.state.uid != '' &&
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
                        this.submitAnswer(e);
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
      </Fragment>
    );
  }
}

export default Question;
