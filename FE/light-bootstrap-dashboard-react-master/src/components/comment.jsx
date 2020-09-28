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
import axios from "axios";

export class Comment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comment: "",
            name: ""
        }
    }

    submitComment() {
        const data = {
            data: {
                content: this.state.comment,
                name: this.state.name,
            },
            id: this.props.messageId
        }
        axios.post("http://localhost:5000/comment", data).then(() => {
            this.setState(
                {
                    comment: "",
                    name: ""
                }
            )
            this.props.rFunc();
        });
    }

    changeComment(e) {
        this.setState({ comment: e.target.value });
    }

    changeName(e) {
        this.setState({ name: e.target.value });
    }

    render() {
        return (
            <div className="typo-line">
                <p className="category">Add a comment</p>
                <blockquote>
                    <input placeholder="Comment" value={this.state.comment} onChange={this.changeComment.bind(this)}></input>
                    <small>
                        <input placeholder="Name" value={this.state.name} onChange={this.changeName.bind(this)}></input>
                    </small>
                    <button onClick={this.submitComment.bind(this)}>Add</button>
                </blockquote>
            </div>

        )
    }

} export default Comment;
