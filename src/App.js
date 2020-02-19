import React from 'react';
import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom"; //npm install react-router-dom (下载react router)

import { Home } from './components/home';
import { Score } from './components/score';

function Zkzh() {
  return (
    <div>
      <p>
        找回准考证号页面
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
              <div className="home" >
                <div>
                  <Home />
                </div>
              </div>
            </Route>
            <Route path="/score">
              <div className="score">
                <Score />  
              </div>
            </Route>
          </Switch>
      </Router>

    </div>
  );
}

export default App;

