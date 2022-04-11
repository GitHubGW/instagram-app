import { useNavigation } from "@react-navigation/core";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { RootStackParamList } from "../shared/shared.types";
import CreatedAt from "./CreatedAt";

type CommentItemNavigationProps = NativeStackNavigationProp<RootStackParamList>;

interface CommentItemUser {
  __typename: string;
  id: number;
  username: string;
  name: string;
  avatarUrl: string;
  isMe: boolean;
  isFollowing: boolean;
}

interface CommentItemProps {
  text: string;
  createdAt: number;
  user: CommentItemUser;
}

const Container = styled.View`
  align-items: flex-start;
  margin-top: 22px;
  flex-direction: row;
`;

const Avatar = styled.Image`
  width: 32px;
  height: 32px;
  border-radius: 50px;
  margin-right: 13px;
`;

const CommentInfoContainer = styled.View`
  flex-direction: column;
`;

const CommentUserContainer = styled.View`
  flex-direction: row;
  margin-bottom: 15px;
`;

const CommentUsername = styled.Text`
  font-weight: bold;
  margin-right: 7px;
`;

const CommentText = styled.Text`
  font-weight: normal;
`;

const CommentItem = ({ text, createdAt, user }: CommentItemProps) => {
  const navigation = useNavigation<CommentItemNavigationProps>();

  const handleNavigateToProfileScreen = (): void => {
    navigation.navigate("StackProfile", { id: user?.id, username: user?.username, name: user?.name, avatarUrl: user?.avatarUrl, isFollowing: user?.isFollowing, isMe: user?.isMe });
  };

  return (
    <Container>
      <TouchableOpacity onPress={handleNavigateToProfileScreen}>
        <Avatar source={{ uri: user.avatarUrl }}></Avatar>
      </TouchableOpacity>
      <CommentInfoContainer>
        <CommentUserContainer>
          <TouchableOpacity onPress={handleNavigateToProfileScreen}>
            <CommentUsername>{user.username}</CommentUsername>
          </TouchableOpacity>
          <CommentText>{text}</CommentText>
        </CommentUserContainer>
        <CreatedAt createdAt={createdAt} />
      </CommentInfoContainer>
    </Container>
  );
};

export default CommentItem;