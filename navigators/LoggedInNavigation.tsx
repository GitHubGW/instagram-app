import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import Search from "../screens/Search";
import StackNavigation from "./StackNavigation";
import { useReactiveVar } from "@apollo/client";
import { isDarkModeVar } from "../apollo";
import useLoggedInUser from "../hooks/useLoggedInUser";
import styled from "styled-components/native";

const Tab = createBottomTabNavigator();

const AvatarImage = styled.Image<{ focused: boolean }>`
  width: 26px;
  height: 26px;
  border-radius: 26px;
  border-width: 1px;
  border-color: ${(props) => (props.focused === true ? "lightgray" : "transparent")};
`;

const LoggedInNav = () => {
  const loggedInUser = useLoggedInUser();
  const isDarkMode: "light" | "dark" = useReactiveVar(isDarkModeVar);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: { backgroundColor: isDarkMode === "dark" ? "rgb(6,6,6)" : "rgb(250,250,250)", shadowColor: "gray" },
        tabBarActiveTintColor: isDarkMode === "dark" ? "white" : "black",
      }}
    >
      <Tab.Screen
        name="TabFeed"
        options={{
          tabBarIcon: ({ focused, color, size }): React.ReactNode => {
            return <Ionicons name={focused === true ? "home" : "home-outline"} size={26} color={color} />;
          },
        }}
      >
        {() => <StackNavigation screenName="StackFeed"></StackNavigation>}
      </Tab.Screen>
      <Tab.Screen
        name="TabSearch"
        options={{
          tabBarIcon: ({ focused, color, size }): React.ReactNode => {
            return <Ionicons name={focused === true ? "search" : "search-outline"} size={26} color={color} />;
          },
        }}
      >
        {() => <StackNavigation screenName="StackSearch"></StackNavigation>}
      </Tab.Screen>
      <Tab.Screen
        name="TabCamera"
        component={Search}
        options={{
          tabBarIcon: ({ focused, color, size }): React.ReactNode => {
            return <Ionicons name={focused === true ? "camera" : "camera-outline"} size={28} color={color} />;
          },
        }}
      ></Tab.Screen>
      <Tab.Screen
        name="TabNotification"
        options={{
          tabBarIcon: ({ focused, color, size }): React.ReactNode => {
            return <Ionicons name={focused === true ? "heart" : "heart-outline"} size={26} color={color} />;
          },
        }}
      >
        {() => <StackNavigation screenName="StackNotification"></StackNavigation>}
      </Tab.Screen>
      <Tab.Screen
        name="TabMe"
        options={{
          tabBarIcon: ({ focused, color, size }): React.ReactNode => {
            return loggedInUser ? (
              <AvatarImage focused={focused} source={{ uri: loggedInUser.avatarUrl || "" }} />
            ) : (
              <Ionicons name={focused === true ? "person" : "person-outline"} size={26} color={color} />
            );
          },
        }}
      >
        {() => <StackNavigation screenName="StackMe"></StackNavigation>}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default LoggedInNav;
