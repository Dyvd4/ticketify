import {
	Alert,
	AlertIcon,
	Box,
	Divider,
	Flex,
	Heading,
	Menu,
	MenuItemOption,
	MenuList,
	MenuOptionGroup,
	Text,
} from "@chakra-ui/react";
import { useAtom } from "jotai";
import { useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { fetchEntity } from "src/api/entity";
import useCommentMutations from "src/api/mutations/hooks/useCommentMutations";
import CommentSkeleton from "src/components/Comment/CommentSkeleton";
import Input from "src/components/Comment/Input";
import ErrorAlert from "src/components/ErrorAlert";
import MenuButton from "src/components/Wrapper/MenuButton";
import { commentSortParamAtom } from "src/context/atoms";
import { useCurrentUser } from "src/hooks/user";
import { v4 as uuid } from "uuid";
import Comment from "../../../../components/Comment/Comment";

const newestCommentSortParam = {
	label: "Newest first",
	property: "newestFirst",
};
export const mostLikedCommentSortParam = {
	label: "Most likes",
	property: "mostLikes",
};
const mostHeartedCommentSortParam = {
	label: "Most hearts",
	property: "mostHearts",
};

const sortParamsData = [
	mostLikedCommentSortParam,
	newestCommentSortParam,
	mostHeartedCommentSortParam,
];

type CommentsSectionProps = {};

function CommentsSection(props: CommentsSectionProps) {
	const { id } = useParams();
	const [commentInputValue, setCommentInputValue] = useState("");
	const { currentUser } = useCurrentUser({ includeAllEntities: true });
	const [sortParam, setSortParam] = useAtom(commentSortParamAtom);

	// queries
	// -------
	const {
		isLoading: ticketLoading,
		isError: ticketError,
		data: ticket,
	} = useQuery(["ticket", id], () => fetchEntity({ route: `ticket/${id}` }));

	// queries
	// -------
	const {
		isLoading,
		isError,
		data: comments = [],
	} = useQuery(
		["comments", sortParam, id],
		() => {
			return fetchEntity({ route: `comments/${id}/?orderBy=${sortParam.property}` });
		},
		{
			refetchOnWindowFocus: false,
			enabled: !!id,
		}
	);

	const { isError: countError, data: count } = useQuery(
		["comments/count"],
		() => {
			return fetchEntity({ route: `comments/count/${id}` });
		},
		{
			refetchOnWindowFocus: false,
			enabled: !!id,
		}
	);

	// mutations
	// ---------

	const {
		addInteractionMutation,
		addCommentMutation,
		editCommentMutation,
		deleteCommentMutation,
	} = useCommentMutations(id);

	// event handler
	// -------------
	const handleMenuButtonClick = async (selectedProperty) => {
		const selectedSortParam: any =
			sortParamsData.find((param) => param.property === selectedProperty) || {};
		setSortParam(selectedSortParam);
	};

	const handleAddSubmit = () => {
		setCommentInputValue("");
		addCommentMutation.mutate({
			route: "comment",
			payload: {
				ticketId: id,
				content: commentInputValue,
			},
		});
	};

	const handleInteractionSubmit = (type, comment) => {
		addInteractionMutation.mutate({
			route: "commentInteraction",
			payload: {
				type,
				commentId: comment.id,
			},
		});
	};
	const handleReplySubmit = (e, comment, replyValue) => {
		addCommentMutation.mutate({
			route: "comment",
			payload: {
				id: uuid(),
				parentId: comment.parentId || comment.id,
				ticketId: id,
				content: replyValue,
			},
		});
	};
	const handleEditSubmit = (e, comment, editValue) => {
		const { authorId, ticketId } = comment;
		editCommentMutation.mutate({
			route: "comment",
			entityId: comment.id,
			payload: {
				ticketId,
				authorId,
				content: editValue,
			},
		});
	};
	const handleDeleteSubmit = (e, comment) => {
		deleteCommentMutation.mutate({
			route: "comment",
			entityId: comment.id,
		});
	};
	const replyInputAvatar = (comment) => {
		const avatar = currentUser
			? {
					username: currentUser.username,
					...currentUser.avatar,
			  }
			: null;
		return avatar;
	};
	const replyButtonAvatar = (comment) => {
		const responsibleUserHasReplied = comment.childs.some(
			(childComment) => childComment.authorId === ticket.responsibleUserId
		);
		const avatar = responsibleUserHasReplied
			? {
					username: ticket.responsibleUser.username,
					...ticket.responsibleUser.avatar,
			  }
			: null;
		return avatar;
	};

	const newestComment = comments
		.filter((comment) => comment.authorId === currentUser.id)
		.sort((a, b) => {
			// @ts-ignore
			return new Date(b.createdAt) - new Date(a.createdAt);
		})[0];

	// TODO: skeleton loading
	if (ticketLoading) return null;

	return (
		<Box>
			<Flex gap={2} className="mt-4 mb-2 items-center justify-between">
				<Heading className="whitespace-nowrap p-2 text-2xl">
					Comments ({count || 0})
				</Heading>
				<Menu>
					<MenuButton height={"8"} className="text-sm">
						Sort by
					</MenuButton>
					<MenuList>
						<MenuOptionGroup defaultValue={sortParam.property} type="radio">
							{sortParamsData.map(({ label, property, ...sortParam }) => (
								<MenuItemOption
									onClick={() => handleMenuButtonClick(property)}
									key={property}
									value={property}
								>
									{label}
								</MenuItemOption>
							))}
						</MenuOptionGroup>
					</MenuList>
				</Menu>
			</Flex>
			<Flex className="flex-col gap-6">
				<Input
					variant="add"
					value={commentInputValue}
					setValue={setCommentInputValue}
					onCancel={() => setCommentInputValue("")}
					onSubmit={handleAddSubmit}
				/>
				<Flex className="flex-col gap-4">
					{(countError || isError) && <ErrorAlert />}
					{isLoading &&
						Array(5)
							.fill("")
							.map((item, index) => <CommentSkeleton key={index} />)}
					{newestComment && (
						<>
							<Text>Your newest added comment:</Text>
							<Comment
								comment={newestComment}
								avatar={{
									username: newestComment.author.username,
									...newestComment.author.avatar,
								}}
								key={newestComment.id}
								onInteractionSubmit={handleInteractionSubmit}
								onReplySubmit={handleReplySubmit}
								onEditSubmit={handleEditSubmit}
								onDeleteSubmit={handleDeleteSubmit}
								replyInputAvatar={replyInputAvatar}
								replyButtonAvatar={replyButtonAvatar}
								usernameTagged={(comment) =>
									ticket.responsibleUserId === comment.authorId
								}
								canEdit={(comment) => currentUser.id === comment.authorId}
								canDelete={(comment) =>
									currentUser.id === comment.authorId &&
									comment.childs.length === 0
								}
							/>
							<Divider />
						</>
					)}
					{comments
						.filter((comment) => comment.id !== newestComment?.id)
						.map((comment) => (
							<Comment
								comment={comment}
								avatar={{
									username: comment.author.username,
									...comment.author.avatar,
								}}
								key={comment.id}
								onInteractionSubmit={handleInteractionSubmit}
								onReplySubmit={handleReplySubmit}
								onEditSubmit={handleEditSubmit}
								onDeleteSubmit={handleDeleteSubmit}
								replyInputAvatar={replyInputAvatar}
								replyButtonAvatar={replyButtonAvatar}
								usernameTagged={(comment) =>
									ticket.responsibleUserId === comment.authorId
								}
								canEdit={(comment) => currentUser.id === comment.authorId}
								canDelete={(comment) =>
									currentUser.id === comment.authorId &&
									comment.childs.length === 0
								}
							/>
						))}
				</Flex>
			</Flex>
			<br />
		</Box>
	);
}

export default CommentsSection;
