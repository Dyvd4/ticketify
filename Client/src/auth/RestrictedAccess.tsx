interface RestrictedAccessProps {
	type: "Authentication" | "Authorization";
}

const RestrictedAccessTypeMap = {
	Authentication: "authenticated",
	Authorization: "authorized",
};

function RestrictedAccess({ type }: RestrictedAccessProps) {
	const { prevRoute } = window.history.state.usr ?? {};

	let message = `You are not ${RestrictedAccessTypeMap[type]} to access this area`;
	if (prevRoute)
		message = `You are not ${RestrictedAccessTypeMap[type]} to access route: ${prevRoute}`;

	return <div data-testid="RestrictedAccess">{message}</div>;
}

export default RestrictedAccess;
