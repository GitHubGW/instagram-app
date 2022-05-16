import styled from "styled-components/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as MediaLibrary from "expo-media-library";
import { useEffect, useState } from "react";
import { RootStackParamList } from "../shared/shared.types";
import { TouchableOpacity } from "react-native-gesture-handler";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FlatList, ScaledSize, useWindowDimensions } from "react-native";

type PhotoNavigationProps = NativeStackScreenProps<RootStackParamList, "StackPhotoNavigation">;

const Container = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.bgColor};
`;

const TopPhotoContainer = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.bgColor};
`;

const AssetPhotoImage = styled.Image<{ width: number }>`
  width: ${(props) => props.width}px;
  height: 100%;
`;

const BottomPhotoContainer = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.bgColor};
`;

const FlatListContainer = styled(FlatList)`
  width: 100%;
`;

const AssetPhotoItem = styled.Image<{ width: number }>`
  width: ${(props) => props.width / 4}px;
  height: ${(props) => props.width / 4}px;
`;

const AssetPhotoItemIcon = styled(Ionicons)`
  position: absolute;
  bottom: 3px;
  right: 3px;
`;

const HeaderRightContainer = styled.TouchableOpacity`
  padding: 10px 12px;
`;

const HeaderRightText = styled.Text`
  font-size: 17px;
  color: ${(props) => props.theme.activeColor};
  font-weight: bold;
`;

const SelectPhoto = ({ navigation }: PhotoNavigationProps) => {
  const { width }: ScaledSize = useWindowDimensions();
  const [canAccessPhotoGallery, setCanAccessPhotoGallery] = useState<boolean>(false);
  const [assetPhotos, setAssetPhotos] = useState<MediaLibrary.Asset[]>([]);
  const [totalPhotos, setTotalPhotos] = useState<number>(0);
  const [chosenPhotoUri, setChosenPhotoUri] = useState<string | undefined>("");

  const handleGetPhotosFromGallery = async (): Promise<void> => {
    if (canAccessPhotoGallery === false) {
      return;
    }
    // const albums: MediaLibrary.Album[] = await MediaLibrary.getAlbumsAsync();
    const pagedInfo: MediaLibrary.PagedInfo<MediaLibrary.Asset> = await MediaLibrary.getAssetsAsync();
    setAssetPhotos(pagedInfo.assets);
    setTotalPhotos(pagedInfo.totalCount);
  };

  const handleGetPhotoGalleryPermission = async (): Promise<void> => {
    const permissionResponse: MediaLibrary.PermissionResponse = await MediaLibrary.getPermissionsAsync();

    if (permissionResponse.status !== "granted") {
      const permissionResponse: MediaLibrary.PermissionResponse = await MediaLibrary.requestPermissionsAsync();
      if (permissionResponse.status === "granted") {
        setCanAccessPhotoGallery(true);
      }
    } else if (permissionResponse.status === "granted") {
      setCanAccessPhotoGallery(true);
    }
  };

  const handleChoosePhoto = async (assetPhotoId: string): Promise<void> => {
    const assetInfo: MediaLibrary.AssetInfo = await MediaLibrary.getAssetInfoAsync(assetPhotoId);
    setChosenPhotoUri(assetInfo.localUri);
  };

  const handleNavigateToUploadPhotoScreen = (chosenPhotoUri: string | undefined): void => {
    navigation.navigate("StackUploadPhotoNavigation", { photoUri: chosenPhotoUri });
  };

  const renderItem = ({ item: assetPhoto }: any) => {
    return (
      <TouchableOpacity onPress={() => handleChoosePhoto(assetPhoto.id)}>
        <AssetPhotoItem width={width} source={{ uri: assetPhoto.uri }} />
        {assetPhoto.uri === chosenPhotoUri && <AssetPhotoItemIcon name="checkbox" size={16} color="white" />}
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    navigation.setOptions({
      headerTitle: `사진 (${totalPhotos})`,
      headerRight: () => {
        return (
          <HeaderRightContainer onPress={() => handleNavigateToUploadPhotoScreen(chosenPhotoUri)}>
            <HeaderRightText>다음</HeaderRightText>
          </HeaderRightContainer>
        );
      },
    });
  }, [totalPhotos, chosenPhotoUri]);

  useEffect(() => {
    handleGetPhotoGalleryPermission();
  }, []);

  useEffect(() => {
    handleGetPhotosFromGallery();
  }, [canAccessPhotoGallery]);

  useEffect(() => {
    if (assetPhotos[0]?.uri) {
      setChosenPhotoUri(assetPhotos[0].uri);
    }
  }, [assetPhotos]);

  return (
    <Container>
      <TopPhotoContainer>{chosenPhotoUri !== "" && <AssetPhotoImage width={width} source={{ uri: chosenPhotoUri }} />}</TopPhotoContainer>
      <BottomPhotoContainer>
        <FlatListContainer numColumns={4} data={assetPhotos} renderItem={renderItem} keyExtractor={(assetPhoto: any) => assetPhoto.id}></FlatListContainer>
      </BottomPhotoContainer>
    </Container>
  );
};

export default SelectPhoto;
