import React, { Component } from 'react';
import logo from './logo.svg';
import Content from "./Content.js"
import SideBar from "./Content.js"
import TopBar from "./Content.js"

import {Grommet, grommet, Grid} from "grommet";
import axios from "axios";


class App extends Component{
  constructor(props) {
    this.state = {
      page = ""
    }
  }

  async getPageReq(nameOfPage) {

  }

  navGetPage = (nameOfPage) => {
    this.setState({
      page: nameOfPage
    })
    this.getPageReq(nameOfPage);
  }

  getPage = () => (
    <Content page={this.state.page}> </Content>
  );


  render() {
    return (
      <Grommet theme={grommet} full>
        <Grid
        fill
        rows={["100%"]}
        columns={["7%","92%"]}
        areas={[["sidebar", "content"]]}
        >
          <SideBar gridarea="sidebar">
            <this.SideBar></this.SideBar>
          </SideBar>
  
          <this.Content></this.Content>
  
        </Grid>
      </Grommet>
    );
  }
}

export default App;
