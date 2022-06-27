import Loading from "../components/Loading";
import styled from "styled-components/native";
import KeyboardAvoidingLayout from "../components/KeyboardAvoidingLayout";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { ReactNativeFile } from "apollo-upload-client";
import { RootStackParamList } from "../shared/shared.types";
import { useUploadPhotoMutation } from "../generated/graphql";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type UploadPhotoNavigationProps = NativeStackScreenProps<RootStackParamList, "StackUploadPhotoNavigation">;

interface UploadPhotoFormData {
  text: string;
}

const Container = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.bgColor};
`;

const Photo = styled.Image`
  flex: 0.9;
  flex: 1;
`;

const CaptionContainer = styled.View`
  margin-top: 10px;
  padding: 0 20px;
  position: absolute;
  bottom: 50px;
  width: 100%;
`;

const CaptionTextInput = styled.TextInput`
  background-color: ${(props) => props.theme.inputBgColor};
  padding: 12px 20px;
  padding-left: 10px;
  border-radius: 5px;
`;

const HeaderRightContainer = styled.TouchableOpacity`
  padding: 10px 12px;
`;

const HeaderRightText = styled.Text`
  font-size: 17px;
  color: ${(props) => props.theme.activeColor};
  font-weight: bold;
`;

const UploadPhotoNavigation = ({ navigation, route }: UploadPhotoNavigationProps) => {
  const { control, handleSubmit, getValues } = useForm<UploadPhotoFormData>();
  const [uploadPhotoMutation, { loading: uploadPhotoLoading }] = useUploadPhotoMutation({
    update: (cache, { data }) => {
      if (data?.uploadPhoto.ok === true) {
        cache.modify({
          id: "ROOT_QUERY",
          fields: {
            seeFeed(prev) {
              const result = { ...prev, photos: [data.uploadPhoto.photo, ...prev.photos] };
              return result;
            },
          },
        });
        navigation.navigate("StackTabNavigation");
      }
    },
  });

  const onValid = (): void => {
    const { text } = getValues();
    if (text === "") {
      return;
    }
    const file: ReactNativeFile = new ReactNativeFile({
      uri: route.params?.photoUri,
      name: `${Date.now()}.jpg`,
      type: "image/jpeg",
    });
    uploadPhotoMutation({ variables: { photo: file, caption: text } });
  };

  useEffect(() => {
    navigation.setOptions({
      ...(uploadPhotoLoading === true && { headerLeft: () => null }),
      headerRight: () => {
        return <HeaderRightContainer onPress={handleSubmit(onValid)}>{uploadPhotoLoading === true ? <Loading /> : <HeaderRightText>업로드</HeaderRightText>}</HeaderRightContainer>;
      },
    });
  }, [uploadPhotoLoading]);

  return (
    <KeyboardAvoidingLayout>
      <Container>
        <Photo source={{ uri: route.params?.photoUri }}></Photo>
        <CaptionContainer>
          <Controller
            name="text"
            control={control}
            rules={{ required: true, minLength: 1, maxLength: 100 }}
            render={({ field: { onChange, value } }) => (
              <CaptionTextInput
                value={value}
                onChangeText={onChange}
                onSubmitEditing={handleSubmit(onValid)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                placeholder="사진에 대한 설명을 입력해주세요."
                placeholderTextColor="gray"
                blurOnSubmit={false}
                maxLength={100}
              ></CaptionTextInput>
            )}
          ></Controller>
        </CaptionContainer>
      </Container>
    </KeyboardAvoidingLayout>
  );
};

export default UploadPhotoNavigation;
