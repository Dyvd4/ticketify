import { useQuery } from "react-query";
import { fetchCurrentUser, fetchCurrentUserAll } from "src/api/user";
import { isAuthenticated, isHalfAuthenticated } from "src/auth/auth";

interface UseCurrentUserParams {
    /**
     * if set to true it fetches the user from
     * the user/all route where all nested entities
     * are included
     */
    includeAllEntities?: boolean
}
export const useCurrentUser = (params?: UseCurrentUserParams) => {

    const { data, ...queryResult } = useQuery([params?.includeAllEntities ? "user/all" : "user"], params?.includeAllEntities ? fetchCurrentUserAll : fetchCurrentUser);

    return {
        currentUser: data,
        ...queryResult
    };
}

interface UseCurrentUserWithAuthenticationParams extends UseCurrentUserParams {
    /** If set to true, checks if user is half authenticated instead of full.
     * Half authenticated means that the e-mail is not confirmed yet.
     */
    half?: boolean

}
export const useCurrentUserWithAuthentication = (params: UseCurrentUserWithAuthenticationParams = {}) => {

    const {
        half,
        ...useCurrentUserParams
    } = params

    const { currentUser, ...queryResult } = useCurrentUser(useCurrentUserParams);

    return {
        currentUser,
        ...queryResult,
        isAuthenticated: params?.half
            ? isHalfAuthenticated(currentUser)
            : isAuthenticated(currentUser)
    }
}

export const useIsCurrentUser = (user) => {
    const { currentUser } = useCurrentUser();
    return currentUser?.id === user.id;
}