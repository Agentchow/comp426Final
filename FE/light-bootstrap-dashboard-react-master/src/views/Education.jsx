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
import axios from 'axios';
import Card from "components/Card/Card";
import { iconsArray } from "variables/Variables.jsx";
import Axios from "axios";
import { Button } from "react-bootstrap/lib/InputGroup";
import { Line } from 'rc-progress';

class Education extends Component {
  state = {
    modules: [],
    selected: null,
    level: 1,
    percent: 0
  }

  componentDidMount() {
    axios.get(`http://localhost:5000/modules`)
      .then(res => {
        const modules = res.data;
        this.setState({ modules: modules });
      })
  }

  render() {

    return (
      <div className="content">

        <div>
        <h2>Finish Modules to Level Up!</h2>
        <h3>Level {this.state.level}</h3>
        <Line percent={this.state.percent} strokeWidth="2" strokeColor="#0da636" />
        <br></br>
        <br></br>

        </div>

        <Grid fluid>
          <Row>
            <Col md={12}>
              <Card
                title="MyPath Modules"
                ctAllIcons
                category={
                  <span>
                    To help you on your journey to financial security and generational wealth.
                  </span>
                }
                content={
                  this.getContent()
                }
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }

  makeSelected(prop) {
    this.setState({ selected: prop })
  }

  getContent() {
    if (this.state.selected === null) {
      return this.allView();
    } else {
      return this.specificView();
    }
  }

  specificView() {
    return (
      <div>
        <h2>Module {this.state.selected.moduleNumber}: {this.state.selected.moduleName}</h2>
        <span>{this.state.selected.description}</span>
        {this.state.selected.sections.map((prop, key) => {
          return (
            <div>
              <h3>{prop.name}</h3>
              <p>{prop.content}</p>
            </div>
          );
        })}
        <button onClick={() =>{
        var num = this.state.percent;
        var level = this.state.level;
        num += 50
        if (num == 100) {
          level += 1
          num = 0
        }
        this.setState({
          selected: null,
          percent: num,
          level: level
          })
          
          }}>Done</button>
      </div>
    );
  }

  allView() {
    return <Row>
      {this.state.modules.map((prop, key) => {
        return (
          <Col
            lg={3}
            md={3}
            sm={4}
            xs={6}
            className="font-icon-list"
            key={key}
          >
            <div className="font-icon-detail" onClick={() => this.makeSelected(prop)}>
              <i className={prop["iconName"]} />
              <input type="text" defaultValue={prop["moduleName"]} />
            </div>
          </Col>
        );
      })
      }
    </Row >;
  }
}

export default Education;
