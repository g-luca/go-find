import { gql } from "@apollo/client/core";

export const ProfileQuery = gql`
    query profile($dtag: String!, $address:String) {
        profile(where: { _or: [{dtag: {_ilike: $dtag}}, {address: {_ilike: $address}} ] }){
            dtag
            nickname
            address
            bio
            profile_pic
            cover_pic
            applications_links {
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