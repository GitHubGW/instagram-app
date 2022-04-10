import { useReactiveVar } from "@apollo/client";
import { ActivityIndicator } from "react-native";
import { isDarkModeVar } from "../apollo";

const Loading = () => {
  const isDarkMode: "light" | "dark" = useReactiveVar(isDarkModeVar);

  return <ActivityIndicator color={isDarkMode === "light" ? "black" : "white"}></ActivityIndicator>;
};

export default Loading;
