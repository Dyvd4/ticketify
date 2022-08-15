import { useQuery } from "react-query";
import { Navigate, Outlet } from "react-router-dom";
import LoadingRipple from "src/components/Loading/LoadingRipple";
import { fetchUser } from "../api/user";
import NotAuthorized from "./NotAuthorized";

interface ProtectedRouteProps {
    type?: "route"
    showNotAuthorized?: boolean
}

interface ProtectedAreaProps {
    type?: "area"
    children: React.ReactNode
    showNotAuthorized?: boolean
}

// used if you want to have partial access to some pages
// can be extended for e.g. roles (currently only if authorized or not)
function ProtectedArea(props: ProtectedAreaProps | ProtectedRouteProps) {
    const {
        type = "area",
        showNotAuthorized = type === "area" ? true : false
    } = props;
    const { isLoading, isError, data } = useQuery(["user"], fetchUser);
    let returnElement;
    if (isLoading) returnElement = <LoadingRipple centered />
    else if (isError) returnElement = <div className="text-red-500">An error occurred</div>;
    else if (data?.user) returnElement = type === "area" && "children" in props ? props.children : <Outlet />;
    else {
        if (type === "area") {
            returnElement = showNotAuthorized ? <NotAuthorized /> : null
        }
        else {
            returnElement = showNotAuthorized
                ? <Navigate to="/NotAuthorized" state={{ prevRoute: window.location.pathname }} />
                : <Navigate to="/Auth/SignIn" state={{ prevRoute: window.location.pathname }} />
        }
    }
    return returnElement;
}
export default ProtectedArea;