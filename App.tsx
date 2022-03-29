import AppLoading from "expo-app-loading";
import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Font from "expo-font";
import { Asset, useAssets } from "expo-asset";

interface IoniconsFont {
  [key: string]: any;
}

const App = () => {
  const [loading, setLoading] = useState<boolean>(true);

  const startAsync = async (): Promise<void> => {
    const ioniconsFontArray: IoniconsFont[] = [Ionicons.font];
    const loadedIoniconsFont: Promise<void>[] = ioniconsFontArray.map((ioniconsFont: IoniconsFont) => Font.loadAsync(ioniconsFont));
    const imageArray: string[] = [
      require("./assets/instagram_logo.png"),
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/840px-Instagram_logo.svg.png",
    ];
    const loadedImage: Promise<Asset[]>[] = imageArray.map((image) => Asset.loadAsync(image));
    // Promise.all<Promise<void> | Promise<Asset[]>>([...loadedIoniconsFont, ...loadedImage]);
    Promise.all([loadedIoniconsFont, loadedImage]);
  };

  const onFinish = (): void => {
    console.log("onFinish");
    setLoading(false);
  };

  const onError = (): void => {
    console.log("onError");
  };

  return (
    <>
      {loading === true ? (
        <AppLoading startAsync={startAsync} onFinish={onFinish} onError={onError} />
      ) : (
        <View style={styles.container}>
          <Text>hello</Text>
          <StatusBar style="auto" />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default App;
