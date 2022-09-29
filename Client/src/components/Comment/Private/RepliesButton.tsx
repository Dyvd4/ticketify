import { Avatar, Flex } from "@chakra-ui/react";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ComponentPropsWithRef } from "react";
import { getDataUrl } from "src/utils/image";
import { AvatarType } from "../Comment";

type RepliesButtonProps = {
    avatar?: AvatarType
    repliesCount: number
    active: boolean
    setActive(...args: any[]): void
} & ComponentPropsWithRef<"div">

function RepliesButton(props: RepliesButtonProps) {

    const { avatar, repliesCount, active, setActive, ...restProps } = props;

    return (
        <div className={`cursor-pointer uppercase select-none 
                         font-bold text-sm
                         text-primary`}>
            <Flex
                onClick={() => setActive(!active)}
                gap={1}
                alignItems={"center"}
                {...restProps}>
                <FontAwesomeIcon icon={active ? faCaretUp : faCaretDown} />
                {avatar && <>
                    <Avatar
                        className="ml-2"
                        name={avatar.username}
                        src={getDataUrl(avatar.content, avatar.mimeType)}
                        size={"2xs"}
                    />
                </>}
                <div className="ml-2">
                    {repliesCount}
                </div>
                <div>
                    replies
                </div>
            </Flex>
        </div>
    );
}

export default RepliesButton;