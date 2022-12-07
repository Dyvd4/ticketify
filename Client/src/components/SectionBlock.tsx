import { Box, Flex, Heading } from "@chakra-ui/react";
import { ComponentPropsWithRef, PropsWithChildren } from "react";
import BgBox from "./BgBox";

type SectionBlockProps = PropsWithChildren<{
    title: string
    actions?: React.ReactElement[]
    editButton?: React.ReactElement
    addButton?: React.ReactElement
}> & ComponentPropsWithRef<"div">

function SectionBlock(props: SectionBlockProps) {

    const {
        title,
        addButton,
        editButton,
        actions,
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
                    {actions?.map((action, index) => (
                        <Box key={index}>
                            {action}
                        </Box>
                    ))}
                    {addButton && <>
                        <Box>
                            {addButton}
                        </Box>
                    </>}
                    {editButton && <>
                        <Box>
                            {editButton}
                        </Box>
                    </>}
                </Box>
            </Flex>
            <BgBox>
                {children}
            </BgBox>
        </Box>
    );
}

export default SectionBlock;