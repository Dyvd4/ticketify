import { useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import LoadingCircle from "../components/LoadingCircle";
import { request } from "../services/request";

const Todos = () => {

    // Mutations
    const queryClient = useQueryClient();

    const addTodo = async (todo) => {
        await request().post("todo", todo);
    }

    const mutation = useMutation(addTodo, {
        onSuccess: () => {
            queryClient.invalidateQueries(["todos"]);
        }
    });

    const inputRef = useRef<HTMLInputElement>(null);

    // Queries 
    const { isLoading, isError, data } = useQuery(["todos"], async () => {
        const response = await request().get("todos");
        return response.data as Array<{
            task: string,
            color: string,
            _id: string
        }>;
    });

    if (isLoading) return <LoadingCircle loading />

    if (isError) {
        return (
            <div className="text-red-500">An error occurred</div>
        )
    }

    // handlers
    const handleClick = () => {
        mutation.mutate({ task: inputRef.current?.value, color: "red" })
    }
    return (
        <>
            <ul>
                {data.map(todo => {
                    return <li key={todo._id} className={`bg-${todo.color}-500`}>
                        {todo.task}
                    </li>
                })}
            </ul>
            <input ref={inputRef} type="text" />
            <button onClick={handleClick}>
                Add Todo
            </button>
            <button onClick={() => { request().post("tetse") }}>test</button>
        </>
    )
}

export default Todos;