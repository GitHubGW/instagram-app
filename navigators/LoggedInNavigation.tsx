import TabNavigation from "./TabNavigation";
import RoomsNavigation from "./RoomsNavigation";
import PhotoNavigation from "./PhotoNavigation";
import ProfileNavigation from "./ProfileNavigation";
import UploadPhotoNavigation from "./UploadPhotoNavigation";
import { isDarkModeVar } from "../apollo";
import { useReactiveVar } from "@apollo/client";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const LoggedInNav = () => {
  const isDarkMode: "light" | "dark" = useReactiveVar(isDarkModeVar);

  return (
    <Stack.Navigator screenOptions={{ presentation: "card" }}>
      <Stack.Screen name="StackTabNavigation" component={TabNavigation} options={{ headerShown: false }} />
      <Stack.Screen name="StackPhotoNavigation" component={PhotoNavigation} options={{ headerShown: false }} />
      <Stack.Screen
        name="StackUploadPhotoNavigation"
        component={UploadPhotoNavigation}
        options={{
          headerTitle: "사진 업로드",
          headerBackTitleVisible: false,
          headerStyle: { backgroundColor: isDarkMode === "light" ? "white" : "black" },
          headerTintColor: isDarkMode === "light" ? "black" : "white",
        }}
      />
      <Stack.Screen name="StackRoomsNavigation" component={RoomsNavigation} options={{ headerShown: false }} />
      <Stack.Screen name="StackProfileNavigation" component={ProfileNavigation} />
    </Stack.Navigator>
  );
};

export default LoggedInNav;
