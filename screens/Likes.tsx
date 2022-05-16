import Loading from "../components/Loading";
import styled from "styled-components/native";
import UserItem from "../components/UserItem";
import { FlatList } from "react-native";
import { useEffect, useState } from "react";
import { RootStackParamList } from "../shared/shared.types";
import { useSeePhotoLikesQuery } from "../generated/graphql";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

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

const Likes = ({ navigation, route }: LikesNavigationProps) => {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { data: seePhotoLikesData, loading: seePhotoLikesLoading, refetch } = useSeePhotoLikesQuery({ variables: { photoId: route.params.photoId }, skip: !route.params.photoId });

  const onEndReached = (): void => {
    console.log("onEndReached", onEndReached);
  };

  const onRefresh = async (): Promise<void> => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const renderItem = ({ item: user }: any) => {
    return <UserItem {...user} />;
  };

  useEffect(() => {
    navigation.setOptions({ headerTitle: "좋아요" });
  }, []);

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
