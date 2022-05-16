import Loading from "../components/Loading";
import styled from "styled-components/native";
import PhotoItem from "../components/PhotoItem";
import { useEffect } from "react";
import { useSeePhotoQuery } from "../generated/graphql";
import { RootStackParamList } from "../shared/shared.types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type PhotoNavigationProps = NativeStackScreenProps<RootStackParamList, "StackPhoto">;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
`;

const Container = styled.View`
  flex: 1;
`;

const Photo = ({ navigation, route }: PhotoNavigationProps) => {
  const { data: seePhotoData, loading: seePhotoLoading } = useSeePhotoQuery({ variables: { photoId: route.params.photoId } });

  useEffect(() => {
    navigation.setOptions({ headerTitle: "게시물" });
  }, []);

  return seePhotoLoading === true ? (
    <LoadingContainer>
      <Loading />
    </LoadingContainer>
  ) : (
    <Container>
      <PhotoItem {...seePhotoData?.seePhoto.photo} />
    </Container>
  );
};

export default Photo;
