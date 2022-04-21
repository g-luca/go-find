import { gql } from "@apollo/client/core";

export const AccountQuery = gql`
    query profile($address:String!) {
        account(where:{address:{_eq:$address}}){
            address
        }
        account_balances: action_account_balance(address:$address){
            coins
        }
        delegations: action_delegation(address:$address){
            delegations
        }
        unbonding_delegations: action_unbonding_delegation(address:$address){
            unbonding_delegations
        }
        redelegations: action_redelegation(address:$address){
            redelegations
        }
        delegation_rewards: action_delegation_reward(address:$address){
            coins
        }
    }
`;