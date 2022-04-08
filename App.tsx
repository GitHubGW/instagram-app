import "react-native-gesture-handler";
import { useEffect, useState } from "react";
import AppLoading from "expo-app-loading";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Font from "expo-font";
import { Asset } from "expo-asset";
import { NavigationContainer } from "@react-navigation/native";
import { Appearance, StatusBar } from "react-native";
import { darkTheme, lightTheme } from "./styles/themes";
import { ThemeProvider } from "styled-components/native";
import { ApolloProvider, useReactiveVar } from "@apollo/client";
import LoggedInNavigation from "./navigators/LoggedInNavigation";
import LoggedOutNavigation from "./navigators/LoggedOutNavigation";
import client, { isLoggedInVar, tokenVar, cache } from "./apollo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AsyncStorageWrapper, persistCache } from "apollo3-cache-persist";

const App = () => {
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light");
  const [loading, setLoading] = useState<boolean>(true);
  const isLoggedIn: boolean = useReactiveVar(isLoggedInVar);

  const startAsync = async (): Promise<void> => {
    const token: string | null = await AsyncStorage.getItem("token");
    if (token) {
      isLoggedInVar(true);
      tokenVar(token);
    }
    await persistCache({ cache, storage: new AsyncStorageWrapper(AsyncStorage) });

    const ioniconsFontArray: { [key: string]: any }[] = [Ionicons.font];
    const loadedIoniconsFont: Promise<void>[] = ioniconsFontArray.map((ioniconsFont: { [key: string]: any }) => Font.loadAsync(ioniconsFont));
    const imageArray: string[] = [
      require("./assets/instagram_logo.png"),
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
        setCurrentTheme("dark");
      } else {
        setCurrentTheme("light");
      }
    });
  }, [currentTheme]);

  return (
    <>
      {loading === true ? (
        <AppLoading startAsync={startAsync} onFinish={onFinish} onError={onError} />
      ) : (
        <ApolloProvider client={client}>
          <StatusBar barStyle="light-content" />
          <ThemeProvider theme={currentTheme === "light" ? lightTheme : darkTheme}>
            <NavigationContainer>{isLoggedIn === true ? <LoggedInNavigation></LoggedInNavigation> : <LoggedOutNavigation></LoggedOutNavigation>}</NavigationContainer>
          </ThemeProvider>
        </ApolloProvider>
      )}
    </>
  );
};

export default App;
