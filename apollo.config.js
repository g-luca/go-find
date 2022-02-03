module.exports = {
    client: {
        service: {
            name: 'desmos-gql',
            url: `https://${import.meta.env.VITE_APP_GRAPH_ENDPOINT}`,
        },
    },
}