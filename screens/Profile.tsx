import Loading from "../components/Loading";
import styled from "styled-components/native";
import useLoggedInUser from "../hooks/useLoggedInUser";
import { handleLogout } from "../apollo";
import { useEffect, useState } from "react";
import { ApolloCache } from "@apollo/client";
import { RootStackParamList } from "../shared/shared.types";
import { FlatList, useWindowDimensions } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFollowUserMutation, useSeeProfileQuery, useUnfollowUserMutation } from "../generated/graphql";

type ProfileNavigationProps = NativeStackScreenProps<RootStackParamList, "StackProfile">;

const Container = styled.View`
  background-color: ${(props) => props.theme.bgColor};
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ProfileContainer = styled.View`
  flex: 1;
  width: 100%;
`;

const TopContainer = styled.View`
  padding: 15px 10px;
  padding-bottom: 0;
`;

const BottomContainer = styled.View`
  flex: 1;
`;

const UserContainer = styled.View`
  flex-direction: row;
  width: 100%;
`;

const AvatarContainer = styled.View``;

const Avatar = styled.Image`
  width: 80px;
  height: 80px;
  border-radius: 50px;
`;

const UserInfoContainer = styled.View<{ width: number }>`
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  width: ${(props) => props.width - 120}px;
`;

const PostContainer = styled.View`
  align-items: center;
`;

const FollowerContainer = styled.TouchableOpacity`
  align-items: center;
`;

const FollowingContainer = styled.TouchableOpacity`
  align-items: center;
`;

const CommonNumber = styled.Text`
  font-weight: bold;
  font-size: 20px;
`;

const CommonText = styled.Text`
  font-size: 15px;
  margin-top: 2px;
`;

const UserActionContainer = styled.View`
  padding: 13px 10px;
`;

const Username = styled.Text`
  font-weight: bold;
  font-size: 18px;
`;

const Bio = styled.Text`
  font-size: 15px;
  margin-top: 3px;
`;

const Buttons = styled.View`
  flex-direction: row;
  margin-top: 10px;
`;

const LeftActionButton = styled.TouchableOpacity`
  background-color: ${(props) => props.theme.activeColor};
  padding: 10px 12px;
  border-radius: 5px;
  font-size: 14px;
  flex: 1;
  margin-right: 10px;
  justify-content: center;
  align-items: center;
  height: 38px;
`;

const LeftActionButtonText = styled.Text`
  font-weight: bold;
  color: white;
`;

const RightAction = styled.TouchableOpacity`
  background-color: ${(props) => props.theme.bgContainerColor};
  border: ${(props) => props.theme.borderColor};
  padding: 10px 12px;
  border-radius: 5px;
  font-size: 14px;
  flex: 1;
  margin-right: 10px;
  justify-content: center;
  align-items: center;
  height: 38px;
`;

const RightActionText = styled.Text`
  font-weight: bold;
  color: ${(props) => props.theme.textColor};
`;

const FlatListContainer = styled(FlatList)`
  width: 100%;
`;

const ProfilePhotoContainer = styled.TouchableOpacity``;

const ProfilePhoto = styled.Image<{ width: number }>`
  width: ${(props) => props.width / 3}px;
  height: ${(props) => props.width / 3}px;
