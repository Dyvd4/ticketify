import { Navigate, Outlet } from "react-router-dom";
import ErrorAlert from "src/components/ErrorAlert";
import LoadingRipple from "src/components/Loading/LoadingRipple";
import { isAuthorizedForRole } from "./auth";
import useAuthState from "./hooks/useAuthState";

export type RoleName = "super-admin" | "admin" | "customer";
type AuthenticatedAreaProps = {
	/** If set to true, checks if user is half authenticated instead of full.
	 * Half authenticated means that the e-mail is not confirmed yet.
	 */
	ignoreEmailConfirmation?: boolean;
	roleName?: RoleName;
} & (
	| {
			type?: "route";
	  }
	| {
			type?: "area";
			children: React.ReactNode;
	  }
);

function AuthenticatedArea(props: AuthenticatedAreaProps) {
	const { type = "area" } = props;

	const { isAuthenticated, hasEmailConfirmation, isLoading, isError, currentUser } =
		useAuthState();
	const userIsAuthorizedForRole =
		props.roleName && currentUser && isAuthorizedForRole(currentUser, props.roleName);
	let returnElement;

	if (isLoading) returnElement = <LoadingRipple usePortal />;
	else if (isError) returnElement = <ErrorAlert />;
	else {
		if (isAuthenticated && !hasEmailConfirmation && !props.ignoreEmailConfirmation) {
			returnElement = <Navigate to="/Auth/EmailNotConfirmed" />;
		} else if (isAuthenticated && type === "route") {
			if (props.roleName && !userIsAuthorizedForRole) {
				returnElement = <Navigate to={"/RestrictedAccess"} />;
			} else {
				returnElement = <Outlet />;
			}
		} else if (isAuthenticated && type === "area") {
			if (props.roleName && !userIsAuthorizedForRole) {
				returnElement = null;
			} else {
				returnElement = "children" in props ? props.children : null;
			}
		} else {
			if (type === "route") {
				returnElement = (
					<Navigate to="/Auth/SignIn" state={{ prevRoute: window.location.pathname }} />
				);
			}
			if (type === "area") {
				returnElement = null;
			}
		}
	}

	return returnElement;
}
export default AuthenticatedArea;
