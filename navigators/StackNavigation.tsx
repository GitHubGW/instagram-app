import { createStackNavigator } from "@react-navigation/stack";
import { Dimensions } from "react-native";
import styled from "styled-components/native";
import Feed from "../screens/Feed";
import Notification from "../screens/Notification";
import Me from "../screens/Me";
import Photo from "../screens/Photo";
import Profile from "../screens/Profile";
import Search from "../screens/Search";
import Likes from "../screens/Likes";
import Comments from "../screens/Comments";
import { useReactiveVar } from "@apollo/client";
import { isDarkModeVar } from "../apollo";

interface StackNavigationProps {
  screenName: string;
}

const Stack = createStackNavigator();
const windowWidth: number = Dimensions.get("screen").width;

const LogoContainer = styled.View`
  height: 100px;
`;

const LogoImage = styled.Image`
  width: 130px;
  height: 100%;
`;

const StackNavigation = ({ screenName }: StackNavigationProps) => {
  const isDarkMode: "light" | "dark" = useReactiveVar(isDarkModeVar);

  return (
    <Stack.Navigator
      screenOptions={{
        presentation: "transparentModal",
        headerBackTitleVisible: false,
        headerTintColor: isDarkMode === "dark" ? "white" : "black",
        headerStyle: { backgroundColor: isDarkMode === "dark" ? "rgb(4,4,4)" : "rgb(250,250,250)", shadowColor: "gray" },
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
                  <LogoImage source={require("../assets/instagram_logo_light.png")} resizeMode="contain"></LogoImage>
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
      {screenName === "StackMe" ? <Stack.Screen name="StackMe" component={Me}></Stack.Screen> : null}
      <Stack.Screen name="StackProfile" component={Profile}></Stack.Screen>
      <Stack.Screen name="StackPhoto" component={Photo}></Stack.Screen>
      <Stack.Screen name="StackLikes" component={Likes}></Stack.Screen>
      <Stack.Screen name="StackComments" component={Comments}></Stack.Screen>
    </Stack.Navigator>
  );
};

export default StackNavigation;
