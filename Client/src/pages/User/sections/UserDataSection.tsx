import { Flex, Heading, IconButton, Tooltip, useDisclosure, useToast } from "@chakra-ui/react";
import { faEdit, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQueryClient } from "react-query";
import { generateFakePassword } from "src/utils/password";
import EmailEditModal from "../modals/EmailEditModal";
import PasswordEditModal from "../modals/PasswordEditModal";
import UsernameEditModal from "../modals/UsernameEditModal";

type UserDataSectionProps = {
    user: any
}

function UserDataSection({ user, ...props }: UserDataSectionProps) {

    const { isOpen: usernameEditModalOpen, onOpen: onUsernameEditModalOpen, onClose: onUsernameEditModalClose } = useDisclosure();
    const { isOpen: emailEditModalOpen, onOpen: onEmailEditModalOpen, onClose: onEmailEditModalClose } = useDisclosure();
    const { isOpen: passwordEditModalOpen, onOpen: onPasswordEditModalOpen, onClose: onPasswordEditModalClose } = useDisclosure();

    const queryClient = useQueryClient();
    const toast = useToast();

    const handleEditSuccess = async (fieldName: string) => {
        await queryClient.invalidateQueries(["user/all"]);
        toast({
            title: `successfully saved ${fieldName}`,
            status: "success"
        });
    }

    return (
        <>
            <Heading as="h1" className="font-bold text-2xl">
                Profile data &nbsp;
                <FontAwesomeIcon icon={faUser} />
            </Heading>
            <Flex className="mt-2" justifyContent={"space-between"}>
                <div>Username</div>
                <div className="flex gap-2 items-center">
                    <div>{user.username}</div>
                    <Tooltip label="edit" placement="top">
                        <IconButton
                            size={"sm"}
                            onClick={onUsernameEditModalOpen}
                            aria-label="edit"
                            icon={<FontAwesomeIcon icon={faEdit} />}
                        />
                    </Tooltip>
                </div>
            </Flex>
            <Flex
                gap={4}
                className="mt-2 whitespace-nowrap"
                justifyContent={"space-between"}
                alignItems={"center"}>
                <div>E-mail</div>
                <div className="flex gap-2 items-center min-w-0">
                    <div className="truncate">{user.email || "-"}</div>
                    <Tooltip label="edit" placement="top">
                        <IconButton
                            size={"sm"}
                            onClick={onEmailEditModalOpen}
                            aria-label="edit"
                            icon={<FontAwesomeIcon icon={faEdit} />}
                        />
                    </Tooltip>
                </div>
            </Flex>
            <Flex className="mt-2" justifyContent={"space-between"}>
                <div>Password</div>
                <div className="flex gap-2 items-center">
                    <div>{generateFakePassword(10)}</div>
                    <Tooltip label="edit" placement="top">
                        <IconButton
                            size={"sm"}
                            onClick={onPasswordEditModalOpen}
                            aria-label="edit"
                            icon={<FontAwesomeIcon icon={faEdit} />}
                        />
                    </Tooltip>
                </div>
            </Flex>
            <UsernameEditModal
                user={user}
                isOpen={usernameEditModalOpen}
                onClose={onUsernameEditModalClose}
                onSuccess={() => handleEditSuccess("username")}
            />
            <EmailEditModal
                user={user}
                isOpen={emailEditModalOpen}
                onClose={onEmailEditModalClose}
                onSuccess={() => handleEditSuccess("email")}
            />
            <PasswordEditModal
                user={user}
                isOpen={passwordEditModalOpen}
                onClose={onPasswordEditModalClose}
                onSuccess={() => handleEditSuccess("password")}
            />
        </>
    );
}

export default UserDataSection;