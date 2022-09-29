import { Box, Flex, Heading, Tooltip } from "@chakra-ui/react";
import { faCheck, faEdit, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ComponentPropsWithRef } from "react";
import EditView, { EditViewProps } from "./EditView";
import IconButton from "./Wrapper/IconButton";

type EditBlockProps = {
    title: string
    disableEdit?: boolean
    onToggle(...args: any[]): void
    onSave?(...args: any[]): void
}
    & EditViewProps
    & ComponentPropsWithRef<"div">

function EditBlock(props: EditBlockProps) {

    const { title, edit, disableEdit, alternateView, children, onToggle, onSave, ...restProps } = props;
    console.log(edit);

    return (
        <Box {...restProps}>
            <Flex
                justifyContent={"space-between"}
                alignItems={"center"}>
                <Box>
                    <Heading className="text-2xl p-2">
                        {title}
                    </Heading>
                </Box>
                <Box>
                    {edit && onSave && <>
                        <Tooltip
                            label={"save"}
                            placement="top">
                            <IconButton
                                className="mr-2"
                                onClick={onSave}
                                disabled={disableEdit}
                                colorScheme={"blue"}
                                size={"sm"}
                                aria-label={"save"}
                                icon={<FontAwesomeIcon icon={faCheck} />}
                            />
                        </Tooltip>
                    </>}
                    <Tooltip
                        label={!edit ? "edit" : "abort"}
                        placement="top">
                        <IconButton
                            onClick={onToggle}
                            disabled={disableEdit}
                            colorScheme={edit ? "red" : "gray"}
                            size={"sm"}
                            aria-label={!edit ? "edit" : "abort"}
                            icon={<FontAwesomeIcon icon={!edit ? faEdit : faTimes} />}
                        />
                    </Tooltip>
                </Box>
            </Flex>
            <EditView
                edit={edit}
                alternateView={<>
                    <Box className="bg-box rounded-md p-4">
                        {alternateView}
                    </Box>
                </>}>
                <Box className="bg-box rounded-md p-4">
                    {children}
                </Box>
            </EditView>
        </Box>
    );
}

export default EditBlock;