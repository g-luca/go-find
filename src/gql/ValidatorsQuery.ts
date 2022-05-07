import { gql } from "@apollo/client/core";

export const ValidatorsQuery = gql`
    query validators{
        validator_aggregate(where: {validator_info: {operator_address: {_is_null: false}}}, order_by: [{validator_statuses_aggregate:{max:{status:desc_nulls_last}}},{validator_voting_powers_aggregate:{min:{voting_power:desc}}}]) {
            nodes {
                validator_info{
                    account{
                        address
                    }
                    operator_address
                    max_change_rate
                    max_rate
                }
                validator_statuses(limit:1,order_by:{height:desc}){
                    status
                    jailed
                }
                validator_signing_infos(limit:1,order_by:{height:desc}){
                missed_blocks_counter
                }
                validator_commissions{
                    min_self_delegation
                    commission
                }
                validator_descriptions(limit:1,order_by:{height:desc}){
                    avatar_url
                    details
                    moniker
                    security_contact
                    website
                }
                validator_voting_powers{
                    voting_power
                }
                
            }
        }
    }
`;