import { gql } from "@apollo/client/core";

export const AccountQuery = gql`
    query profile($dtag: String!, $address:String!) {
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
        }account(where:{address:{_eq: $address}}){
            account_balances{
                coins
            }
            delegations{
                amount
            }
            unbonding_delegations{
                amount
            }
            redelegations{
                amount
            }
        }
    }
`;