import { ApolloClient, InMemoryCache, makeVar, NormalizedCacheObject } from "@apollo/client";

export const isLoggedInVar = makeVar<boolean>(false);
export const isDarkModeVar = makeVar<boolean>(false);

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  uri: "https://0c5c-110-15-165-216.ngrok.io/graphql",
  cache: new InMemoryCache(),
});

export default client;
