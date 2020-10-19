import React, { useState } from 'react';
import './App.css';
import Amplify, { API, graphqlOperation } from "aws-amplify";

import * as subscriptions from "./graphql/subscriptions";
import * as mutations from "./graphql/mutations";

const stack = require("./stack.json");

Amplify.configure({
  Auth: {
    mandatorySignIn: false,
    region: stack.Region,
    identityPoolId: stack.IdentityPoolId
  },

  aws_appsync_graphqlEndpoint: stack.GraphQlApiUrl,
  aws_appsync_region: stack.Region,
  aws_appsync_authenticationType: 'AWS_IAM'
});

function App() {
  const [quizId, setQuizId] = useState('');
  const [players, setPlayers] = useState(['abc']);

  async function createQuiz() {
    const result = await API.graphql(graphqlOperation(mutations.createQuiz, {quizMasterName: 'Mik'}));
    console.log(result.data);
  }
  
  async function joinQuiz() {
    await API.graphql(graphqlOperation(mutations.joinQuiz, {quizId: quizId, playerName: 'Player one'}));
  }
  async function joinQuiz2() {
    await API.graphql(graphqlOperation(mutations.joinQuiz, {quizId: quizId, playerName: 'Player two'}));
  }

  function subscribe() {
    API.graphql(graphqlOperation(subscriptions.subscribeToPlayersJoining, {quizId: quizId}))
      .subscribe({
        next: (result) => {
          setPlayers(players => [...players, result.value.data.subscribeToPlayersJoining.playerName]);
        }
      });
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>
          SimpleQuiz
        </p>
        <button onClick={createQuiz}>createQuiz</button>
        <button onClick={joinQuiz}>joinQuiz1</button>
        <button onClick={joinQuiz2}>joinQuiz2</button>
        <input onChange={event => setQuizId(event.target.value)}></input>
        <button onClick={subscribe}>subscribe</button>
        <p>The following players have joined:</p>
        <ul>
          {players.map(e => <li>{e}</li>)}
        </ul>
      </header>

    </div>
  );
}

export default App;
