import { useQuery } from "react-query";
import { fetchUser, fetchUserAll } from "src/api/user";

/** @param includeAll
 * if set to true it fetches the user from
 * the user/all route where all nested entities
 * are included
 */
export const useCurrentUser = (includeAll?: boolean) => {
    const { data, isLoading, isError } = useQuery([includeAll ? "user/all" : "user"], includeAll ? fetchUserAll : fetchUser);
    return { currentUser: data?.user, isLoading, isError };
}