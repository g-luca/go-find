import { gql } from "@apollo/client/core";

export const GovernanceQuery = gql`
query governance($address:String!) {
  
    gov_params{
      voting_params
      deposit_params
      tally_params
    }
    proposal_aggregate(where:{status:{_nin:["PROPOSAL_STATUS_DEPOSIT_PERIOD","PROPOSAL_STATUS_INVALID"]}}, order_by:{id:desc}){
      nodes{
        id
        title
        proposal_type
        description
        status
        deposit_end_time
        voting_end_time
        proposal_tally_result{
          no
          no_with_veto
          yes
          abstain
        }
        proposal_votes(where:{voter_address:{_eq:$address}}){
            option
            voter_address
        }
        staking_pool_snapshot{
          bonded_tokens
        }
      }
    }
  }  
`;