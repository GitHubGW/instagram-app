import { createStackNavigator } from "@react-navigation/stack";
import Enter from "../screens/Enter";
import Login from "../screens/Login";
import SignUp from "../screens/SignUp";

const Stack = createStackNavigator();

const LoggedOutNav = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        presentation: "transparentModal",
        headerTitle: () => false,
        headerMode: "screen",
        headerTransparent: true,
        headerBackTitleVisible: false,
        headerTintColor: "white",
      }}
    >
      <Stack.Screen name="StackEnter" component={Enter}></Stack.Screen>
      <Stack.Screen name="StackLogin" component={Login}></Stack.Screen>
      <Stack.Screen name="StackSignUp" component={SignUp}></Stack.Screen>
    </Stack.Navigator>
  );
};

export default LoggedOutNav;
