import { ScaledSize, TouchableOpacity, useWindowDimensions } from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { User, useToggleLikePhotoMutation } from "../generated/graphql";
import { useNavigation } from "@react-navigation/core";
import { RootStackParamList } from "../shared/shared.types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ApolloCache } from "@apollo/client";

type PhotoItemNavigationProps = NativeStackNavigationProp<RootStackParamList, "StackPhoto">;

interface PhotoItem {
  id: number;
  caption: string;
  isLiked: boolean;
  isMe: boolean;
  photoUrl: string;
  totalComments: number;
  totalLikes: number;
  user: User;
}

const Container = styled.View`
  background-color: black;
  flex: 1;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
`;

const Header = styled.TouchableOpacity`
  padding: 20px 10px;
  flex-direction: row;
  align-items: center;
  width: 100%;
`;

const Avatar = styled.Image`
  width: 30px;
  height: 30px;
  border-radius: 50px;
  margin-right: 10px;
`;

const Username = styled.Text`
  color: white;
  font-weight: bold;
  margin-right: 10px;
`;

const PhotoImage = styled.Image<{ width: number; height: number }>`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height / 2}px;
`;

const CaptionContainer = styled.View`
  flex-direction: row;
  padding: 10px 10px;
  width: 100%;
`;

const CaptionText = styled.Text`
  color: white;
  font-size: 16px;
`;

const SectionContainer = styled.View`
  padding: 10px 10px;
  width: 100%;
`;

const IconsContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Icon = styled.TouchableOpacity`
  margin-right: 15px;
`;

const TotalLikes = styled.Text`
  color: white;
  font-weight: bold;
  margin: 8px 0;
  margin-right: 18px;
`;

const InfoContainer = styled.View`
  flex-direction: row;
  padding-left: 10px;
  width: 100%;
`;

const PhotoItem = ({ id, caption, isLiked, isMe, photoUrl, totalComments, totalLikes, user }: PhotoItem) => {
  const { width, height }: ScaledSize = useWindowDimensions();
  const navigation = useNavigation<PhotoItemNavigationProps>();
  const [toggleLikePhotoMutation, { loading: toggleLikePhotoLoading }] = useToggleLikePhotoMutation({
    update(cache: ApolloCache<any>, { data }) {
      if (data?.toggleLikePhoto.ok === false) {
        return;
      }

      cache.modify({
        id: `Photo:${id}`,
        fields: {
          isLiked: (isLiked: boolean): boolean => !isLiked,
          totalLikes: (totalLikes: number): number => (isLiked === true ? totalLikes - 1 : totalLikes + 1),
        },
      });
    },
  });

  const handleNavigateToScreen = (screenName: string): void => {
    navigation.navigate(screenName);
  };

  const handleToggleLikePhoto = (): void => {
    toggleLikePhotoMutation({ variables: { photoId: id } });
  };

  return (
    <Container>
      <Header onPress={() => handleNavigateToScreen("StackProfile")}>
        {user.avatarUrl ? <Avatar source={{ uri: user.avatarUrl }}></Avatar> : <Avatar source={require("../assets/basic_user.jpeg")}></Avatar>}
        <Username>{user.username}</Username>
      </Header>
      <PhotoImage source={{ uri: photoUrl }} width={width} height={height}></PhotoImage>
      {caption ? (
        <CaptionContainer>
          <TouchableOpacity onPress={() => handleNavigateToScreen("StackProfile")}>
            <Username>{user.username}</Username>
          </TouchableOpacity>
          <CaptionText>{caption}</CaptionText>
        </CaptionContainer>
      ) : null}
      <SectionContainer>
        <IconsContainer>
          <Icon onPress={handleToggleLikePhoto}>
            <Ionicons name={isLiked ? "heart" : "heart-outline"} color={isLiked ? "rgb(237, 73, 86)" : "white"} size={32}></Ionicons>
          </Icon>
          <Icon onPress={() => handleNavigateToScreen("StackComments")}>
            <Ionicons name="chatbubble-outline" color="white" size={30}></Ionicons>
          </Icon>
          <Icon>
            <Ionicons name="paper-plane-outline" color="white" size={30}></Ionicons>
          </Icon>
        </IconsContainer>
      </SectionContainer>
      <InfoContainer>
        <TouchableOpacity onPress={() => handleNavigateToScreen("StackLikes")}>
          <TotalLikes>좋아요 {totalLikes}개</TotalLikes>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleNavigateToScreen("StackComments")}>
          <TotalLikes>댓글 {totalComments}개</TotalLikes>
        </TouchableOpacity>
      </InfoContainer>
    </Container>
  );
};

export default PhotoItem;
