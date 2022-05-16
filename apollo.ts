import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "graphql-ws";
import { onError } from "@apollo/client/link/error";
import { WebSocketLink } from "@apollo/client/link/ws";
import { createUploadLink } from "apollo-upload-client";
import { setContext } from "@apollo/client/link/context";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { FragmentDefinitionNode, OperationDefinitionNode } from "graphql";
import { getMainDefinition, offsetLimitPagination } from "@apollo/client/utilities";
import { ApolloClient, ApolloLink, createHttpLink, InMemoryCache, makeVar, NormalizedCacheObject, split } from "@apollo/client";

export const isLoggedInVar = makeVar<boolean>(false);
export const tokenVar = makeVar<string>("");
export const isDarkModeVar = makeVar<"light" | "dark">("light");

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
    client.clearStore();
    isLoggedInVar(false);
    tokenVar("");
  } catch (error) {
    console.log("handleLogout error");
  }
};

const httpLink: ApolloLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
});

const authLink: ApolloLink = setContext((_, { headers }) => {
  return { headers: { ...headers, token: tokenVar() } };
});

const errorLink: ApolloLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    console.log("graphQLErrors", graphQLErrors);
  }
  if (networkError) {
    console.log("networkError", networkError);
  }
});

const uploadHttpLink: ApolloLink = createUploadLink({
  uri: "https://instagram-gw.herokuapp.com/graphql",
});

const uploadHttpLinks: ApolloLink = authLink.concat(errorLink).concat(uploadHttpLink);

/* GraphQLWsLink
const wsLink: GraphQLWsLink = new GraphQLWsLink(
  createClient({
    url: "ws://instagram-gw.herokuapp.com/graphql",
    connectionParams: () => ({
      token: tokenVar(),
    }),
  })
);
*/

const wsLink = new WebSocketLink({
  uri: "ws://instagram-gw.herokuapp.com/graphql",
  options: {
    reconnect: true,
    connectionParams: () => ({
      token: tokenVar(),
    }),
  },
});

const splitLink = split(
  ({ query }) => {
    const definition: OperationDefinitionNode | FragmentDefinitionNode = getMainDefinition(query);
    const isSubscription: boolean = definition.kind === "OperationDefinition" && definition.operation === "subscription";
    return isSubscription;
  },
  wsLink,
  uploadHttpLinks
);

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        seeFeed: {
          keyArgs: false,
          merge(existing, incoming) {
            if (existing) {
              const result = { ...existing, ...incoming, photos: [...existing.photos, ...incoming.photos] };
              return result;
            }
            return incoming;
          },
        },
      },
    },
  },
});

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  link: splitLink,
  cache,
});

export default client;
