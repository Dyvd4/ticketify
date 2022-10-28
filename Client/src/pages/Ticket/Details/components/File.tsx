import { Link, Tooltip } from "@chakra-ui/react";
import { faFileArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BgBox from "src/components/BgBox";
import { request } from "src/services/request";

type FileProps = {
    file: any
}

function File({ file }: FileProps) {
    const downloadFile = async () => {
        const response = await request().get(`file/${file.id}`, { responseType: "blob" });
        const blob: Blob = response.data;
        const a = document.createElement("a");
        const downloadUrl = window.URL.createObjectURL(blob);
        a.href = downloadUrl
        a.download = file.originalFileName;
        a.click();
        window.URL.revokeObjectURL(downloadUrl)
    }
    return (
        <Link className="m-0" onClick={downloadFile}>
            <Tooltip label={file.originalFileName} placement="top">
                <BgBox
                    variant="child"
                    className="w-20 h-20 flex justify-center items-center">
                    <FontAwesomeIcon icon={faFileArrowDown} size="3x" />
                </BgBox>
            </Tooltip>
        </Link>
    );
}

export default File;