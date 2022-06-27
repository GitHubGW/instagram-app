import Loading from "./Loading";
import styled from "styled-components/native";
import useLoggedInUser from "../hooks/useLoggedInUser";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../shared/shared.types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useFollowUserMutation, useUnfollowUserMutation } from "../generated/graphql";

type UserItemNavigationProps = NativeStackNavigationProp<RootStackParamList>;

interface UserItemProps {
  id: number;
  username: string;
  name: string;
  avatarUrl: string;
  isFollowing: boolean;
  isMe: boolean;
}

const Container = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
`;

const UserContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

const UserAvatar = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 50px;
  margin-right: 10px;
`;

const UserInfoContainer = styled.View`
  display: flex;
  flex-direction: column;
`;

const Username = styled.Text`
  font-weight: bold;
  color: ${(props) => props.theme.textColor};
  font-size: 15px;
  margin-bottom: 5px;
`;

const Name = styled.Text`
  font-weight: bold;
  color: gray;
  font-size: 14px;
`;

const FollowButton = styled.TouchableOpacity`
  background-color: ${(props) => props.theme.activeColor};
  padding: 10px 15px;
  border-radius: 5px;
  font-size: 14px;
`;

const FollowButtonText = styled.Text`
  font-weight: bold;
  color: white;
`;

const UserItem = ({ id, username, name, avatarUrl, isFollowing, isMe }: UserItemProps) => {
  let followUsername: string | undefined;
  let unfollowUsername: string | undefined;
  const loggedInUser = useLoggedInUser();
  const navigation = useNavigation<UserItemNavigationProps>();
  const [followUserMutation, { loading: followUserLoading }] = useFollowUserMutation({
    update: (cache, { data }) => {
      if (data?.followUser.ok === false) {
        return;
      }

      followUsername = data?.followUser.user?.username;
      cache.modify({
        id: `User:${data?.followUser.user?.id}`,
        fields: {
          isFollowing: (isFollowing: boolean) => true,
          totalFollowers: (totalFollowers: number) => totalFollowers + 1,
        },
      });
      cache.modify({
        id: `User:${loggedInUser?.id}`,
        fields: {
          totalFollowing: (totalFollowing: number) => totalFollowing + 1,
        },
      });
    },
  });
  const [unfollowUserMutation, { loading: unfollowUserLoading }] = useUnfollowUserMutation({
    update: (cache, { data }) => {
      if (data?.unfollowUser.ok === false) {
        return;
      }

      unfollowUsername = data?.unfollowUser.user?.username;
      cache.modify({
        id: `User:${data?.unfollowUser.user?.id}`,
        fields: {
          isFollowing: (isFollowing: boolean) => false,
          totalFollowers: (totalFollowers: number) => totalFollowers - 1,
        },
      });
      cache.modify({
        id: `User:${loggedInUser?.id}`,
        fields: {
          totalFollowing: (totalFollowing: number) => totalFollowing - 1,
        },
      });
    },
  });

  const handleNavigateToProfileNavigation = (): void => {
    navigation.navigate("StackProfileNavigation", {
      id,
      username,
      name,
      avatarUrl,
      isFollowing,
      isMe,
    });
  };

  const handleToggleFollow = (isFollowing: boolean, username: string): void => {
    if (followUserLoading === true || unfollowUserLoading === true) {
      return;
    }
    if (isFollowing === false) {
      followUserMutation({ variables: { username } });
    } else if (isFollowing === true) {
      unfollowUserMutation({ variables: { username } });
    }
  };

  return (
    <Container>
      <UserContainer onPress={handleNavigateToProfileNavigation}>
        {avatarUrl ? <UserAvatar source={{ uri: avatarUrl }}></UserAvatar> : <UserAvatar source={require("../assets/basic_user.jpeg")} />}
        <UserInfoContainer>
          <Username>{username}</Username>
          <Name>{name}</Name>
        </UserInfoContainer>
      </UserContainer>
      {!isMe && (
        <FollowButton onPress={() => handleToggleFollow(isFollowing, username)}>
          <FollowButtonText>{followUserLoading === true || unfollowUserLoading === true ? <Loading /> : isFollowing ? "팔로우 취소" : "팔로우"}</FollowButtonText>
        </FollowButton>
      )}
    </Container>
  );
};

export default UserItem;
