import gql from "graphql-tag";

gql`
  query SeePhoto($photoId: Int!) {
    seePhoto(photoId: $photoId) {
      ok
      message
      photo {
        id
        user {
          id
          name
          username
          avatarUrl
          isFollowing
          isMe
        }
        photoUrl
        caption
        totalLikes
        totalComments
        isMe
        isLiked
        createdAt
      }
    }
  }
`;
