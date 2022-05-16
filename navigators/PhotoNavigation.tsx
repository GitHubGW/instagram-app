import TakePhoto from "../screens/TakePhoto";
import SelectPhoto from "../screens/SelectPhoto";
import Ionicons from "@expo/vector-icons/Ionicons";
import { isDarkModeVar } from "../apollo";
import { useReactiveVar } from "@apollo/client";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

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
