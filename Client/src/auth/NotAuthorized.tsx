interface NotAuthorizedProps {
}

function NotAuthorized(props: NotAuthorizedProps) {
    const { prevRoute } = window.history.state.usr ?? {};
    let message = `You are not authorized to access this area`;
    if (prevRoute) message = `You are not authorized to access route: ${prevRoute}`;
    return (
        <div>{message}</div>
    );
}

export default NotAuthorized;