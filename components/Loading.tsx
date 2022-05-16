import { isDarkModeVar } from "../apollo";
import { useReactiveVar } from "@apollo/client";
import { ActivityIndicator } from "react-native";

const Loading = () => {
  const isDarkMode: "light" | "dark" = useReactiveVar(isDarkModeVar);

  return <ActivityIndicator color={isDarkMode === "light" ? "black" : "white"} size={12}></ActivityIndicator>;
};

export default Loading;
