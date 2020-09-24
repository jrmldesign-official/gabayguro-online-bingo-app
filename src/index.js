import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Login from './Login';
import Register from './Register';
import Admin from './components/Admin';
import AdminDashboard from './components/Admin/AdminDashboard';
import AdminBingo from './components/Admin/AdminGaming';
import Game from './components/Player/Game';
import Player_Dashboard from './components/Player';
import ProtectedRoute from './ProtectedRoute';
import { Route, BrowserRouter, Switch, Redirect } from 'react-router-dom';

ReactDOM.render((
  <BrowserRouter>
      <Switch>
          <ProtectedRoute exact={true} path="/" component={Player_Dashboard} />
          <Route exact path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/admin" component={Admin} />
          <ProtectedRoute exact={true} path="/game" component={Game} />
          <ProtectedRoute exact={true} path="/admin-dashboard" component={AdminDashboard} />
          <ProtectedRoute exact={true} path="/admin-bingo" component={AdminBingo} />
          <Redirect to="/" />
      </Switch>
  </BrowserRouter>
), document.getElementById('root'));