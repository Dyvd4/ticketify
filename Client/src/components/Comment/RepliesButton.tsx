import { Avatar, Box, Flex } from "@chakra-ui/react";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ComponentPropsWithRef } from "react";
import useGetProtectedImageUrl from "src/hooks/useGetProtectedImageUrl";
import { AvatarType } from "./Comment";

type RepliesButtonProps = {
    avatar?: AvatarType
    repliesCount: number
    active: boolean
    setActive(...args: any[]): void
} & ComponentPropsWithRef<"div">

function RepliesButton(props: RepliesButtonProps) {

    const { avatar, repliesCount, active, setActive, ...restProps } = props;
    const [avatarImgUrl] = useGetProtectedImageUrl(avatar?.contentRoute as any, !avatar?.contentRoute);

    return (
        <Box
            className={`cursor-pointer uppercase select-none text-sky-600 hover:text-sky-500
                         font-bold text-sm`}>
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
                        src={avatarImgUrl}
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
        </Box>
    );
}

export default RepliesButton;