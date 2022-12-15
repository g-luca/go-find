import { gql } from "@apollo/client/core";

/**
 * @param usernaame A username string that can be a dtag, nickname or an ApplicationLink username. Followed by %
 */
export const ProfileSearchQuery = gql`
    query ProfileSearch($query: String!) {
        profile(where: {_or: [{dtag: {_ilike: $query}}, {nickname: {_ilike: $query}}, {applications_links: {username: {_ilike: $query}}}]}, limit:20) {
            nickname
            dtag
            profile_pic
            applications_links {
            application
            username
            }
        }
    }

`;