import { Link, Tooltip } from "@chakra-ui/react";
import { faFileArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BgBox from "src/components/BgBox";
import { request } from "src/services/request";

type FileProps = {
    file: any;
};

function File({ file }: FileProps) {
    const downloadFile = async () => {
        const response = await request().get(`file/${file.id}`);

        const a = document.createElement("a");
        a.href = response.data.url;
        a.download = file.originalFileName;
        a.click();
    };

    return (
        <Tooltip label={file.originalFileName} placement="top">
            <Link className="m-0" onClick={downloadFile}>
                <BgBox variant="child" className="flex h-20 w-20 items-center justify-center">
                    <FontAwesomeIcon icon={faFileArrowDown} size="3x" />
                </BgBox>
            </Link>
        </Tooltip>
    );
}

export default File;
