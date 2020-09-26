import React, { Component } from 'react';
import logo from './logo.svg';
import Content from "./Content.js"
// import SideBar from "./Content.js"
import TopBar from "./Content.js"

import {Grommet, grommet, Grid, Button, Nav, Sidebar} from "grommet";
import axios from "axios";
import {Book, Chat, Folder} from "grommet-icons"

class App extends Component{
  constructor(props) {
    super(props)
    this.state = {
      page : "",
      pageData : null
    };
  }

  componentDidMount() {
    //LOAD onboarding 
    this.navGetPage();
  }

  async getPageReq(nameOfPage) {
    // var backendURL = "localhost:"
  }

  navGetPage = (nameOfPage) => {
    this.setState({
      page: nameOfPage
    })
  }

  NavBar = () => (
    <Nav gap="large">
      <Button icon={<Book/>} onClick={this.navGetPage("Education")}/>
      <Button icon={<Chat/>} onClick={this.navGetPage("Communication")}/>
      <Button icon={<Folder/>} onClick={this.navGetPage("Resources")}/>

    </Nav>
  );

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
        areas={[["side", "content"]]}
        >
          <Sidebar gridArea="side">
            <this.NavBar/>
          </Sidebar>
  
          <this.getPage/>
  
        </Grid>
      </Grommet>
    );
  }
}

export default App;
