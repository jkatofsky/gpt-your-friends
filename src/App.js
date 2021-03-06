import React from 'react';
import './App.css';
import Header from './header';
import Body from './body';
import Footer from './footer';

function App(props) {
    return <div className="App">
        <Header />
        <hr />
        <Body />
        <hr />
        <Footer />
    </div>
}

export default App;
