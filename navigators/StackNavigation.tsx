import Feed from "../screens/Feed";
import Likes from "../screens/Likes";
import Photo from "../screens/Photo";
import Search from "../screens/Search";
import Comments from "../screens/Comments";
import styled from "styled-components/native";
import Notification from "../screens/Notification";
import ProfileNavigation from "./ProfileNavigation";
import useLoggedInUser from "../hooks/useLoggedInUser";
import { isDarkModeVar } from "../apollo";
import { useReactiveVar } from "@apollo/client";
import { createStackNavigator } from "@react-navigation/stack";

interface StackNavigationProps {
  screenName: string;
}

const Stack = createStackNavigator();

const LogoContainer = styled.View`
  height: 100px;
`;

const LogoImage = styled.Image`
  width: 130px;
  height: 100%;
`;

const StackNavigation = ({ screenName }: StackNavigationProps) => {
  const isDarkMode: "light" | "dark" = useReactiveVar(isDarkModeVar);
  const loggedInUser = useLoggedInUser();

  return (
    <Stack.Navigator
      screenOptions={{
        presentation: "transparentModal",
        headerBackTitleVisible: false,
        headerTintColor: isDarkMode === "dark" ? "white" : "black",
        headerStyle: { backgroundColor: isDarkMode === "dark" ? "rgb(6,6,6)" : "rgb(250,250,250)", shadowColor: "gray" },
      }}
    >
      {screenName === "StackFeed" ? (
        <Stack.Screen
          name="StackFeed"
          component={Feed}
          options={{
            headerTitle: () => (
              <LogoContainer>
                {isDarkMode === "dark" ? (
                  <LogoImage source={require("../assets/instagram_logo_dark.png")} resizeMode="contain"></LogoImage>
                ) : (
                  <LogoImage source={require("../assets/instagram_logo_light.png")} resizeMode="contain"></LogoImage>
                )}
              </LogoContainer>
            ),
          }}
        ></Stack.Screen>
      ) : null}
      {screenName === "StackSearch" ? <Stack.Screen name="StackSearch" component={Search}></Stack.Screen> : null}
      {screenName === "StackNotification" ? <Stack.Screen name="StackNotification" component={Notification}></Stack.Screen> : null}
      {screenName === "StackProfileNavigation" ? (
        <Stack.Screen
          name="StackProfileNavigation"
          component={ProfileNavigation}
          initialParams={{
            id: loggedInUser?.id,
            username: loggedInUser?.username,
            name: loggedInUser?.name,
            avatarUrl: loggedInUser?.avatarUrl,
            isFollowing: false,
            isMe: loggedInUser?.isMe,
          }}
        ></Stack.Screen>
      ) : null}
      <Stack.Screen name="StackPhoto" component={Photo}></Stack.Screen>
      <Stack.Screen name="StackLikes" component={Likes}></Stack.Screen>
      <Stack.Screen name="StackComments" component={Comments}></Stack.Screen>
    </Stack.Navigator>
  );
};

export default StackNavigation;
