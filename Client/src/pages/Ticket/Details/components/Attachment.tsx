import BgBox from "src/components/BgBox";

type AttachmentProps = {
    attachment: any
}

function Attachment({ attachment }: AttachmentProps) {
    return (
        <BgBox
            variant="child"
            className="rounded-md flex flex-1">
            {attachment.originalFileName}
        </BgBox>
    );
}

export default Attachment;