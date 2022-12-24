import { Button, ButtonGroup, Flex, Heading, useToast } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import FormControl from "src/components/Wrapper/FormControl";
import useGetProtectedImageUrl from "src/hooks/useProtectedImage";
import { useIsCurrentUser } from "src/hooks/user";
import { request } from "src/services/request";
import { createDataUrl } from "src/utils/image";
import AvatarInput from "../components/AvatarInput";

type AvatarSectionProps = {
    user: any
}

function AvatarSection({ user, ...props }: AvatarSectionProps) {

    const isOwnSite = useIsCurrentUser(user);

    const [userAvatarImgUrl] = useGetProtectedImageUrl(user.avatar?.contentRoute, !user.avatar)
    const [newAvatarAsDataUrl, setNewAvatarAsDataUrl] = useState<string | undefined>();
    const [avatar, setAvatar] = useState<File | null>(null);

    const avatarContainerRef = useRef<HTMLDivElement | null>(null);

    const queryClient = useQueryClient();
    const toast = useToast();

    const mutation = useMutation(() => {
        const formData = new FormData();
        formData.append("file", avatar || "");
        return request().put("user/avatar", formData);
    }, {
        onSuccess: async () => {
            await queryClient.invalidateQueries(["user/all"]);
            resetAll();
            toast({
                title: "successfully saved avatar",
                status: "success"
            });
        }
    });

    // dirty but works
    const resetInput = () => {
        avatarContainerRef.current!.querySelector("input")!.type = "text"
        avatarContainerRef.current!.querySelector("input")!.type = "file"
    }

    const resetAll = () => {
        resetInput();
        setNewAvatarAsDataUrl(undefined);
    }

    const handleDiscard = resetAll;

    const handleChange = async (file: File | null) => {
        if (!file) return;
        setAvatar(file);
        const avatarAsDataUrl = await createDataUrl(file!);
        if (!avatarAsDataUrl) return;
        setNewAvatarAsDataUrl(avatarAsDataUrl);
    }

    return (
        <>
            <Heading as="h1" className="font-bold text-2xl">
                Avatar
            </Heading>
            <FormControl>
                <Flex
                    ref={avatarContainerRef}
                    gap={2}
                    className="my-4"
                    justifyContent={"center"}
                    alignItems={"center"}
                    flexDirection={"column"}>
                    <AvatarInput
                        disabled={!isOwnSite}
                        username={user.username}
                        imageSrc={newAvatarAsDataUrl || userAvatarImgUrl}
                        onChange={handleChange}
                    />
                    {!!newAvatarAsDataUrl && <>
                        <ButtonGroup>
                            <Button
                                size={"sm"}
                                onClick={handleDiscard}
                                colorScheme={"red"}>
                                Discard
                            </Button>
                            <Button
                                isLoading={mutation.isLoading}
                                size={"sm"}
                                onClick={() => mutation.mutate()}
                                colorScheme={"blue"}>
                                Submit
                            </Button>
                        </ButtonGroup>
                    </>}
                </Flex>
            </FormControl>
        </>
    );
}

export default AvatarSection;