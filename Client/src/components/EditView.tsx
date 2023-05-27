export type EditViewProps = React.PropsWithChildren<{
    edit: boolean;
    alternateView: React.ReactNode;
}>;

function EditView({ edit, alternateView, children, ...props }: EditViewProps) {
    return (
        <div {...props}>
            {!!edit && <>{children}</>}
            {!edit && <>{alternateView}</>}
        </div>
    );
}

export default EditView;
