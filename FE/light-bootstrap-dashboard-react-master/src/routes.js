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
import Communication from "views/Communication.jsx";
import TableList from "views/TableList.jsx";
import Analytics from "views/Analytics.jsx"
import Education from "views/Education.jsx";
import Onboarding from "views/Onboarding.jsx";
import Simulations from "views/Simulations.jsx";

const dashboardRoutes = [
  {
    path: "/onboarding",
    name: "Onboarding",
    icon: "pe-7s-map-2",
    component: Onboarding,
    layout: "/admin"
  },
  {
    path: "/dashboard",
    name: "Education",
    icon: "pe-7s-study",
    component: Education,
    layout: "/admin"
  },
  {
    path: "/simulations",
    name: "simulations",
    icon: "pe-7s-plugin",
    component: Simulations,
    layout: "/admin"
  },
  {
    path: "/user",
    name: "Communication",
    icon: "pe-7s-speaker",
    component: Communication,
    layout: "/admin"
  },
  {
    path: "/table",
    name: "Resources",
    icon: "pe-7s-bookmarks",
    component: TableList,
    layout: "/admin"
  },
  {
    path: "/typography",
    name: "Analytics",
    icon: "pe-7s-display1",
    component: Analytics,
    layout: "/admin"
  }
];

export default dashboardRoutes;
