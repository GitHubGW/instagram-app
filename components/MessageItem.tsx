import styled from "styled-components/native";
import { useNavigation } from "@react-navigation/core";
import { RootStackParamList } from "../shared/shared.types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type MessageItemNavigationProps = NativeStackNavigationProp<RootStackParamList>;

interface MessageItemProps {
  __typename: string;
  id: number;
  text: string;
  read: boolean;
  createdAt: string;
  user: {
    __typename: string;
    id: number;
    username: string;
    avatarUrl: string;
    isMe: boolean;
  };
  otherUser: any;
}

const MyMessageContainer = styled.View`
  padding: 5px 10px;
  align-items: flex-end;
`;

const MyMessage = styled.Text`
  color: black;
  background-color: #e8e8e8;
  padding: 10px 12px;
  border-radius: 10px;
  overflow: hidden;
`;

const OtherMessageContainer = styled.View`
  padding: 5px 10px;
  align-items: flex-end;
  flex-direction: row;
`;

const AuthorContainer = styled.TouchableOpacity``;

const Avatar = styled.Image`
  width: 30px;
  height: 30px;
  border-radius: 50px;
`;

const OtherMessage = styled.Text`
  color: ${(props) => props.theme.textColor};
  background-color: ${(props) => props.theme.bgColor};
  border: 1px solid #e8e8e8;
  padding: 10px 12px;
  border-radius: 10px;
  margin: 0 10px;
  overflow: hidden;
`;

const MessageItem = ({ id, text, read, createdAt, user, otherUser }: MessageItemProps) => {
  const navigation = useNavigation<MessageItemNavigationProps>();

  const handleNavigateToProfileNavigation = (): void => {
    navigation.navigate("StackProfileNavigation", {
      id: otherUser?.id,
      username: otherUser?.username,
      name: otherUser?.name,
      avatarUrl: otherUser?.avatarUrl,
      isFollowing: otherUser?.isFollowing,
      isMe: otherUser?.isMe,
    });
  };

  return user.isMe === true ? (
    <MyMessageContainer>
      <MyMessage>{text}</MyMessage>
    </MyMessageContainer>
  ) : (
    <OtherMessageContainer>
      <AuthorContainer onPress={handleNavigateToProfileNavigation}>
        {user.avatarUrl ? <Avatar source={{ uri: user.avatarUrl }} /> : <Avatar source={require("../assets/basic_user.jpeg")} />}
      </AuthorContainer>
      <OtherMessage>{text}</OtherMessage>
    </OtherMessageContainer>
  );
};

export default MessageItem;
