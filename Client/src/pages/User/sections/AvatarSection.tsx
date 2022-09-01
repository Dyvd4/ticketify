import { Button, ButtonGroup, Flex, Heading, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { useMutation } from "react-query";
import AvatarInput from "src/components/AvatarInput";
import FormControl from "src/components/Wrapper/FormControl";
import { request } from "src/services/request";
import { getValidationErrorMap, ValidationErrorMap } from "src/utils/error";
import { createDataUrl, getDataUrl } from "src/utils/image";

type AvatarSectionProps = {
    user: any
    refetch(...args: any[]): void
}

function AvatarSection({ user, ...props }: AvatarSectionProps) {

    const [avatar, setAvatar] = useState<File | null>(null);
    const [avatarAsDataUrl, setAvatarAsDataUrl] = useState<string | undefined>(getDataUrl(user.avatar.content, user.avatar.mimeType));
    const [errorMap, setErrorMap] = useState<ValidationErrorMap | null>(null);
    const toast = useToast();


    const mutation = useMutation(() => {
        const formData = new FormData();
        formData.append("files", avatar || "");
        return request({
            validateStatus: (status) => status < 500
        }).put("user/avatar", formData);
    }, {
        onSuccess: (response) => {
            const errorMap = getValidationErrorMap({ response });
            setErrorMap(errorMap);
            if (!errorMap) {
                toast({
                    title: "successfully saved avatar",
                    status: "success"
                });
                props.refetch();
            }
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
            <FormControl errorMessage={errorMap?.Fildless}>
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