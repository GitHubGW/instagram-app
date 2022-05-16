import Loading from "../components/Loading";
import styled from "styled-components/native";
import PhotoItem from "../components/PhotoItem";
import { FlatList } from "react-native";
import { isDarkModeVar } from "../apollo";
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useReactiveVar } from "@apollo/client";
import { useSeeFeedQuery } from "../generated/graphql";
import { RootStackParamList } from "../shared/shared.types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type FeedNavigationProps = NativeStackScreenProps<RootStackParamList, "StackFeed">;

const Container = styled.View`
  background-color: ${(props) => props.theme.bgColor};
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const FlatListContainer = styled(FlatList)`
  width: 100%;
`;

const RoomsContainer = styled.TouchableOpacity`
  padding-left: 10px;
  padding-right: 10px;
`;

const Feed = ({ navigation }: FeedNavigationProps) => {
  const isDarkMode: "light" | "dark" = useReactiveVar(isDarkModeVar);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { data: seeFeedData, loading: seeFeedLoading, refetch, fetchMore } = useSeeFeedQuery();

  const handleNavigateToStackRoomsNavigation = (): void => {
    navigation.navigate("StackRoomsNavigation");
  };

  const onEndReached = async () => {
    if (seeFeedData?.seeFeed.lastPhotoId === null) {
      return;
    }
    // await fetchMore({ variables: { cursor: seeFeedData?.seeFeed.lastPhotoId } });
  };

  const onRefresh = async (): Promise<void> => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const renderItem = ({ item: photo }: any) => {
    return <PhotoItem {...photo} />;
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <RoomsContainer onPress={handleNavigateToStackRoomsNavigation}>
          <Ionicons name="paper-plane-outline" color={isDarkMode === "dark" ? "white" : "black"} size={25}></Ionicons>
        </RoomsContainer>
      ),
    });
  }, []);

  return (
    <Container>
      <StatusBar hidden={false} />
      {seeFeedLoading === true ? (
        <Loading />
      ) : (
        <FlatListContainer
          onEndReachedThreshold={0}
          onEndReached={onEndReached}
          refreshing={refreshing}
          onRefresh={onRefresh}
          data={seeFeedData?.seeFeed.photos}
          renderItem={renderItem}
          keyExtractor={(photo: any) => String(photo.id)}
        ></FlatListContainer>
      )}
    </Container>
  );
};

export default Feed;
