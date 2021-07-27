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
            }
        }account(where:{address:{_eq: $address}}){
            account_balances{
                coins
            }
            delegation_rewards{
                amount
            }
            redelegations{
                amount
            }
            
        }
    }
`;