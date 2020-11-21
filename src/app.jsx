import React from 'react';
export default class App extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <React.Fragment>
                <header className="header">App Header</header>
                <section className="body">                    
                    <h1 className="title">Hello and Welcome</h1>
                </section>
                <footer className="header">App Footer</footer>
            </React.Fragment>
        )
    }
}