import { Button, MenuButton as ChakraMenuButton, MenuButtonProps as ChakraMenuButtonProps, useBoolean, useOutsideClick } from "@chakra-ui/react";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef } from "react";

type MenuButtonProps = {
} & ChakraMenuButtonProps

function MenuButton(props: MenuButtonProps) {

    const [active, setActive] = useBoolean(false);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const { children } = props;

    useOutsideClick({
        ref: buttonRef,
        handler: setActive.off
    });

    return (
        <ChakraMenuButton
            ref={buttonRef}
            onClick={() => setActive.toggle()}
            as={Button}
            {...props}>
            <span>
                {children}
            </span>&nbsp;&nbsp;
            <FontAwesomeIcon
                className={`transition-all duration-100 transform ${active ? "rotate-180" : ""}`}
                icon={faChevronUp}
                size={"sm"} />
        </ChakraMenuButton>
    );
}

export default MenuButton;