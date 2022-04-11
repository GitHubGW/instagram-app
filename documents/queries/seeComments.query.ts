import gql from "graphql-tag";

gql`
  query SeeComments($photoId: Int!, $cursor: Int) {
    seeComments(photoId: $photoId, cursor: $cursor) {
      ok
      message
      comments {
        id
        text
        user {
          id
          username
          name
          avatarUrl
          isMe
          isFollowing
        }
        isMe
        createdAt
      }
    }
  }
`;
