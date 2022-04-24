import gql from "graphql-tag";

export const MESSAGE_UPDATES_SUBSCRIPTION = gql`
  subscription MessageUpdates($roomId: Int!) {
    messageUpdates(roomId: $roomId) {
      id
      text
      read
      user {
        id
        username
        avatarUrl
      }
      createdAt
    }
  }
`;
