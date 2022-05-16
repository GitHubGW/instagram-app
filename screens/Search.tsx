import Loading from "../components/Loading";
import styled from "styled-components/native";
import { isDarkModeVar } from "../apollo";
import { useEffect, useState } from "react";
import { useReactiveVar } from "@apollo/client";
import { useForm, Controller } from "react-hook-form";
import { RootStackParamList } from "../shared/shared.types";
import { useSearchPhotosLazyQuery } from "../generated/graphql";
import { TouchableOpacity } from "react-native-gesture-handler";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FlatList, ScaledSize, useWindowDimensions } from "react-native";

type SearchNavigationProps = NativeStackScreenProps<RootStackParamList, "StackSearch">;

interface FormData {
  text: string;
}

const Container = styled.View`
  background-color: ${(props) => props.theme.bgColor};
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const SearchInput = styled.TextInput<{ width: number; isDarkMode: string }>`
  padding: 8px 10px;
  border-radius: 5px;
  width: ${(props) => props.width / 1.1}px;
  background-color: ${(props) => (props.isDarkMode === "light" ? "#F0F0F0" : "#181818")};
  color: ${(props) => (props.isDarkMode === "light" ? "black" : "white")};
`;

const SearchingContainer = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
  width: 100%;
`;

const SearchingText = styled.Text`
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

const Search = ({ navigation }: SearchNavigationProps) => {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [keyword, setKeyword] = useState<string>("");
  const { width }: ScaledSize = useWindowDimensions();
  const isDarkMode: "light" | "dark" = useReactiveVar(isDarkModeVar);
  const { control, getValues } = useForm<FormData>({ defaultValues: { text: "" } });
  const [searchPhotosLazyQuery, { data: searchPhotosData, loading: searchPhotosLoading, refetch }] = useSearchPhotosLazyQuery();

  const onSubmitEditing = (): void => {
    if (searchPhotosLoading === true) {
      return;
    }
    const { text } = getValues();
    searchPhotosLazyQuery({ variables: { keyword: text } });
    setKeyword(text);
  };

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
    navigation.setOptions({
      headerTitle: () => (
        <Controller
          name="text"
          control={control}
          rules={{ required: true, minLength: 1, maxLength: 20 }}
          render={({ field: { onChange, value } }) => (
            <SearchInput
              width={width}
              isDarkMode={isDarkMode}
              value={value}
              onChangeText={onChange}
              onSubmitEditing={onSubmitEditing}
              keyboardType="default"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
              placeholder="사진을 검색해보세요."
              placeholderTextColor="gray"
            />
          )}
        ></Controller>
      ),
    });
  }, []);

  return (
    <Container>
      {searchPhotosLoading === true && (
        <SearchingContainer>
          <Loading />
          <SearchingText>검색중...</SearchingText>
        </SearchingContainer>
      )}
      {searchPhotosLoading === false && searchPhotosData?.searchPhotos.photos?.length === 0 && <SearchingText>{keyword}키워드의 사진이 없습니다.</SearchingText>}
      {searchPhotosLoading === false && searchPhotosData?.searchPhotos.photos && searchPhotosData?.searchPhotos.photos?.length > 0 && (
        <FlatListContainer
          numColumns={3}
          refreshing={refreshing}
          onRefresh={onRefresh}
          data={searchPhotosData?.searchPhotos.photos}
          renderItem={renderItem}
          keyExtractor={(photo: any) => String(photo.id)}
        ></FlatListContainer>
      )}
    </Container>
  );
};

export default Search;
