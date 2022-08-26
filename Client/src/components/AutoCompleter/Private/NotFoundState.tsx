import { faFrown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * list item for not found state
 */
function NotFoundState({ className, ...rest }: React.ComponentPropsWithRef<"li">) {
    return (
        <li className={`autocomplete-list-item no-underline
                        flex justify-center items-center gap-2
                      dark:text-white ${className}`}
            {...rest}>
            <span>
                Not found
            </span>
            <FontAwesomeIcon icon={faFrown} size="lg" />
        </li>
    );
}

export default NotFoundState;