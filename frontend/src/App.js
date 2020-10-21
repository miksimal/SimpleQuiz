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
  const [hasQuiz, setHasQuiz] = useState(false);
  const [quizId, setQuizId] = useState('');
  const [quizMasterId, setQuizMasterId] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [quizMasterName, setQuizMasterName] = useState('');
  const [players, setPlayers] = useState([]);

  async function createQuiz() {
    const result = await API.graphql(graphqlOperation(mutations.createQuiz, {quizMasterName: quizMasterName}));
    setQuizId(result.data.createQuiz.quizId);
    setQuizMasterId(result.data.createQuiz.quizMasterId);
    subscribe(result.data.createQuiz.quizId);
    setHasQuiz(true);
  }
  
  async function joinQuiz() {
    await API.graphql(graphqlOperation(mutations.joinQuiz, {quizId: quizId, playerName: playerName}));
    subscribe(quizId);
  }

  function subscribe(id) {
    console.log('Subscribing to quiz: ' + id);
    API.graphql(graphqlOperation(subscriptions.subscribeToPlayersJoining, {quizId: id}))
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
      </header>
      <main className="App-main">
        {!hasQuiz ? 
        <>
          <div className="CreateQuiz">
            <h3>Create Quiz</h3>
            <label for="setQuizMasterName">Your name: </label>
            <input id="setQuizMasterName" onChange={event => setQuizMasterName(event.target.value)}></input>
            <button onClick={createQuiz}>Create</button>
          </div>
          <div className="JoinQuiz">
            <h3>Join Quiz</h3>
            <label for="setPlayerName">Your name: </label>
            <input id="setPlayerName" onChange={event => setPlayerName(event.target.value)}></input>
            <label for="setQuizId">Quiz code: </label>
            <input id="setQuizId" onChange={event => setQuizId(event.target.value)}></input>
            <button onClick={joinQuiz}>Join</button>
          </div>
        </>
        :
        <>
          <p>Waiting for players to join. Your quiz link is: https://simplequiz.miksimal.com/{quizId}</p>

          <p>The following players have joined:</p>
          <ul>
            {players.map(e => <li>{e}</li>)}
          </ul>
        </>
        }
      </main>

    </div>
  );
}

export default App;
