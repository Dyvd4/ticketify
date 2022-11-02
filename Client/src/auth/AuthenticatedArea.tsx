import { useQuery } from "react-query";
import { Navigate, Outlet } from "react-router-dom";
import LoadingRipple from "src/components/Loading/LoadingRipple";
import { fetchUser } from "../api/user";
import { isAuthenticated, isHalfAuthenticated } from "./auth";
import RestrictedAccess from "./RestrictedAccess";

type AuthenticatedAreaProps = ({
    type?: "route"
    /** If set to true, checks if user is half authenticated instead of full.
     * Half authenticated means that the e-mail is not confirmed yet.
     */
    half?: boolean
} |
{
    type?: "area"
    /** If set to true, checks if user is half authenticated instead of full.
     * Half authenticated means that the e-mail is not confirmed yet.
     */
    half?: boolean
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

    else if (props.half
        ? isHalfAuthenticated(data.user)
        : isAuthenticated(data.user)) {
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
                returnElement = <Navigate to="/Auth/EmailNotConfirmed" />
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