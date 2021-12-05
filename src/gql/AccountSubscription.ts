import { gql } from "@apollo/client/core";

export const AccountSubscription = gql`
    subscription profile($address:String!) {
        account(where:{address:{_eq: $address}}){
            address
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