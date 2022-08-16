import { useEffect, useState } from "react"
import { useQuery } from "react-query";
import { fetchUser } from "src/api/user";

export const useCurrentUser = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const { data } = useQuery(["user"], fetchUser);
    useEffect(() => {
        if (data?.user) setCurrentUser(data.user);
    }, [data])
    return { currentUser, setCurrentUser };
}