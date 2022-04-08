import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import styled from "styled-components/native";
import { RootStackParamList } from "../shared/shared.types";

type UserItemNavigationProps = NativeStackNavigationProp<RootStackParamList>;

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

const UserItem = ({ id, username, name, avatarUrl, isFollowing, isMe }: any) => {
  const navigation = useNavigation<UserItemNavigationProps>();

  const handleNavigateToProfileScreen = (): void => {
    navigation.navigate("StackProfile", { id, username, name, avatarUrl, isFollowing, isMe });
  };

  return (
    <Container>
      <UserContainer onPress={handleNavigateToProfileScreen}>
        <UserAvatar source={{ uri: avatarUrl }}></UserAvatar>
        <UserInfoContainer>
          <Username>{username}</Username>
          <Name>{name}</Name>
        </UserInfoContainer>
      </UserContainer>
      {!isMe && (
        <FollowButton>
          <FollowButtonText>{isFollowing ? "팔로우 취소" : "팔로우"}</FollowButtonText>
        </FollowButton>
      )}
    </Container>
  );
};

export default UserItem;
