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
import ChartistGraph from "react-chartist";
import { Grid, Row, Col } from "react-bootstrap";

import { Card } from "components/Card/Card.jsx";
import { StatsCard } from "components/StatsCard/StatsCard.jsx";
import { Tasks } from "components/Tasks/Tasks.jsx";
import axios from "axios";
import {
  dataPie,
  legendPie,
  dataSales,
  optionsSales,
  responsiveSales,
  legendSales,
  dataBar,
  optionsBar,
  responsiveBar,
  legendBar
} from "variables/Variables.jsx";

class Analytics extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pie_chart_data : null,
      users : 0,
      data_line: null
    }
  }

  componentDidMount() {
    console.log("here")

    axios.get("http://127.0.0.1:5000/sentiment")
    .then(res => {
      console.log(res);
      var dataPie = {
        labels: [res.data["positive_str"],res.data["negative_str"],res.data["neutral_str"]],
        series: [res.data["positive"],res.data["negative"],res.data["neutral"]]
      };
      this.setState({
        pie_chart_data: dataPie
      })
    })

    axios.get("http://127.0.0.1:5000/usersCount")
    .then(res => {
      console.log(res.data);
      
      this.setState({
        users: res.data
      })
    })

    axios.get("http://127.0.0.1:5000/messageCounts")
    .then(res => {
      console.log(res.data);
      this.setState({
        data_line: {
          labels: [
            "09/20",
            "09/21",
            "09/22",
            "09/23",
            "09/24",
            "09/25",
            "09/26",
          ],
          series: res.data
        }
      })
    })


  }

  createLegend(json) {
    var legend = [];
    for (var i = 0; i < json["names"].length; i++) {
      var type = "fa fa-circle text-" + json["types"][i];
      legend.push(<i className={type} key={i} />);
      legend.push(" ");
      legend.push(json["names"][i]);
    }
    return legend;
  }
  render() {
    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col lg={4} sm={6}>
            {
            this.state.users == 0
              ? <p> Loading...</p>
              : <StatsCard
              bigIcon={<i className="pe-7s-users" />}
              statsText="Active MyPath Users"
              statsValue={this.state.users}
              statsIcon={<i className="fa fa-refresh" />}
              statsIconText="Update Now"
            />

            }
              
            </Col>
            <Col lg={4} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-wallet text-success" />}
                statsText="Estimated Generational Wealth"
                statsValue="$1,921,345"
                statsIcon={<i className="fa fa-calendar-o" />}
                statsIconText="Last day"
              />
            </Col>
            <Col lg={4} sm={6}>
              <StatsCard
                bigIcon={<i className="fa fa-book text-info" />}
                statsText="Modules Completed Today"
                statsValue="+96"
                statsIcon={<i className="fa fa-refresh" />}
                statsIconText="Updated now"
              />
            </Col>
          </Row>
          <Row>
            <Col md={8}>
              <Card
                statsIcon="fa fa-history"
                id="chartHours"
                title="Student and Alumni Engagement"
                category="This Month"
                stats="Updated Now"
                content={
                  <div className="ct-chart">
                    {
                    !this.state.data_line
                      ? <p> Loading...</p>
                      : <ChartistGraph
                      data={this.state.data_line}
                      type="Line"
                      options={optionsSales}
                      responsiveOptions={responsiveSales}
                    />

                    }
                    
                  </div>
                }
                legend={
                  <div className="legend">{this.createLegend(legendSales)}</div>
                }
              />
            </Col>
            <Col md={4}>
              <Card
                statsIcon="fa fa-clock-o"
                title="Message Sentiment Analysis"
                category="How are students doing?"
                stats="Calculated Now"
                content={
                  <div
                    id="chartPreferences"
                    className="ct-chart ct-perfect-fourth"
                  >
                    {
                      !this.state.pie_chart_data
                        ? <p> Loading...</p>
                        : <ChartistGraph data={this.state.pie_chart_data} type="Pie" />

                    }
                  </div>
                }
                legend={
                  <div className="legend">{this.createLegend(legendPie)}</div>
                }
              />
            </Col>
          </Row>

        </Grid>
      </div>
    );
  }
}

export default Analytics;
