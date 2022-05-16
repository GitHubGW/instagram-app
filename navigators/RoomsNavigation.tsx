import Room from "../screens/Room";
import Rooms from "../screens/Rooms";
import { isDarkModeVar } from "../apollo";
import { useReactiveVar } from "@apollo/client";
import { createStackNavigator } from "@react-navigation/stack";

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
