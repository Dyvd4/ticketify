const getCommentPosition = (parentComments: any[], commentId: string) => {

    let parentCommentIndex = -1;
    let commentIndex = -1;

    for (let i = 0; i < parentComments.length; i++) {
        if (commentIndex > -1) break;
        const comment = parentComments[i];
        if (comment.id === commentId) {
            commentIndex = i;
            break;
        }
        for (let y = 0; y < comment.childs.length; y++) {
            const childComment = comment.childs[y];
            if (childComment.id === commentId) {
                parentCommentIndex = i;
                commentIndex = y;
                break;
            }
        }
    }

    return { parentCommentIndex, commentIndex };
}

export const getComment = (parentComments: any[], commentId) => {
    const { parentCommentIndex, commentIndex } = getCommentPosition(parentComments, commentId);
    let comment;
    if (parentCommentIndex === -1 && commentIndex > -1) {
        comment = parentComments[commentIndex];
    }
    if (parentCommentIndex > -1 && commentIndex > -1) {
        comment = parentComments[parentCommentIndex].childs[commentIndex];
    }
    return comment;
}

export const addComment = (parentComments: any[], parentCommentId: string, comment) => {
    const newComments: any = [...parentComments];
    const oldComments: any = [...parentComments];

    const parentCommentIndex = parentComments.findIndex(comment => comment.id === parentCommentId);
    const parentComment = parentComments[parentCommentIndex]
    const newParentComment = {
        ...parentComment,
        childs: [
            ...parentComment.childs,
            comment
        ]
    }
    newComments[parentCommentIndex] = newParentComment;

    return {
        comments: newComments,
        oldComments
    }
}

export const deleteComment = (parentComments: any[], commentId: string) => {
    let newComments: any = [...parentComments];
    let oldComments: any = [...parentComments];
    const { parentCommentIndex, commentIndex } = getCommentPosition(parentComments, commentId);
    const isParent = parentCommentIndex === -1 && commentIndex > -1
    const isChild = parentCommentIndex > -1 && commentIndex > -1;

    if (isParent) {
        newComments.splice(commentIndex, 1);
    }
    if (isChild) {
        const parent = newComments[parentCommentIndex];
        parent.childs.splice(commentIndex, 1);
    }

    return {
        comments: newComments,
        oldComments
    };
}

export const replaceComment = (parentComments: any[], commentId: string, comment) => {
    let newComments: any = [...parentComments];
    let oldComments: any = [...parentComments];
    const { parentCommentIndex, commentIndex } = getCommentPosition(parentComments, commentId);
    const isParent = parentCommentIndex === -1 && commentIndex > -1
    const isChild = parentCommentIndex > -1 && commentIndex > -1;

    if (isParent) {
        newComments[commentIndex] = comment;
    }
    else if (isChild) {
        const parent = newComments[parentCommentIndex];
        parent.childs[commentIndex] = comment;
    }

    return {
        comments: newComments,
        oldComments
    }
}