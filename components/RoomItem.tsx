import CreatedAt from "./CreatedAt";
import styled from "styled-components/native";
import { useNavigation } from "@react-navigation/core";
import { RootStackParamList } from "../shared/shared.types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RoomItemNavigationProps = NativeStackNavigationProp<RootStackParamList>;

interface RoomItemProps {
  id: number;
  users: any;
  messages: any;
  totalUnreadMessages: number;
  otherUser: any;
  latestMessage?: {
    __typename: string;
    id: number;
    text: string;
    createdAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

const RoomContainer = styled.TouchableOpacity`
  background-color: ${(props) => props.theme.bgColor};
  padding: 10px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const RoomUserContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Avatar = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 25px;
  margin-right: 10px;
`;

const Data = styled.View``;

const Username = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-weight: 600;
  font-size: 16px;
`;

const UnreadText = styled.Text`
  color: gray;
  margin-top: 3px;
  font-weight: normal;
  font-size: 13px;
`;

const RoomInfoContainer = styled.View`
  align-items: flex-end;
`;

const TotalUnreadMessagesContainer = styled.View`
  background-color: #f25747;
  width: 17px;
  height: 17px;
  border-radius: 50px;
  margin-top: 5px;
  justify-content: center;
  align-items: center;
`;

const TotalUnreadMessages = styled.Text`
  color: white;
`;

const RoomItem = ({ id, users, messages, totalUnreadMessages, otherUser, latestMessage, createdAt, updatedAt }: RoomItemProps) => {
  const navigation = useNavigation<RoomItemNavigationProps>();

  const handleNavigateToRoomScreen = (): void => {
    navigation.navigate("StackRoom", { id, otherUser });
  };

  return (
    <RoomContainer onPress={handleNavigateToRoomScreen}>
      <RoomUserContainer>
        {otherUser.avatarUrl ? <Avatar source={{ uri: otherUser.avatarUrl }}></Avatar> : <Avatar source={require("../assets/basic_user.jpeg")} />}
        <Data>
          <Username>{otherUser.username}</Username>
          <UnreadText>{latestMessage?.text}</UnreadText>
        </Data>
      </RoomUserContainer>
      <RoomInfoContainer>
        {latestMessage?.createdAt && <CreatedAt createdAt={latestMessage?.createdAt} />}
        <TotalUnreadMessagesContainer>{totalUnreadMessages > 0 && <TotalUnreadMessages>{totalUnreadMessages}</TotalUnreadMessages>}</TotalUnreadMessagesContainer>
      </RoomInfoContainer>
    </RoomContainer>
  );
};

export default RoomItem;
