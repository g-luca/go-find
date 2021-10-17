module.exports = {
    client: {
        service: {
            name: 'desmos-gql',
            url: `https://${process.env.VUE_APP_GRAPH_ENDPOINT}`,
        },
    },
}