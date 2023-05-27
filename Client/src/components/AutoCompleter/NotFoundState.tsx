import { faFrown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * list item for not found state
 */
function NotFoundState({ className, ...rest }: React.ComponentPropsWithRef<"li">) {
    return (
        <li
            className={`autocomplete-list-item flex
                        items-center justify-center gap-2 no-underline
                      dark:text-white ${className}`}
            {...rest}
        >
            <span>Not found</span>
            <FontAwesomeIcon icon={faFrown} size="lg" />
        </li>
    );
}

export default NotFoundState;
