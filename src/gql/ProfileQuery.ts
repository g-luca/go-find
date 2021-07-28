import { gql } from "@apollo/client/core";

export const ProfileQuery = gql`
    query profile($dtag: String!) {
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
            }
            chain_links {
                external_address
                chain_link_chain_config {
                    name
                }
            }
        }
    }
`;