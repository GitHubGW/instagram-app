import styled from "styled-components/native";
import * as MediaLibrary from "expo-media-library";
import Slider from "@react-native-community/slider";
import { Camera, CameraCapturedPicture } from "expo-camera";
import { CameraType, FlashMode } from "expo-camera/build/Camera.types";
import { useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/core";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../shared/shared.types";
import { TouchableOpacity } from "react-native-gesture-handler";

type PhotoNavigationProps = NativeStackScreenProps<RootStackParamList, "StackPhotoNavigation">;

const Container = styled.View`
  flex: 1;
`;

const CameraOn = styled(Camera)`
  flex: 5;
`;

const CameraOff = styled.View`
  flex: 5;
`;

const TakenPhotoPreview = styled.Image`
  flex: 5;
`;

const CameraButtons = styled.View`
  flex: 1;
  background-color: black;
  justify-content: space-evenly;
  align-items: center;
  flex-direction: row;
`;

const PreviewPhotoImage = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 10px;
`;

const TakePhotoButton = styled.TouchableOpacity`
  width: 70px;
  height: 70px;
  background-color: white;
  border-radius: 50px;
`;

const FlipCameraTypeButton = styled.TouchableOpacity``;

const ActionContainer = styled.View`
  background-color: black;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  padding-top: 20px;
`;

const FlashContainer = styled.TouchableOpacity``;

const SliderContainer = styled(Slider)`
  width: 180px;
  margin: 0 20px;
`;

const ActionsButtons = styled.View`
  background-color: transparent;
  position: absolute;
  top: 40px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const ActionButton = styled.TouchableOpacity`
  padding: 15px;
`;

const ActionText = styled.Text`
  color: white;
  font-size: 17px;
`;

const TakePhoto = ({ navigation }: PhotoNavigationProps) => {
  const cameraRef = useRef(new Camera({}));
  const [zoom, setZoom] = useState<number>(0);
  const [whiteBalance, setWhiteBalance] = useState(Camera.Constants.WhiteBalance.auto);
  const [cameraReady, setCameraReady] = useState<boolean>(false);
  const [takenPhotoUri, setTakenPhotoUri] = useState<string>("");
  const [canTakePhoto, setCanTakePhoto] = useState<boolean>(false);
  const [cameraType, setCameraType] = useState<CameraType>(CameraType.back);
  const [flashMode, setFlashMode] = useState<FlashMode>(FlashMode.off);
  const [previewPhoto, setPreviewPhoto] = useState<string>("");
  const isFocused: boolean = useIsFocused();

  const handleNavigateToSelectPhotoScreen = (): void => {
    navigation.navigate("StackSelectPhoto");
  };

  const handleGetPreviewPhoto = async (): Promise<void> => {
    const pagedInfo: MediaLibrary.PagedInfo<MediaLibrary.Asset> = await MediaLibrary.getAssetsAsync();
    setPreviewPhoto(pagedInfo.assets[0].uri);
  };

  const handleGetTakingPhotoPermission = async (): Promise<void> => {
    const permissionResponse: MediaLibrary.PermissionResponse = await Camera.getCameraPermissionsAsync();

    if (permissionResponse.status !== "granted") {
      const permissionResponse: MediaLibrary.PermissionResponse = await Camera.requestCameraPermissionsAsync();
      if (permissionResponse.status === "granted") {
        setCanTakePhoto(true);
      }
    } else if (permissionResponse.status === "granted") {
      setCanTakePhoto(true);
    }
  };

  const handleFlipCamera = (): void => {
    if (cameraType === CameraType.front) {
      setCameraType(CameraType.back);
    } else if (cameraType === CameraType.back) {
      setCameraType(CameraType.front);
    }
  };

  const onValueChange = (value: number): void => {
    setZoom(value);
  };

  const handleFlashMode = (): void => {
    if (flashMode === FlashMode.off) {
      setFlashMode(FlashMode.on);
    } else if (flashMode === FlashMode.on) {
      setFlashMode(FlashMode.off);
    }
  };

  const handleWhiteBalance = (): void => {
    if (whiteBalance === Camera.Constants.WhiteBalance.auto) {
      setWhiteBalance(Camera.Constants.WhiteBalance.cloudy);
    } else if (whiteBalance === Camera.Constants.WhiteBalance.cloudy) {
      setWhiteBalance(Camera.Constants.WhiteBalance.incandescent);
    } else if (whiteBalance === Camera.Constants.WhiteBalance.incandescent) {
      setWhiteBalance(Camera.Constants.WhiteBalance.fluorescent);
    } else if (whiteBalance === Camera.Constants.WhiteBalance.fluorescent) {
      setWhiteBalance(Camera.Constants.WhiteBalance.auto);
    }
  };

  const onCameraReady = (): void => {
    setCameraReady(true);
  };

  const handleTakePhoto = async (): Promise<void> => {
    if (cameraRef.current && cameraReady === true) {
      const { uri }: CameraCapturedPicture = await cameraRef.current.takePictureAsync({
        quality: 1,
        exif: true,
        skipProcessing: true,
      });
      setTakenPhotoUri(uri);
    }
  };

  const handleUploadPhoto = async (): Promise<void> => {
    await MediaLibrary.saveToLibraryAsync(takenPhotoUri);
    navigation.navigate("StackUploadPhotoNavigation", { photoUri: takenPhotoUri });
  };

  const handleCancel = (): void => {
    setTakenPhotoUri("");
  };

  useEffect(() => {
    handleGetTakingPhotoPermission();
    handleGetPreviewPhoto();
  }, []);

  useEffect(() => {
    if (isFocused === true) {
      setTakenPhotoUri("");
    }
  }, [isFocused]);

  return (
    <Container>
      {isFocused === false && <CameraOff />}
      {isFocused === true && takenPhotoUri === "" && (
        <CameraOn ref={cameraRef} onCameraReady={onCameraReady} type={cameraType} zoom={zoom} flashMode={flashMode} ratio="16:9" whiteBalance={whiteBalance} />
      )}
      {isFocused === true && takenPhotoUri !== "" ? <TakenPhotoPreview source={{ uri: takenPhotoUri }} /> : null}
      {takenPhotoUri === "" ? (
        <ActionContainer>
          <FlashContainer onPress={handleFlashMode}>
            <Ionicons name={flashMode === FlashMode.on ? "flash-off" : "flash"} size={24} color="white" />
          </FlashContainer>
          <SliderContainer
            onValueChange={onValueChange}
            thumbTintColor="white"
            minimumValue={0}
            maximumValue={1}
            minimumTrackTintColor="rgba(255,255,255,1)"
            maximumTrackTintColor="rgba(255,255,255,0.8)"
          />
          <FlashContainer onPress={handleWhiteBalance}>
            {whiteBalance === Camera.Constants.WhiteBalance.auto && <Ionicons name={"sunny"} size={24} color="white" />}
            {whiteBalance === Camera.Constants.WhiteBalance.cloudy && <Ionicons name={"cloudy"} size={24} color="white" />}
            {whiteBalance === Camera.Constants.WhiteBalance.incandescent && <Ionicons name={"rainy"} size={24} color="white" />}
            {whiteBalance === Camera.Constants.WhiteBalance.fluorescent && <Ionicons name={"md-cloudy-night"} size={24} color="white" />}
          </FlashContainer>
        </ActionContainer>
      ) : null}
      {takenPhotoUri === "" ? (
        <CameraButtons>
          <TouchableOpacity onPress={handleNavigateToSelectPhotoScreen}>{previewPhoto && <PreviewPhotoImage source={{ uri: previewPhoto }} />}</TouchableOpacity>
          <TakePhotoButton onPress={handleTakePhoto}></TakePhotoButton>
          <FlipCameraTypeButton onPress={handleFlipCamera}>
            <MaterialIcons name="flip-camera-android" size={50} color="white" />
          </FlipCameraTypeButton>
        </CameraButtons>
      ) : (
        <ActionsButtons>
          <ActionButton onPress={handleCancel}>
            <Ionicons name="chevron-back-outline" size={27} color="white" />
          </ActionButton>
          <ActionButton onPress={handleUploadPhoto}>
            <ActionText>사진 업로드</ActionText>
          </ActionButton>
        </ActionsButtons>
      )}
    </Container>
  );
};

export default TakePhoto;
