import { gql } from "@apollo/client/core";

export const ApplicationLinkQuery = gql`
    query appLinks($dtag: String!, $appName: String!, $appUsername: String!) {
        profile(where:{dtag:{_ilike:$dtag}}){
            applications_links(where:{application:{_eq:$appName},_and:{username:{_eq:$appUsername}}}){
                state
                result
                username
            }
        }
    }
`;