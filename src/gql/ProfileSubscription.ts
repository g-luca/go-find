import { gql } from "@apollo/client/core";

export const ProfileSubscription = gql`
    subscription profile($dtag: String!) {
        profile(where: {dtag: {_ilike: $dtag}}){
            dtag
            nickname
            address
            bio
            profile_pic
            cover_pic
            application_links {
                application
                username
                state
            }
            chain_links {
                external_address
                chain_config {
                    name
                }
            }
        }
    }
`;