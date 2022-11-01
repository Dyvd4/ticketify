import { useQuery } from "react-query";
import { Navigate, Outlet } from "react-router-dom";
import LoadingRipple from "src/components/Loading/LoadingRipple";
import { fetchUser } from "../api/user";
import { isAuthenticated } from "./auth";
import RestrictedAccess from "./RestrictedAccess";

type AuthenticatedAreaProps = ({
    type?: "route"
} |
{
    type?: "area"
    children: React.ReactNode
    showRestrictedAccess?: boolean
});

function AuthenticatedArea(props: AuthenticatedAreaProps) {

    const {
        type = "area",
        // @ts-ignore
        showRestrictedAccess = type === "area" ? true : false,
    } = props;

    const { isLoading, isError, data } = useQuery(["user"], fetchUser);

    let returnElement;

    if (isLoading) returnElement = <LoadingRipple centered />

    else if (isError) returnElement = <div className="text-red-500">An error occurred</div>;

    else if (isAuthenticated(data.user)) {
        if (type === "route") {
            returnElement = <Outlet />
        }
        if (type === "area") {
            returnElement = "children" in props
                ? props.children
                : null;
        }
    }
    else {
        if (type === "route") {
            // half unauthenticated
            if (data.user && !data.user.emailConfirmed) {
                returnElement = <Navigate to="/EmailNotConfirmed" />
            }
            // fully unauthenticated
            else {
                returnElement = <Navigate to="/Auth/SignIn" state={{ prevRoute: window.location.pathname }} />;
            }
        }
        if (type === "area") {
            returnElement = showRestrictedAccess
                ? <RestrictedAccess type="Authentication" />
                : null;
        }
    }

    return returnElement;
}
export default AuthenticatedArea;