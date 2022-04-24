import Rooms from "../screens/Rooms";
import Room from "../screens/Room";
import { createStackNavigator } from "@react-navigation/stack";
import { useReactiveVar } from "@apollo/client";
import { isDarkModeVar } from "../apollo";

const Stack = createStackNavigator();

const RoomsNavigation = () => {
  const isDarkMode: "light" | "dark" = useReactiveVar(isDarkModeVar);

  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerStyle: { backgroundColor: isDarkMode === "light" ? "white" : "black" },
        headerTintColor: isDarkMode === "light" ? "black" : "white",
      }}
    >
      <Stack.Screen name="StackRooms" component={Rooms} options={{ headerTitle: "채팅" }} />
      <Stack.Screen name="StackRoom" component={Room} />
    </Stack.Navigator>
  );
};

export default RoomsNavigation;
