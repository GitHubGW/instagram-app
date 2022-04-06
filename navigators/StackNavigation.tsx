import { createStackNavigator } from "@react-navigation/stack";
import { Dimensions } from "react-native";
import styled from "styled-components/native";
import Feed from "../screens/Feed";
import Likes from "../screens/Likes";
import Me from "../screens/Me";
import Photo from "../screens/Photo";
import Profile from "../screens/Profile";
import Search from "../screens/Search";

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
  return (
    <Stack.Navigator
      screenOptions={{
        presentation: "transparentModal",
        headerBackTitleVisible: false,
        headerTintColor: "white",
        headerStyle: { backgroundColor: "black", shadowColor: "white" },
      }}
    >
      {screenName === "StackFeed" ? (
        <Stack.Screen
          name="StackFeed"
          component={Feed}
          options={{
            headerTitle: () => (
              <LogoContainer>
                <LogoImage source={require("../assets/instagram_logo.png")} resizeMode="contain"></LogoImage>
              </LogoContainer>
            ),
          }}
        ></Stack.Screen>
      ) : null}
      {screenName === "StackSearch" ? <Stack.Screen name="StackSearch" component={Search}></Stack.Screen> : null}
      {screenName === "StackLikes" ? <Stack.Screen name="StackLikes" component={Likes}></Stack.Screen> : null}
      {screenName === "StackMe" ? <Stack.Screen name="StackMe" component={Me}></Stack.Screen> : null}
      <Stack.Screen name="StackProfile" component={Profile}></Stack.Screen>
      <Stack.Screen name="StackPhoto" component={Photo}></Stack.Screen>
    </Stack.Navigator>
  );
};

export default StackNavigation;
