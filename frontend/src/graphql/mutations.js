/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const joinQuiz = /* GraphQL */ `
  mutation JoinQuiz($quizId: String!, $playerName: String!) {
    joinQuiz(quizId: $quizId, playerName: $playerName) {
      playerName
      quizId
    }
  }
`;
export const createQuiz = /* GraphQL */ `
  mutation CreateQuiz($quizMasterName: String!) {
    createQuiz(quizMasterName: $quizMasterName) {
      quizId
      quizMasterId
      quizMasterName
      questionOrder
      playerNames
      currentScore {
        playerName
        points
      }
    }
  }
`;
