import { gql } from "@apollo/client/core";

export const ApplicationLinkSubscription = gql`
    subscription appLinks($dtag: String!) {
        profile(where: {dtag: {_ilike: $dtag}}) {
            applications_links {
                application
                username
                state
            }
        }
    }
`;