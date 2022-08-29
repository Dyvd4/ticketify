import { Flex, Link, Tooltip } from "@chakra-ui/react";
import { faFileArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
        <Link onClick={downloadFile}>
            <Tooltip label={file.originalFileName} placement="top">
                <Flex
                    justifyContent={"center"}
                    alignItems={"center"}
                    className="w-40 h-40 rounded-md bg-gray-500">
                    <FontAwesomeIcon icon={faFileArrowDown} size="5x" />
                </Flex>
            </Tooltip>
        </Link>
    );
}

export default File;