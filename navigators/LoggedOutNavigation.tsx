import Enter from "../screens/Enter";
import Login from "../screens/Login";
import SignUp from "../screens/SignUp";
import { isDarkModeVar } from "../apollo";
import { useReactiveVar } from "@apollo/client";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const LoggedOutNav = () => {
  const isDarkMode: "light" | "dark" = useReactiveVar(isDarkModeVar);

  return (
    <Stack.Navigator
      screenOptions={{
        presentation: "transparentModal",
        headerTitle: () => false,
        headerMode: "screen",
        headerTransparent: true,
        headerBackTitleVisible: false,
        headerTintColor: isDarkMode === "dark" ? "white" : "black",
      }}
    >
      <Stack.Screen name="StackEnter" component={Enter}></Stack.Screen>
      <Stack.Screen name="StackLogin" component={Login}></Stack.Screen>
      <Stack.Screen name="StackSignUp" component={SignUp}></Stack.Screen>
    </Stack.Navigator>
  );
};

export default LoggedOutNav;