`;

const Profile = ({ navigation, route }: ProfileNavigationProps) => {
  const { width } = useWindowDimensions();
  const loggedInUser = useLoggedInUser();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { data: seeProfileData, loading: seeProfileLoading, refetch } = useSeeProfileQuery({ variables: { username: route.params?.username } });

  const [followUserMutation, { loading: followUserLoading }] = useFollowUserMutation({
    update: (cache, { data }) => {
      if (data?.followUser.ok === false) {
        return;
      }

      // followUsername = data?.followUser.user?.username;
      cache.modify({
        id: `User:${data?.followUser.user?.id}`,
        fields: {
          isFollowing: (isFollowing: boolean) => true,
          totalFollowers: (totalFollowers: number) => totalFollowers + 1,
        },
      });
      cache.modify({
        id: `User:${loggedInUser?.id}`,
        fields: {
          totalFollowing: (totalFollowing: number) => totalFollowing + 1,
        },
      });
    },
  });
  const [unfollowUserMutation, { loading: unfollowUserLoading }] = useUnfollowUserMutation({
    update: (cache, { data }) => {
      if (data?.unfollowUser.ok === false) {
        return;
      }

      // unfollowUsername = data?.unfollowUser.user?.username;
      cache.modify({
        id: `User:${data?.unfollowUser.user?.id}`,
        fields: {
          isFollowing: (isFollowing: boolean) => false,
          totalFollowers: (totalFollowers: number) => totalFollowers - 1,
        },
      });
      cache.modify({
        id: `User:${loggedInUser?.id}`,
        fields: {
          totalFollowing: (totalFollowing: number) => totalFollowing - 1,
        },
      });
    },
  });

  const handleToggleFollow = (isFollowing: boolean | undefined, username: string | undefined): void => {
    if (isFollowing === undefined || username === undefined) {
      return;
    }
    if (followUserLoading === true || unfollowUserLoading === true) {
      return;
    }
    if (isFollowing === false) {
      followUserMutation({ variables: { username } });
    } else if (isFollowing === true) {
      unfollowUserMutation({ variables: { username } });
    }
  };

  const handleNavigateToFollowersScreen = (): void => {
    navigation.navigate("StackFollowers", {
      name: seeProfileData?.seeProfile.user?.name,
      username: seeProfileData?.seeProfile.user?.username,
      followers: seeProfileData?.seeProfile.user?.followers,
    });
  };

  const handleNavigateToFollowingScreen = (): void => {
    navigation.navigate("StackFollowing", {
      name: seeProfileData?.seeProfile.user?.name,
      username: seeProfileData?.seeProfile.user?.username,
      following: seeProfileData?.seeProfile.user?.following,
    });
  };

  const handleNavigateToStackRoomsNavigation = (): void => {
    navigation.navigate("StackRoomsNavigation");
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
      <ProfilePhotoContainer onPress={() => handleNavigateToPhotoScreen(photo.id)}>
        <ProfilePhoto width={width} source={{ uri: photo.photoUrl }} />
      </ProfilePhotoContainer>
    );
  };

  useEffect(() => {
    if (route.params && route.params.name && route.params.username) {
      navigation.setOptions({ headerTitle: `${route.params?.name}(@${route.params?.username})` });
    }
  }, []);

  return (
    <Container>
      {seeProfileLoading === true ? (
        <Loading />
      ) : (
        <ProfileContainer>
          <TopContainer>
            <UserContainer>
              <AvatarContainer>
                {seeProfileData?.seeProfile.user?.avatarUrl ? (
                  <Avatar source={{ uri: seeProfileData?.seeProfile.user?.avatarUrl }} />
                ) : (
                  <Avatar source={require("../assets/basic_user.jpeg")} />
                )}
              </AvatarContainer>
              <UserInfoContainer width={width}>
                <PostContainer>
                  <CommonNumber>{seeProfileData?.seeProfile.user?.totalPhotos}</CommonNumber>
                  <CommonText>게시물</CommonText>
                </PostContainer>
                <FollowerContainer onPress={handleNavigateToFollowersScreen}>
                  <CommonNumber>{seeProfileData?.seeProfile.user?.totalFollowers}</CommonNumber>
                  <CommonText>팔로워</CommonText>
                </FollowerContainer>
                <FollowingContainer onPress={handleNavigateToFollowingScreen}>
                  <CommonNumber>{seeProfileData?.seeProfile.user?.totalFollowing}</CommonNumber>
                  <CommonText>팔로잉</CommonText>
                </FollowingContainer>
              </UserInfoContainer>
            </UserContainer>
            <UserActionContainer>
              <Username>{seeProfileData?.seeProfile.user?.username}</Username>
              <Bio>{seeProfileData?.seeProfile.user?.bio}</Bio>
              <Buttons>
                {route.params?.isMe === true ? (
                  <LeftActionButton>
                    <LeftActionButtonText>프로필 수정</LeftActionButtonText>
                  </LeftActionButton>
                ) : (
                  <LeftActionButton onPress={() => handleToggleFollow(seeProfileData?.seeProfile.user?.isFollowing, seeProfileData?.seeProfile.user?.username)}>
                    <LeftActionButtonText>
                      {followUserLoading === true || unfollowUserLoading === true ? <Loading /> : seeProfileData?.seeProfile.user?.isFollowing ? "팔로우 취소" : "팔로우"}
                    </LeftActionButtonText>
                  </LeftActionButton>
                )}
                {route.params?.isMe === true ? (
                  <RightAction onPress={handleLogout}>
                    <RightActionText>로그아웃</RightActionText>
                  </RightAction>
                ) : (
                  <RightAction onPress={handleNavigateToStackRoomsNavigation}>
                    <RightActionText>메시지</RightActionText>
                  </RightAction>
                )}
              </Buttons>
            </UserActionContainer>
          </TopContainer>
          <BottomContainer>
            <FlatListContainer
              key={"#"}
              numColumns={3}
              showsVerticalScrollIndicator={false}
              refreshing={refreshing}
              onRefresh={onRefresh}
              data={seeProfileData?.seeProfile.user?.photos}
              renderItem={renderItem}
              keyExtractor={(photo: any) => String(photo.id)}
            ></FlatListContainer>
          </BottomContainer>
        </ProfileContainer>
      )}
    </Container>
  );
};

export default Profile;
