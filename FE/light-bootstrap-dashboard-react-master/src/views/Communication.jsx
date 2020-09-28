/*!

=========================================================
* Light Bootstrap Dashboard React - v1.3.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import axios from "axios";
import Comment from "components/comment.jsx"

import Card from "components/Card/Card.jsx";

class Communication extends Component {

  state = {
    messages: [],
    selected: null,
    newTitle: "",
    newEmail: "",
    newName: "",
    newMessage: "",
    showQuest: false,
    comments: [],

  }
  handleChangeTitle(e) {
    this.setState({ newTitle: e.target.value });
  }
  handleChangeEmail(e) {
    this.setState({ newEmail: e.target.value });
  }
  handleChangeMessage(e) {
    this.setState({ newMessage: e.target.value });
  }
  handleChangeName(e) {
    this.setState({ newName: e.target.value });
  }

  componentDidMount() {
    this.refresh();
  }
  refresh() {
    axios.get(`http://localhost:5000/message`)
      .then(res => {
        const messages = res.data;
        this.setState({ messages: messages });

      })
  }

  submitComment(messageId, messageId2) {
    const val1 = document.getElementById(messageId).value;
    const val2 = document.getElementById(messageId2).value;
    axios.post("http://localhost:5000/comment", {}).then(() => {
      this.refresh();
    });
  }

  submit() {
    const data = {
      title: this.state.newTitle,
      message: this.state.newMessage,
      sender: this.state.newName,
      email: this.state.email
    };
    axios.post("http://localhost:5000/message", data).then(() => {
      this.setState({
        newTitle: "",
        newEmail: "",
        newName: "",
        newMessage: ""
      });
      this.refresh();
    });
  }

  toggleShowQuestion() {
    this.setState({
      showQuest: !this.state.showQuest
    });
  }

  render() {
    let sQ = this.state.showQuest;
    return (
      <div className="content">
        <div>
          <Grid fluid onClick={this.toggleShowQuestion.bind(this)}>
            <Row>
              <Col md={12}>

                <Card
                  title="Ask a Question"
                  category=""
                  content={
                    <div>
                      <div className="typo-line">
                        <p className="category">Question?</p>
                        <blockquote>
                          <input value={this.state.newTitle} onChange={this.handleChangeTitle.bind(this)} placeholder="Title" style={{ marginBottom: 1 + 'em' }}></input>
                          <br />
                          <textarea value={this.state.newMessage} onChange={this.handleChangeMessage.bind(this)} placeholder="Message" style={{ marginBottom: 1 + 'em' }}></textarea>
                          <br />
                          <input value={this.state.newName} onChange={this.handleChangeName.bind(this)} placeholder="Name"></input>
                          <br />
                          <input value={this.state.newEmail} onChange={this.handleChangeEmail.bind(this)} placeholder="Email"></input>
                        </blockquote>
                        <button onClick={this.submit.bind(this)}>Submit</button>
                      </div>
                    </div>
                  }
                />
              </Col>
            </Row>
          </Grid>
        </div>
        {this.state.messages.map((prop, key) => {
          const messageId = prop.id;
          return (
            <div>
              <Grid fluid key={key}>
                <Row>
                  <Col md={12}>
                    <Card
                      title={prop.title}
                      category={prop.email}
                      content={
                        <div>
                          <div className="typo-line">
                            <p className="category">Question?</p>
                            <blockquote>
                              <p style={{ fontSize: 18 }}>
                                {prop.message}
                              </p>
                              <small>{prop.sender}</small>
                            </blockquote>
                          </div>
                          <div className="typo-line">
                            <p className="category">Comments</p>
                            <blockquote>
                              {prop.comments.map((comm, key2) => {

                                return (
                                  <div>
                                    <p>
                                      {comm.content}
                                    </p>
                                    <small>
                                      {comm.name}
                                    </small>
                                  </div>
                                )
                              })}
                            </blockquote>
                          </div>
                          <Comment messageId={messageId} rFunc={this.refresh.bind(this)}></Comment>

                        </div>
                      }
                    />
                  </Col>
                </Row>
              </Grid>
            </div>
          )
        })}
      </div>
    );
  }
}

export default Communication;
