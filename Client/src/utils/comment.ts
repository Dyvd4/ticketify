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
    const newParentComments: any = [...parentComments];
    const oldParentComments: any = [...parentComments];

    const parentCommentIndex = parentComments.findIndex(comment => comment.id === parentCommentId);
    const parentComment = parentComments[parentCommentIndex]
    const oldChildComments = [...parentComment.childs];
    const newChildComments = [
        ...parentComment.childs,
        comment
    ];
    const newParentComment = {
        ...parentComment,
        childs: newChildComments
    }
    newParentComments[parentCommentIndex] = newParentComment;

    return {
        parentComments: newParentComments,
        childComments: newChildComments,
        oldChildComments,
        oldParentComments
    }
}

export const deleteComment = (parentComments: any[], commentId: string) => {
    let newChildComments: any = [];
    let oldChildComments: any = [];
    let newParentComments: any = [...parentComments];
    let oldParentComments: any = [...parentComments];
    const { parentCommentIndex, commentIndex } = getCommentPosition(parentComments, commentId);
    const isParent = parentCommentIndex === -1 && commentIndex > -1
    const isChild = parentCommentIndex > -1 && commentIndex > -1;

    if (isParent) {
        newParentComments.splice(commentIndex, 1);
    }
    if (isChild) {
        const parent = newParentComments[parentCommentIndex];
        newChildComments = [...parent.childs];
        oldChildComments = [...parent.childs];
        newChildComments.splice(commentIndex, 1);
        parent.childs = newChildComments;
    }

    return {
        parentComments: newParentComments,
        childComments: newChildComments,
        oldChildComments,
        oldParentComments
    };
}

export const replaceComment = (parentComments: any[], commentId: string, comment) => {
    let newChildComments: any = [];
    let oldChildComments: any = [];
    let newParentComments: any = [...parentComments];
    let oldParentComments: any = [...parentComments];
    const { parentCommentIndex, commentIndex } = getCommentPosition(parentComments, commentId);
    const isParent = parentCommentIndex === -1 && commentIndex > -1
    const isChild = parentCommentIndex > -1 && commentIndex > -1;

    if (isParent) {
        newParentComments[commentIndex] = comment;
    }
    else if (isChild) {
        const parent = newParentComments[parentCommentIndex];
        newChildComments = [...parent.childs];
        oldChildComments = [...parent.childs];
        newChildComments[commentIndex] = comment;
        parent.childs = newChildComments;
    }

    return {
        parentComments: newParentComments,
        childComments: newChildComments,
        oldChildComments,
        oldParentComments
    }
}