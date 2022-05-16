import "react-native-gesture-handler";
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";
import Ionicons from "@expo/vector-icons/Ionicons";
import LoggedInNavigation from "./navigators/LoggedInNavigation";
import LoggedOutNavigation from "./navigators/LoggedOutNavigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import client, { isLoggedInVar, tokenVar, cache, isDarkModeVar } from "./apollo";
import { Asset } from "expo-asset";
import { useEffect, useState } from "react";
import { darkTheme, lightTheme } from "./styles/themes";
import { ThemeProvider } from "styled-components/native";
import { NavigationContainer } from "@react-navigation/native";
import { ApolloProvider, useReactiveVar } from "@apollo/client";
import { Appearance, ColorSchemeName, StatusBar } from "react-native";
import { AsyncStorageWrapper, persistCache } from "apollo3-cache-persist";

const App = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const isLoggedIn: boolean = useReactiveVar(isLoggedInVar);
  const isDarkMode: "light" | "dark" = useReactiveVar(isDarkModeVar);

  const startAsync = async (): Promise<void> => {
    const colorSchemeName: ColorSchemeName = Appearance.getColorScheme();
    isDarkModeVar(colorSchemeName === "light" ? "light" : "dark");

    const token: string | null = await AsyncStorage.getItem("token");
    if (token) {
      isLoggedInVar(true);
      tokenVar(token);
    }

    await persistCache({ cache, storage: new AsyncStorageWrapper(AsyncStorage) });
    const ioniconsFontArray: { [key: string]: any }[] = [Ionicons.font];
    const loadedIoniconsFont: Promise<void>[] = ioniconsFontArray.map((ioniconsFont: { [key: string]: any }) => Font.loadAsync(ioniconsFont));
    const imageArray: string[] = [
      require("./assets/instagram_logo_light.png"),
      require("./assets/instagram_logo_dark.png"),
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/840px-Instagram_logo.svg.png",
    ];
    const loadedImage: Promise<Asset[]>[] = imageArray.map((image: string) => Asset.loadAsync(image));
    Promise.all([loadedIoniconsFont, loadedImage]); // Promise.all<Promise<void> | Promise<Asset[]>>([...loadedIoniconsFont, ...loadedImage]);
  };

  const onFinish = (): void => {
    console.log("onFinish");
    setLoading(false);
  };

  const onError = (): void => {
    console.log("onError");
  };

  useEffect(() => {
    Appearance.addChangeListener(({ colorScheme }) => {
      if (colorScheme === "dark") {
        isDarkModeVar("dark");
      } else {
        isDarkModeVar("light");
      }
    });
  }, [isDarkMode]);

  return (
    <>
      {loading === true ? (
        <AppLoading startAsync={startAsync} onFinish={onFinish} onError={onError} />
      ) : (
        <ApolloProvider client={client}>
          <StatusBar barStyle={isDarkMode === "light" ? "dark-content" : "light-content"} />
          <ThemeProvider theme={isDarkMode === "light" ? lightTheme : darkTheme}>
            <NavigationContainer>{isLoggedIn === true ? <LoggedInNavigation></LoggedInNavigation> : <LoggedOutNavigation></LoggedOutNavigation>}</NavigationContainer>
          </ThemeProvider>
        </ApolloProvider>
      )}
    </>
  );
};

export default App;
