import { useCurrentUser } from "src/hooks/user";
import { isAuthorizedForRole } from "../auth";
import { RoleName } from "../AuthenticatedArea";

const useIsAuthorizedForRole = (roleName: RoleName) => {
	const { currentUser } = useCurrentUser({ includeAllEntities: true });
	return !!currentUser && isAuthorizedForRole(currentUser, roleName);
};
export default useIsAuthorizedForRole;
