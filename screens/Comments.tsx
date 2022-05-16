import Loading from "../components/Loading";
import styled from "styled-components/native";
import CreatedAt from "../components/CreatedAt";
import CommentItem from "../components/CommentItem";
import { FlatList } from "react-native";
import { useEffect, useState } from "react";
import { Separator } from "../components/shared";
import { useSeeCommentsQuery } from "../generated/graphql";
import { RootStackParamList } from "../shared/shared.types";
import { TouchableOpacity } from "react-native-gesture-handler";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type CommentsNavigationProps = NativeStackScreenProps<RootStackParamList, "StackComments">;

const LoadingContainer = styled.View`
  background-color: ${(props) => props.theme.bgColor};
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const Container = styled.View`
  background-color: ${(props) => props.theme.bgColor};
  flex: 1;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;
`;

const PhotoContainer = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
`;

const Avatar = styled.Image`
  width: 32px;
  height: 32px;
  border-radius: 50px;
  margin-right: 13px;
`;

const PhotoInfoContainer = styled.View`
  flex-direction: column;
`;

const PhotoUserContainer = styled.View`
  flex-direction: row;
  margin-bottom: 15px;
`;

const PhotoUsername = styled.Text`
  font-weight: bold;
  margin-right: 7px;
`;

const PhotoCaption = styled.Text`
  font-weight: normal;
`;

const FlatListContainer = styled(FlatList)`
  width: 100%;
`;

const Comments = ({ navigation, route }: CommentsNavigationProps) => {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { data: seeCommentsData, loading: seeCommentsLoading, refetch } = useSeeCommentsQuery({ variables: { photoId: route.params.photoId } });

  const handleNavigateToProfileNavigation = (): void => {
    navigation.navigate("StackProfileNavigation", {
      id: route.params.user?.id,
      username: route.params.user?.username,
      name: route.params.user?.name,
      avatarUrl: route.params.user?.avatarUrl,
      isFollowing: route.params.user?.isFollowing,
      isMe: route.params.user?.isMe,
    });
  };

  const onRefresh = async (): Promise<void> => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const renderItem = ({ item: comment }: any) => {
    return <CommentItem {...comment} />;
  };

  useEffect(() => {
    navigation.setOptions({ headerTitle: "댓글" });
  }, []);

  return (
    <>
      {seeCommentsLoading === true ? (
        <LoadingContainer>
          <Loading />
        </LoadingContainer>
      ) : (
        <Container>
          <PhotoContainer>
            <TouchableOpacity onPress={handleNavigateToProfileNavigation}>
              {route.params.user.avatarUrl ? <Avatar source={{ uri: route.params.user.avatarUrl || "" }}></Avatar> : <Avatar source={require("../assets/basic_user.jpeg")} />}
            </TouchableOpacity>
            <PhotoInfoContainer>
              <PhotoUserContainer>
                <TouchableOpacity onPress={handleNavigateToProfileNavigation}>
                  <PhotoUsername>{route.params.user.username}</PhotoUsername>
                </TouchableOpacity>
                <PhotoCaption>{route.params.caption.length > 40 ? `${route.params.caption.slice(0, 40)}...` : route.params.caption}</PhotoCaption>
              </PhotoUserContainer>
              <CreatedAt createdAt={route.params.createdAt} />
            </PhotoInfoContainer>
          </PhotoContainer>
          <Separator />
          <FlatListContainer
            showsVerticalScrollIndicator={false}
            refreshing={refreshing}
            onRefresh={onRefresh}
            data={seeCommentsData?.seeComments.comments}
            renderItem={renderItem}
            keyExtractor={(comment: any) => String(comment.id)}
          ></FlatListContainer>
        </Container>
      )}
    </>
  );
};

export default Comments;
