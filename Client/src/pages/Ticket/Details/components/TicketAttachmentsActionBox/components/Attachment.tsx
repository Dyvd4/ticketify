import { Link } from "@chakra-ui/react";
import { faFileArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
		<Link className="m-0 flex items-center justify-start gap-2 p-0" onClick={downloadFile}>
			<FontAwesomeIcon icon={faFileArrowDown} size="lg" />
			<span className="text-sm">{file.originalFileName}</span>
		</Link>
	);
}

export default File;
