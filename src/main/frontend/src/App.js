import React, { Component } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WebSocketProvider } from './WebsocketContext';
import Login from './login.js';
import Main from './main.js';
import Friend from './friend.js';
import Project from './project.js';
import Auth from "./auth";
import Topic from "./topic";
import Part from "./part";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path = "/" element = {<Main />}></Route>
          <Route path = "/login" element = {<Login />}></Route>
          <Route path = "/friend" element = {<Auth><Friend /></Auth>}></Route>
          <Route path = "/project" element = {<Auth><Project /></Auth>}></Route>
          <Route path = "/topic" element = {<WebSocketProvider><Topic /></WebSocketProvider>}></Route>
          <Route path = "/part" element = {<WebSocketProvider><Part /></WebSocketProvider>}></Route>
          {/*일치하는 라우트가 없는경우 처리 <Route path="/*" element={<NotFound />}></Route> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;