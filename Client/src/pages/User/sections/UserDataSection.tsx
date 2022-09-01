import { Flex, Heading, IconButton, Tooltip, useDisclosure, useToast } from "@chakra-ui/react";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { generateFakePassword } from "src/utils/password";
import PasswordEditModal from "../components/PasswordEditModal";
import UsernameEditModal from "../components/UsernameEditModal";

type UserDataSectionProps = {
    user: any
    refetch(...args: any[]): void
}

function UserDataSection({ user, ...props }: UserDataSectionProps) {

    const { isOpen: usernameEditModalOpen, onOpen: onUsernameEditModalOpen, onClose: onUsernameEditModalClose } = useDisclosure();
    const { isOpen: passwordEditModalOpen, onOpen: onPasswordEditModalOpen, onClose: onPasswordEditModalClose } = useDisclosure();

    const toast = useToast();

    const handleEditSuccess = (fieldName: string) => {
        toast({
            title: `successfully saved ${fieldName}`,
            status: "success"
        })
        props.refetch();
    }

    return (
        <>
            <Flex justifyContent={"space-between"}>
                <Heading as="h1" className="font-bold text-2xl">
                    Profile data 😎
                </Heading>
            </Flex>
            <Flex className="mt-2" justifyContent={"space-between"}>
                <div>username</div>
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
            <Flex className="mt-2" justifyContent={"space-between"}>
                <div>
                    password
                </div>
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