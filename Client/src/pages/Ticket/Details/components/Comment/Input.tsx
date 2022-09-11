import { Avatar, Button, ButtonGroup, Flex, Textarea } from "@chakra-ui/react";
import { ComponentPropsWithRef, useState } from "react";
import { useCurrentUser } from "src/hooks/user";
import { getDataUrl } from "src/utils/image";

type InputVariant = "add" | "reply" | "edit";

type InputProps = {
    value: string
    variant: InputVariant
    setValue(value: string): void
    onCancel(...args: any[]): void
    onSubmit(...args: any[]): void
} & ComponentPropsWithRef<"div">

type SaveButtonTextMap = {
    [key in InputVariant]: string
}

const saveButtonTextMap: SaveButtonTextMap = {
    add: "Comment",
    edit: "Save",
    reply: "Reply"
}

function Input(props: InputProps) {

    const {
        variant,
        value,
        setValue,
        onCancel,
        onSubmit,
        ...restProps
    } = props;

    const { currentUser: user } = useCurrentUser(true);

    const [buttonsActive, setButtonsActive] = useState(variant !== "add");

    const handleOnCancel = (e) => {
        setButtonsActive(false);
        onCancel(e);
    }

    const handleOnSubmit = (e) => {
        setButtonsActive(false);
        onSubmit(e);
    }

    return (
        <Flex gap={2} {...restProps}>
            {variant !== "edit" && user && <>
                <Avatar
                    name={user.username}
                    src={getDataUrl(user.avatar.content, user.avatar.mimeType)}
                    size={variant === "add" ? "md" : "sm"}
                />
            </>}
            <Flex
                gap={2}
                direction={"column"}
                className="w-full">
                <Textarea
                    onFocus={() => setButtonsActive(true)}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={`Add a ${variant === "add" ? "comment" : "reply"}...`}
                    maxLength={1000}
                />
                {buttonsActive && <>
                    <Flex justifyContent={"flex-end"}>
                        <ButtonGroup>
                            <Button
                                size={"sm"}
                                onClick={handleOnCancel}>
                                Cancel
                            </Button>
                            <Button
                                size={"sm"}
                                colorScheme={"blue"}
                                disabled={!value}
                                onClick={handleOnSubmit}>
                                {saveButtonTextMap[variant]}
                            </Button>
                        </ButtonGroup>
                    </Flex>
                </>}
            </Flex>
        </Flex>
    );
}

export default Input;