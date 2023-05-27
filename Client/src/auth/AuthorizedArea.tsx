import { useQuery } from "react-query";
import { Navigate, Outlet } from "react-router-dom";
import ErrorAlert from "src/components/ErrorAlert";
import LoadingRipple from "src/components/Loading/LoadingRipple";
import { fetchCurrentUser } from "../api/user";
import { isAuthenticated, isAuthorized as defaultIsAuthorized } from "./auth";
import RestrictedAccess from "./RestrictedAccess";

type AuthorizedAreaProps =
    | {
          type?: "route";
          authorizationStrategy?(user): boolean;
      }
    | {
          type?: "area";
          children: React.ReactNode;
          showRestrictedAccess?: boolean;
          authorizationStrategy?(user): boolean;
      };

function AuthorizedArea(props: AuthorizedAreaProps) {
    const {
        type = "area",
        // @ts-ignore
        showRestrictedAccess = type === "area" ? true : false,
    } = props;

    const { isLoading, isError, data: user } = useQuery(["user"], fetchCurrentUser);

    let returnElement: any = null;

    const isAuthorized = props.authorizationStrategy
        ? (user) => isAuthenticated(user) && props.authorizationStrategy!(user)
        : defaultIsAuthorized;

    if (isLoading) returnElement = <LoadingRipple usePortal />;
    else if (isError) returnElement = <ErrorAlert />;
    else if (isAuthorized(user)) {
        if (type === "route") {
            returnElement = <Outlet />;
        }
        if (type === "area") {
            returnElement = "children" in props ? props.children : null;
        }
    } else {
        if (type === "route") {
            // half unauthenticated
            if (user && !user.emailConfirmed) {
                returnElement = <Navigate to="/Auth/EmailNotConfirmed" />;
            }
            // fully unauthenticated
            else {
                returnElement = (
                    <Navigate to="/Auth/SignIn" state={{ prevRoute: window.location.pathname }} />
                );
            }
        }
        if (type === "area") {
            returnElement = showRestrictedAccess ? <RestrictedAccess type="Authorization" /> : null;
        }
    }

    return returnElement;
}
export default AuthorizedArea;
