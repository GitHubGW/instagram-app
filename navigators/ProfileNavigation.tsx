import Profile from "../screens/Profile";
import Followers from "../screens/Followers";
import Followering from "../screens/Following";
import { useEffect } from "react";
import { isDarkModeVar } from "../apollo";
import { useReactiveVar } from "@apollo/client";
import { RootStackParamList } from "../shared/shared.types";
import { createStackNavigator } from "@react-navigation/stack";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type ProfileNavigationProps = NativeStackScreenProps<RootStackParamList, "StackProfileNavigation">;

const Stack = createStackNavigator();

const ProfileNavigation = ({ navigation, route }: ProfileNavigationProps) => {
  const isDarkMode: "light" | "dark" = useReactiveVar(isDarkModeVar);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerStyle: { backgroundColor: isDarkMode === "light" ? "white" : "black" },
        headerTintColor: isDarkMode === "light" ? "black" : "white",
      }}
    >
      <Stack.Screen name="StackProfile" component={Profile} initialParams={route.params} />
      <Stack.Screen name="StackFollowers" component={Followers} options={{ headerTitle: "팔로워" }} />
      <Stack.Screen name="StackFollowing" component={Followering} options={{ headerTitle: "팔로잉" }} />
    </Stack.Navigator>
  );
};

export default ProfileNavigation;
