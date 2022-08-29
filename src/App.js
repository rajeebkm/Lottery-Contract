import logo from "./logo.svg";
import "./App.css";
import React from "react";
import web3 from './web3';
import lottery from "./lottery";

class App extends React.Component {

  // constructor(props){
  //   super(props);

  //   this.state = { manager: '' };
  // }

  state = {
    manager : '',
    players: [],
    balance: '',
    value: '',
    message: '',
    winner: ''
  };

  async componentDidMount(){
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ manager, players, balance });
  }

  onSubmit = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Waiting on transaction success ...' });

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')  
    });

    this.setState({ message: 'You have been entered!' });

  };

  onClick = async () => {

    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Waiting on transaction success ...' });

    await lottery.methods.pickWinner().send({
      from: accounts[0],  
    });

    const winner = await lottery.methods.winner().call();


    this.setState({ message: 'A winner has been picked!', winner: winner });

  }


  render() {
    return (

      <div>
        <h2>Welcome to Lottery Contract</h2>
        <p>
          This contract is managed by Lottery Manager: {this.state.manager}. There are currently {this.state.players.length} people entered, competing to win {web3.utils.fromWei(this.state.balance, 'ether')} ETH.
          </p>
          <hr />

          <form onSubmit={this.onSubmit}>
            <h4>Want to try your Luck !!</h4>
            <div>
              <label>Amount of ETH to enter: </label>
              <input 
                value={this.state.value}
                onChange={event => this.setState({ value: event.target.value})}
              />
            </div>
            <button>Enter</button>
          </form>
          
          <hr />

          <h4>Ready to pick a winner ?</h4>
          <button onClick={this.onClick}>Pick a Winner!</button>

          <hr />

          <h1>{this.state.message}</h1>
          <h2>{this.state.winner}</h2>
        

      </div>



      // <div className="App">
      //   <header className="App-header">
      //     <img src={logo} className="App-logo" alt="logo" />
      //     <p>
      //       Edit <code>src/App.js</code> and save to reload.
      //     </p>
      //     <a
      //       className="App-link"
      //       href="https://reactjs.org"
      //       target="_blank"
      //       rel="noopener noreferrer"
      //     >
      //       Learn React
      //     </a>
      //   </header>
      // </div>
    );
  }
}
export default App;
