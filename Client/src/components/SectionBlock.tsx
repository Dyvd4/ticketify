import { Box, Flex, Heading } from "@chakra-ui/react";
import { ComponentPropsWithRef, PropsWithChildren } from "react";
import BgBox from "./BgBox";

type SectionBlockProps = PropsWithChildren<{
    title: string
    editButton?: React.ReactElement
    addButton?: React.ReactElement
}> & ComponentPropsWithRef<"div">

function SectionBlock(props: SectionBlockProps) {

    const {
        title,
        editButton,
        children,
        ...restProps
    } = props;

    return (
        <Box {...restProps} data-testid="SectionBlock">
            <Flex
                justifyContent={"space-between"}
                alignItems={"center"}>
                <Box>
                    <Heading className="text-2xl p-2">
                        {title}
                    </Heading>
                </Box>
                <Box className="flex justify-center items-center gap-2">
                    <Box>
                        {props.addButton}
                    </Box>
                    <Box>
                        {props.editButton}
                    </Box>
                </Box>
            </Flex>
            <BgBox>
                {children}
            </BgBox>
        </Box>
    );
}

export default SectionBlock;