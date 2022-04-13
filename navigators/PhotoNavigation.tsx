import { useReactiveVar } from "@apollo/client";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { isDarkModeVar } from "../apollo";
import SelectPhoto from "../screens/SelectPhoto";
import TakePhoto from "../screens/TakePhoto";
import Ionicons from "@expo/vector-icons/Ionicons";
import styled from "styled-components/native";

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

const HeaderRightContainer = styled.TouchableOpacity`
  padding-right: 10px;
`;

const HeaderRightText = styled.Text`
  font-size: 16px;
  color: ${(props) => props.theme.activeColor};
  font-weight: bold;
`;

const PhotoNavigation = () => {
  const isDarkMode: "light" | "dark" = useReactiveVar(isDarkModeVar);

  return (
    <Tab.Navigator
      tabBarPosition="bottom"
      screenOptions={{
        tabBarStyle: { backgroundColor: isDarkMode === "light" ? "white" : "black" },
        tabBarActiveTintColor: isDarkMode === "light" ? "black" : "white",
        tabBarIndicatorStyle: { backgroundColor: isDarkMode === "light" ? "black" : "white", top: 0 },
      }}
    >
      <Tab.Screen name="TabSelectPhoto" options={{ title: "사진 선택" }}>
        {() => (
          <Stack.Navigator
            screenOptions={{
              headerBackTitleVisible: false,
              headerStyle: { backgroundColor: isDarkMode === "light" ? "white" : "black" },
              headerTintColor: isDarkMode === "light" ? "black" : "white",
              headerBackImage: ({ tintColor }) => <Ionicons name="close" color={tintColor} size={32} />,
              headerRight: ({ tintColor, pressColor, pressOpacity, canGoBack }) => {
                return (
                  <HeaderRightContainer>
                    <HeaderRightText>다음</HeaderRightText>
                  </HeaderRightContainer>
                );
              },
            }}
          >
            <Stack.Screen options={{ title: "사진" }} name="StackSelectPhoto" component={SelectPhoto} />
          </Stack.Navigator>
        )}
      </Tab.Screen>
      <Tab.Screen name="TabTakePhoto" component={TakePhoto} options={{ title: "사진 촬영" }} />
    </Tab.Navigator>
  );
};

export default PhotoNavigation;
