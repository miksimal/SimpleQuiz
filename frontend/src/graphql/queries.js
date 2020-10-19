/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getQuiz = /* GraphQL */ `
  query GetQuiz($quizId: String!) {
    getQuiz(quizId: $quizId) {
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
