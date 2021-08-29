import { gql } from "@apollo/client/core";

export const StatusSubscription = gql`
    subscription status {
        block(limit: 1, order_by: {height: desc}) {
            timestamp
            height
        }
    }
`;