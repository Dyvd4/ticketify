import { Tag, useDisclosure, useToast } from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { fetchEntity } from "src/api/entity";
import TagConfirmMenu from "src/components/TagConfirmMenu";
import { request } from "src/services/request";

type RoleTagConfirmMenuProps = {
	role: any;
	userId: string;
};

function RoleTagConfirmMenu({ userId, role }: RoleTagConfirmMenuProps) {
	// hooks
	// -----
	const toast = useToast();
	const queryClient = useQueryClient();
	const { isOpen, onOpen, onClose } = useDisclosure();

	// queries
	// -------
	const { data: rolesResponse, isLoading } = useQuery(["user-roles"], () =>
		fetchEntity({ route: "user-roles" })
	);

	// mutations
	// ---------
	const mutation = useMutation<any, any, any, any>(
		(newRole) => request().put(`user/${userId}/role`, { roleId: newRole.id }),
		{
			onSuccess: async () => {
				await queryClient.invalidateQueries(["users-with-avatar"]);
				toast({
					status: "info",
					title: "successfully changed role",
				});
				onClose();
			},
		}
	);

	const getConfirmDialogText = (oldRole, newRole) => {
		return (
			<>
				<div>Are you sure you want to change the role from</div>
				<Tag colorScheme={oldRole.color} className="mr-2">
					{oldRole.name}
				</Tag>
				<span className="mr-2">to</span>
				<Tag colorScheme={newRole.color} className="mr-2">
					{newRole.name}
				</Tag>
				<span>?</span>
			</>
		);
	};

	return (
		<>
			{!isLoading && !!rolesResponse?.items && (
				<>
					<TagConfirmMenu
						modalIsOpen={isOpen}
						onModalOpen={onOpen}
						onModalClose={onClose}
						mutation={mutation}
						confirmDialogBodyRenderer={getConfirmDialogText}
						selectedMenuItem={role}
						menuItems={rolesResponse.items}
					/>
				</>
			)}
		</>
	);
}

export default RoleTagConfirmMenu;
