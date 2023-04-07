import { CommentInteraction, Prisma } from "@prisma/client";

type CommentInteractionType = "like" | "dislike" | "heart";

export function getInteractions(interactions: CommentInteraction[])
export function getInteractions(interactions: CommentInteraction[], type: CommentInteractionType)
export function getInteractions(interactions: CommentInteraction[], type?: CommentInteractionType) {
	if (!type) {
		return {
			likes: getInteractions(interactions, "like"),
			dislikes: getInteractions(interactions, "dislike"),
			hearts: getInteractions(interactions, "heart")
		}
	}
	return interactions.filter(interaction => interaction.type === type);
}

export const userHasInteracted = (interactions: CommentInteraction[], type: CommentInteractionType, userId: string) => {
	return !!interactions.find(interaction => interaction.type === type && interaction.createdFromId === userId);
}

export const prismaIncludeParams: Prisma.CommentInclude =
{
	author: {
		include: {
			avatar: {
				include: {
					file: true
				}
			}
		}
	},
	childs: {
		include: {
			author: {
				include: {
					avatar: {
						include: {
							file: true
						}
					}
				}
			},
			interactions: true,
			childs: true
		},
		orderBy: {
			createdAt: "asc"
		}
	},
	interactions: true
}

export default {
	getInteractions,
	userHasInteracted,
	prismaIncludeParams
}