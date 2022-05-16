import CreatedAt from "./CreatedAt";
import styled from "styled-components/native";
import { isDarkModeVar } from "../apollo";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/core";
import { RootStackParamList } from "../shared/shared.types";
import { ApolloCache, useReactiveVar } from "@apollo/client";
import { User, useToggleLikePhotoMutation } from "../generated/graphql";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Platform, ScaledSize, TouchableOpacity, useWindowDimensions } from "react-native";

type PhotoItemNavigationProps = NativeStackNavigationProp<RootStackParamList>;

interface PhotoItemProps {
  id?: number | null;
  caption?: string | null;
  isLiked?: boolean | null;
  isMe?: boolean | null;
  photoUrl?: string | null;
  totalComments?: number | null;
  totalLikes?: number | null;
  user?: User | null;
}

const Container = styled.ScrollView<{ isWeb: boolean }>`
  background-color: ${(props) => props.theme.bgColor};
  flex: ${(props) => (props.isWeb === true ? "auto" : 1)};
  width: 100%;
  height: 100%;
`;

const Header = styled.TouchableOpacity`
  padding: 12px 10px;
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

const UserInfoContainer = styled.View`
  display: flex;
  flex-direction: column;
`;

const Username = styled.Text`
  font-weight: bold;
  margin-right: 10px;
  font-size: 15px;
  color: ${(props) => props.theme.textColor};
  margin-bottom: 2px;
`;

const Name = styled.Text`
  font-weight: bold;
  color: gray;
  font-size: 14px;
`;

const PhotoImage = styled.Image<{ width: number; height: number }>`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height / 1.8}px;
`;

const PhotoContent = styled.View`
  padding: 10px;
`;

const CaptionContainer = styled.View`
  flex-direction: row;
  padding-right: 50px;
  width: 100%;
  align-items: flex-start;
`;

const CaptionText = styled.Text`
  color: white;
  font-size: 16px;
  color: ${(props) => props.theme.textColor};
`;

const SectionContainer = styled.View`
  width: 100%;
`;

const IconsContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding-top: 10px;
  padding-bottom: 3px;
`;

const Icon = styled.TouchableOpacity`
  margin-right: 15px;
`;

const TotalLikes = styled.Text`
  color: white;
  font-weight: bold;
  margin: 8px 0;
  margin-right: 18px;
  color: ${(props) => props.theme.textColor};
`;

const InfoContainer = styled.View`
  flex-direction: row;
  width: 100%;
`;

const CreatedAtContainer = styled.View``;

const PhotoItem = ({ id, caption, isLiked, isMe, photoUrl, totalComments, totalLikes, user, createdAt }: any) => {
  const isDarkMode: "light" | "dark" = useReactiveVar(isDarkModeVar);
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

  const handleNavigateToStackRoomsNavigation = (): void => {
    navigation.navigate("StackRoomsNavigation");
  };

  const handleNavigateToProfileNavigation = (): void => {
    navigation.navigate("StackProfileNavigation", {
      id: user?.id,
      username: user?.username,
      name: user?.name,
      avatarUrl: user?.avatarUrl,
      isFollowing: user?.isFollowing,
      isMe: user?.isMe,
    });
  };

  const handleNavigateToCommentsScreen = (): void => {
    navigation.navigate("StackComments", { photoId: id as number, caption, createdAt, user });
  };

  const handleNavigateToLikesScreen = (): void => {
    navigation.navigate("StackLikes", { photoId: id as number });
  };

  const handleToggleLikePhoto = (): void => {
    toggleLikePhotoMutation({ variables: { photoId: id as number } });
  };

  return (
    <Container isWeb={Platform.OS === "web"}>
      <Header onPress={handleNavigateToProfileNavigation}>
        {user?.avatarUrl ? <Avatar source={{ uri: user?.avatarUrl }} /> : <Avatar source={require("../assets/basic_user.jpeg")} />}
        <UserInfoContainer>
          <Username>{user?.username}</Username>
          <Name>{user?.name}</Name>
        </UserInfoContainer>
      </Header>
      <PhotoImage source={{ uri: photoUrl }} width={width} height={height}></PhotoImage>
      <PhotoContent>
        {caption ? (
          <CaptionContainer>
            <TouchableOpacity onPress={handleNavigateToProfileNavigation}>
              <Username>{user?.username}</Username>
            </TouchableOpacity>
            <CaptionText>{caption}</CaptionText>
          </CaptionContainer>
        ) : null}
        <SectionContainer>
          <IconsContainer>
            <Icon onPress={handleToggleLikePhoto}>
              <Ionicons name={isLiked ? "heart" : "heart-outline"} color={isLiked ? "rgb(237, 73, 86)" : isDarkMode === "dark" ? "white" : "black"} size={32}></Ionicons>
            </Icon>
            <Icon onPress={handleNavigateToCommentsScreen}>
              <Ionicons name="chatbubble-outline" color={isDarkMode === "dark" ? "white" : "black"} size={30}></Ionicons>
            </Icon>
            <Icon onPress={handleNavigateToStackRoomsNavigation}>
              <Ionicons name="paper-plane-outline" color={isDarkMode === "dark" ? "white" : "black"} size={30}></Ionicons>
            </Icon>
          </IconsContainer>
        </SectionContainer>
        <InfoContainer>
          <TouchableOpacity onPress={handleNavigateToLikesScreen}>
            <TotalLikes>좋아요 {totalLikes}개</TotalLikes>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNavigateToCommentsScreen}>
            <TotalLikes>댓글 {totalComments}개</TotalLikes>
          </TouchableOpacity>
        </InfoContainer>
        <CreatedAtContainer>
          <CreatedAt createdAt={createdAt} />
        </CreatedAtContainer>
      </PhotoContent>
    </Container>
  );
};

export default PhotoItem;
