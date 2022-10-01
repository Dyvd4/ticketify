import { CommentInteraction } from "@prisma/client";

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