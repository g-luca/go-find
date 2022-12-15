module.exports = {
    client: {
        service: {
            name: 'desmos-gql',
            url: `https://${process.env.VITE_APP_GRAPH_DESMOS_ENDPOINT}`,
        },
    },
}