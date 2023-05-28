/**
 * list item for loading state
 */
function LoadingState({ className, ...rest }: React.ComponentPropsWithRef<"li">) {
	return (
		<li className={`autocomplete-list-item dark:text-white ${className}`} {...rest}>
			searching...
		</li>
	);
}

export default LoadingState;
