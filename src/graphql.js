import Vue from "vue";
import VueApollo from "vue-apollo";
import ApolloClient from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { split } from "apollo-link";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";

Vue.use(VueApollo);

// HTTP connection to the API
const httpLink = createHttpLink({
  // For production you should use an absolute URL here
  uri: `${window.location.origin}/graphql`,
});

// Create the subscription websocket link
const wsLink = new WebSocketLink({
  uri: `wss://${window.location.host}/graphql`,
  options: {
    reconnect: true,
  },
});

// Split link based on operation type
const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink, // Send subscription traffic to websocket link
  httpLink // All other traffic to http link
);

// Create apollo client/provider with our link
const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: link,
});

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
});

export default apolloProvider;
