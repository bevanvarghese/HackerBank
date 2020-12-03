import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import NavBack from '../components/NavBack';
import AnswerForm from '../components/AnswerForm';
import DeleteAnswer from '../components/DeleteAnswer';

const Answer = ({ creatorId, creatorName, time, content, uid, aid }) => {
  return (
    <div className='answerCard'>
      <div className='answerHead'>
        <span className='creator'>{creatorName}</span>
        <span className='createdOn'> answered on {time}</span>
        {uid == creatorId && (
          <span className='editDelete'>
            <DeleteAnswer aid={aid} />
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
    };

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
      .then((res) => res.json()) // or res.json()
      .then((res) => this.props.history.push('/'));
  };

  render() {
    const editAndDel =
      this.state.uid == this.state.askerId ? (
        <span className='editDelete'>
          <button>edit</button>
          <button onClick={this.deleteQuestion}>delete</button>
        </span>
      ) : (
        ''
      );

    const questionCard = (
      <div className='questionCard'>
        <div className='questionHead'>
          <span className='upvotes'>
            ^ upvote ({this.state.upvotes.length})
          </span>
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

    //const editForm - state.edit ?

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
      />
    ));

    return (
      <Fragment>
        <NavBack />
        <div style={{ width: '90%', marginLeft: 'auto', marginRight: 'auto' }}>
          {questionCard}
          {answerCards}
          {this.state.uid != '' && (
            <AnswerForm
              uid={this.state.uid}
              uname={this.state.uname}
              qid={this.props.match.params.qid}
            />
          )}
        </div>
      </Fragment>
    );
  }
}

export default Question;
