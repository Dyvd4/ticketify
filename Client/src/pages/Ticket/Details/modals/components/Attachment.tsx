import BgBox from "src/components/BgBox";

type AttachmentProps = {
    attachment: any;
};

function Attachment({ attachment }: AttachmentProps) {
    return (
        <BgBox variant="child" className="flex flex-1 rounded-md">
            {attachment.originalFileName}
        </BgBox>
    );
}

export default Attachment;
