import { useCurrentUser } from "src/hooks/user";

const useAuthState = () => {
	const { currentUser, ...query } = useCurrentUser({ includeAllEntities: true });
	const hasEmailConfirmation = !!currentUser && currentUser.emailConfirmed;
	return {
		...query,
		currentUser,
		hasEmailConfirmation,
		isAuthenticated: !!currentUser,
	};
};

export default useAuthState;
