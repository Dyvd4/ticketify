import { Box, Flex, Heading } from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import BgBox from "./BgBox";

type EditModalBlockProps = PropsWithChildren<{
    title: string
    editButton: React.ReactElement
}>

function EditModalBlock(props: EditModalBlockProps) {

    const {
        title,
        editButton,
        children,
        ...restProps
    } = props;

    return (
        <Box {...restProps} data-testid="EditModalBlock">
            <Flex
                justifyContent={"space-between"}
                alignItems={"center"}>
                <Box>
                    <Heading className="text-2xl p-2">
                        {title}
                    </Heading>
                </Box>
                <Box>
                    {props.editButton}
                </Box>
            </Flex>
            <BgBox>
                {children}
            </BgBox>
        </Box>
    );
}

export default EditModalBlock;