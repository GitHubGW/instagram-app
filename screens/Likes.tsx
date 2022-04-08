import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { FlatList } from "react-native";
import styled from "styled-components/native";
import Loading from "../components/Loading";
import UserItem from "../components/UserItem";
import { useSeePhotoLikesQuery } from "../generated/graphql";
import { RootStackParamList } from "../shared/shared.types";

type LikesNavigationProps = NativeStackScreenProps<RootStackParamList, "StackLikes">;

const Container = styled.View`
  background-color: ${(props) => props.theme.bgColor};
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const FlatListContainer = styled(FlatList)`
  width: 100%;
`;

const Likes = ({ route }: LikesNavigationProps) => {
  const {
    params: { photoId },
  } = route;
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const {
    data: seePhotoLikesData,
    loading: seePhotoLikesLoading,
    refetch,
  } = useSeePhotoLikesQuery({
    variables: { photoId },
    skip: !photoId,
  });

  const onEndReached = (): void => {
    console.log("onEndReached", onEndReached);
  };

  const onRefresh = async (): Promise<void> => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const renderItem = ({ item }: any) => {
    return <UserItem {...item} />;
  };

  return (
    <Container>
      {seePhotoLikesLoading === true ? (
        <Loading />
      ) : (
        <FlatListContainer
          onEndReachedThreshold={0}
          onEndReached={onEndReached}
          refreshing={refreshing}
          onRefresh={onRefresh}
          data={seePhotoLikesData?.seePhotoLikes.users}
          renderItem={renderItem}
          keyExtractor={(user: any) => String(user.id)}
        ></FlatListContainer>
      )}
    </Container>
  );
};

export default Likes;
