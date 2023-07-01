import { useQuery } from "react-query";
import { fetchEntity } from "src/api/entity";
import { fetchCurrentUser, fetchCurrentUserAll } from "src/api/user";

interface UseCurrentUserParams {
	/**
	 * if set to true it fetches the user from
	 * the user/all route where all nested entities
	 * are included
	 */
	includeAllEntities?: boolean;
}
export const useCurrentUser = (params?: UseCurrentUserParams) => {
	const { data, ...queryResult } = useQuery(
		[params?.includeAllEntities ? "user/all" : "user"],
		params?.includeAllEntities ? fetchCurrentUserAll : fetchCurrentUser,
		{
			refetchOnWindowFocus: false,
		}
	);

	return {
		currentUser: data,
		...queryResult,
	};
};

export const useCurrentUserSettings = () => {
	const { data, ...queryResult } = useQuery(["userSettings"], () =>
		fetchEntity({ route: "userSettings" })
	);

	return {
		currentUserSettings: data,
		...queryResult,
	};
};

export const useIsCurrentUser = (user) => {
	const { currentUser } = useCurrentUser();
	return !!currentUser && currentUser?.id === user.id;
};
