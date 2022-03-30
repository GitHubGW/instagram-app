import "react-native-gesture-handler";
import { useEffect, useState } from "react";
import AppLoading from "expo-app-loading";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Font from "expo-font";
import { Asset } from "expo-asset";
import LoggedOutNav from "./navigators/LoggedOutNav";
import { NavigationContainer } from "@react-navigation/native";
import { Appearance } from "react-native";
import { darkTheme, lightTheme } from "./styles/themes";
import { ThemeProvider } from "styled-components/native";

const App = () => {
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light");
  const [loading, setLoading] = useState<boolean>(true);

  const startAsync = async (): Promise<void> => {
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
        <ThemeProvider theme={currentTheme === "light" ? lightTheme : darkTheme}>
          <NavigationContainer>
            <LoggedOutNav></LoggedOutNav>
          </NavigationContainer>
        </ThemeProvider>
      )}
    </>
  );
};

export default App;
