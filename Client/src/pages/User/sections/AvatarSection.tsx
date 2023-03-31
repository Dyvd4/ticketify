import { Box, Button, ButtonGroup, Heading, useToast } from "@chakra-ui/react";
import { AxiosError } from "axios";
import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import FormControl from "src/components/Wrapper/FormControl";
import useGetProtectedImageUrl from "src/hooks/useGetProtectedImageUrl";
import { useIsCurrentUser } from "src/hooks/user";
import { request } from "src/services/request";
import { ValidationErrorMap, getValidationErrorMap, ValidationErrorResponse } from "src/utils/error";
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
    const [errorMap, setErrorMap] = useState<ValidationErrorMap | null>(null);

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
        },
        onError: (error: AxiosError<ValidationErrorResponse>) => {
            const errorMap = getValidationErrorMap(error);
            setErrorMap(errorMap);
        }
    });

    // dirty but works
    const resetInput = () => {
        avatarContainerRef.current!.querySelector("input")!.type = "text"
        avatarContainerRef.current!.querySelector("input")!.type = "file"
    }

    const resetAll = () => {
        resetInput();
        setErrorMap(null)
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
            <Box ref={avatarContainerRef}>
                <FormControl
                    className="flex justify-center items-center flex-col my-4"
                    errorMessage={errorMap?.files}>
                    <AvatarInput
                        disabled={!isOwnSite}
                        username={user.username}
                        imageSrc={newAvatarAsDataUrl || userAvatarImgUrl}
                        onChange={handleChange}
                    />
                    {!!newAvatarAsDataUrl && <>
                        <ButtonGroup className="mt-2">
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
                </FormControl>
            </Box>
        </>
    );
}

export default AvatarSection;