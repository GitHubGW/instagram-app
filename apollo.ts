import { ApolloClient, ApolloLink, createHttpLink, InMemoryCache, makeVar, NormalizedCacheObject } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setContext } from "@apollo/client/link/context";

export const isLoggedInVar = makeVar<boolean>(false);
export const tokenVar = makeVar<string>("");
export const isDarkModeVar = makeVar<boolean>(false);

export const handleLogin = async (token: string): Promise<void> => {
  try {
    const tokenData: string[] = ["token", token];
    const isLoggedInData: string[] = ["isLoggedIn", JSON.stringify(true)];
    await AsyncStorage.multiSet([tokenData, isLoggedInData]);
    isLoggedInVar(true);
    tokenVar(token);
  } catch (error) {
    console.log("handleLogin error");
  }
};

export const handleLogout = async (): Promise<void> => {
  try {
    const keys: string[] = ["token", "isLoggedIn"];
    await AsyncStorage.multiRemove(keys);
    isLoggedInVar(false);
    tokenVar("");
  } catch (error) {
    console.log("handleLogout error");
  }
};

const httpLink: ApolloLink = createHttpLink({ uri: "https://0c5c-110-15-165-216.ngrok.io/graphql" });

const authLink: ApolloLink = setContext((_, { headers }) => {
  return { headers: { ...headers, token: tokenVar() } };
});

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
