import Loading from "../components/Loading";
import styled from "styled-components/native";
import { useEffect, useState } from "react";
import { RootStackParamList } from "../shared/shared.types";
import { useSeeRecommendPhotosQuery } from "../generated/graphql";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FlatList, ScaledSize, TouchableOpacity, useWindowDimensions } from "react-native";

type NotificationNavigationProps = NativeStackScreenProps<RootStackParamList, "StackNotification">;

const Container = styled.View`
  background-color: ${(props) => props.theme.bgColor};
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const LoadingContainer = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
  width: 100%;
`;

const LoadingText = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-weight: 600;
  margin-top: 8px;
`;

const FlatListContainer = styled(FlatList)`
  width: 100%;
`;

const PhotoImage = styled.Image<{ width: number }>`
  width: ${(props) => props.width / 3}px;
  height: ${(props) => props.width / 3}px;
`;

const Notification = ({ navigation }: NotificationNavigationProps) => {
  const { width }: ScaledSize = useWindowDimensions();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { data: seeRecommendPhotosData, loading: seeRecommendPhotosLoading, refetch } = useSeeRecommendPhotosQuery();

  const handleNavigateToPhotoScreen = (photoId: number): void => {
    navigation.navigate("StackPhoto", { photoId });
  };

  const onRefresh = async (): Promise<void> => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const renderItem = ({ item: photo }: any) => {
    return (
      <TouchableOpacity onPress={() => handleNavigateToPhotoScreen(photo.id)}>
        <PhotoImage width={Math.ceil(width)} source={{ uri: photo.photoUrl }} />
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    navigation.setOptions({ headerTitle: "추천 사진" });
  }, []);

  return (
    <Container>
      {seeRecommendPhotosLoading === true && (
        <LoadingContainer>
          <Loading />
          <LoadingText>사진 로드중...</LoadingText>
        </LoadingContainer>
      )}
      {seeRecommendPhotosLoading === false && seeRecommendPhotosData?.seeRecommendPhotos.photos && (
        <FlatListContainer
          numColumns={3}
          refreshing={refreshing}
          onRefresh={onRefresh}
          data={seeRecommendPhotosData?.seeRecommendPhotos.photos}
          renderItem={renderItem}
          keyExtractor={(photo: any) => String(photo.id)}
        ></FlatListContainer>
      )}
    </Container>
  );
};

export default Notification;
