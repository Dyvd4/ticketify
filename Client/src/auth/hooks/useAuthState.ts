import { useCurrentUser } from "src/hooks/user";
import { hasEmailConfirmation } from "../auth";

const useAuthState = () => {
	const { currentUser, ...query } = useCurrentUser({ includeAllEntities: true });
	return {
		...query,
		currentUser,
		hasEmailConfirmation: !!currentUser && hasEmailConfirmation(currentUser),
		isAuthenticated: !!currentUser,
	};
};

export default useAuthState;
