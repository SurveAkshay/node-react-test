import React from 'react';
import './App.css';
import { Route, Switch } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './components/Home/Home';
import Category from './components/Category/Category';
import Products from './components/Products/Products';
import ErrorComponent from './components/Error/Error';

function App() {
  return (
    <>
      <Header />
      <main style={{'minHeight': '100vh','background': '#e1e1e1'}}>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/category">
            <Category />          
          </Route>
          <Route path="/products">
            <Products />          
          </Route>

          {/* load error component if route not found */}

          <Route path="*" exact component={ErrorComponent} />
          
        </Switch>
      </main>
    </>
  );
}

export default App;
