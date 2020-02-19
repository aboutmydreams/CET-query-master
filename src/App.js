import React from 'react';
import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom"; //npm install react-router-dom (下载react router)

import { Home } from './components/home'

function Zkzh() {
  return (
    <div>
      <p>
        找回准考证号页面
      </p>
    </div>
  )
}

function Score() {
  return (
    <div>
      <p>
        成绩显示页面
      </p>
    </div>
  )
}

function App() {
  return (
    <div>
      <Router>
      <Switch>
          <Route exact path="/">
            <div className="App">
              <div>
                <Home />
              </div>
            </div>
          </Route>
          <Route path="/zkzh">
            <Zkzh />
          </Route>
          <Route path="/score">
            <Score />
          </Route>
          </Switch>
      </Router>

    </div>
  );
}

export default App;

