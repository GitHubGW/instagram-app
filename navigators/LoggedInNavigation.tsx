import { createStackNavigator } from "@react-navigation/stack";
import TabNavigation from "./TabNavigation";
import PhotoNavigation from "./PhotoNavigation";

const Stack = createStackNavigator();

const LoggedInNav = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, presentation: "card" }}>
      <Stack.Screen name="StackTabNavigation" component={TabNavigation} />
      <Stack.Screen name="StackPhotoNavigation" component={PhotoNavigation} />
    </Stack.Navigator>
  );
};

export default LoggedInNav;
