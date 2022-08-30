type EditViewProps = React.PropsWithChildren<{
    edit: boolean
    editView: React.ReactNode
}>

function EditView({ edit, editView, children, ...props }: EditViewProps) {
    return (
        <div {...props}>
            {!edit && <>
                {children}
            </>}
            {!!edit && <>
                {editView}
            </>}
        </div>
    );
}

export default EditView;