import { Avatar, Button, ButtonGroup, Flex, Textarea } from "@chakra-ui/react";
import { ComponentPropsWithRef, useState } from "react";
import useGetProtectedImageUrl from "src/hooks/useGetProtectedImageUrl";
import { AvatarType } from "./Comment";

type InputVariant = "add" | "reply" | "edit";

type InputProps = {
    value: string
    variant: InputVariant
    avatar?: AvatarType
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
        avatar,
        ...restProps
    } = props;

    const [buttonsActive, setButtonsActive] = useState(variant !== "add");
    const [avatarImgUrl] = useGetProtectedImageUrl(avatar?.contentRoute as any, !avatar?.contentRoute);

    const handleOnCancel = (e) => {
        setButtonsActive(false);
        onCancel(e);
    }

    const handleOnSubmit = (e) => {
        setButtonsActive(false);
        onSubmit(e);
    }

    return (
        <Flex
            data-testid="CommentInput"
            gap={2}
            {...restProps}>
            {variant !== "edit" && avatar && <>
                <Avatar
                    name={avatar.username}
                    src={avatarImgUrl}
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