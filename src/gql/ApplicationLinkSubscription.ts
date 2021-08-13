import { gql } from "@apollo/client/core";

export const ApplicationLinkSubscription = gql`
    subscription appLinks($dtag: String!) {
        profile(where: {dtag: {_ilike: $dtag}}) {
            application_links {
                application
                username
                state
            }
        }
    }
`;