import { Button, ButtonGroup, Flex, Heading, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import FormControl from "src/components/Wrapper/FormControl";
import AvatarInput from "src/pages/User/components/AvatarInput";
import { request } from "src/services/request";
import { createDataUrl, getDataUrl } from "src/utils/image";

type AvatarSectionProps = {
    user: any
}

function AvatarSection({ user, ...props }: AvatarSectionProps) {

    const [avatar, setAvatar] = useState<File | null>(null);
    const [avatarAsDataUrl, setAvatarAsDataUrl] = useState<string | undefined>(getDataUrl(user.avatar.content, user.avatar.mimeType));

    const queryClient = useQueryClient();
    const toast = useToast();

    const mutation = useMutation(() => {
        const formData = new FormData();
        formData.append("files", avatar || "");
        return request().put("user/avatar", formData);
    }, {
        onSuccess: () => {
            toast({
                title: "successfully saved avatar",
                status: "success"
            });
            queryClient.invalidateQueries(["user/all"]);
        }
    });

    const handleChange = async (file: File | null) => {
        setAvatar(file);
        if (!file) return setAvatarAsDataUrl(getDataUrl(user.avatar.content, user.avatar.mimeType));
        const avatarAsDataUrl = await createDataUrl(file);
        if (!avatarAsDataUrl) return;
        setAvatarAsDataUrl(avatarAsDataUrl);
    }

    const hasSelectedNewAvatar = avatarAsDataUrl !== getDataUrl(user.avatar.content, user.avatar.mimeType);

    return (
        <>
            <Heading as="h1" className="font-bold text-2xl">
                Avatar
            </Heading>
            <FormControl>
                <Flex
                    gap={2}
                    className="my-4"
                    justifyContent={"center"}
                    alignItems={"center"}
                    flexDirection={"column"}>
                    <AvatarInput
                        imageSrc={avatarAsDataUrl}
                        onChange={(file) => handleChange(file)}
                    />
                    {hasSelectedNewAvatar && <>
                        <ButtonGroup>
                            <Button
                                size={"sm"}
                                onClick={() => setAvatarAsDataUrl(getDataUrl(user.avatar.content, user.avatar.mimeType))}
                                colorScheme={"red"}>
                                Discard
                            </Button>
                            <Button
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