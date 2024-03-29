import { ApolloClient, createHttpLink, InMemoryCache, split } from '@apollo/client/core'
import { createApolloProvider } from '@vue/apollo-option'
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from 'apollo-utilities'

// HTTP connection to the API
const httpLink = createHttpLink({
    // You should use an absolute URL here
    uri: `https://${import.meta.env.VITE_APP_GRAPH_DESMOS_ENDPOINT}`,
})

const wsLink = new WebSocketLink({
    uri: `wss://${import.meta.env.VITE_APP_GRAPH_WS_DESMOS_ENDPOINT}`,
    options: {
        reconnect: true,
        timeout: 30000,
    },
})

const link = split(
    // split based on operation type
    ({ query }) => {
        const definition = getMainDefinition(query)
        return definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
    },
    wsLink,
    httpLink,
)

// Cache implementation
const cache = new InMemoryCache()

// Create the apollo client
export const apolloClientDesmos = new ApolloClient({
    link: link,
    cache,
})

export const apolloProviderDesmos = createApolloProvider({
    defaultClient: apolloClientDesmos,
})
