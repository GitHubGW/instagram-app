import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import Search from "../screens/Search";
import StackNavigation from "./StackNavigation";

const Tab = createBottomTabNavigator();

const LoggedInNav = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: { backgroundColor: "black", borderTopColor: "#444" },
        tabBarActiveTintColor: "white",
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
            return <Ionicons name={focused === true ? "person" : "person-outline"} size={26} color={color} />;
          },
        }}
      >
        {() => <StackNavigation screenName="StackMe"></StackNavigation>}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default LoggedInNav;
