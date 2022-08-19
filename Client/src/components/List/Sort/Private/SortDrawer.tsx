import { Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { useEffect, useRef } from "react";
import { useQuery } from "react-query";
import { fetchEntity } from "src/api/entity";
import { sortDrawerAtom } from "src/context/atoms";
import { useOrderByParams } from "src/hooks/useOrderByParams";

type SortDrawerProps = {
    inputs: React.ReactNode
    fetch: {
        queryKey: string
        route: string
    }
}

function SortDrawer({ inputs, fetch: { queryKey, route }, ...props }: SortDrawerProps) {
    const [drawerActive, setDrawer] = useAtom(sortDrawerAtom);
    const drawerRef = useRef<HTMLDivElement | null>(null);
    const { orderByParamsUrl, setOrderByParamsUrl, resetOrderByParamsUrl } = useOrderByParams(drawerRef);

    const { refetch } = useQuery([queryKey], () => {
        if (orderByParamsUrl?.search) {
            return fetchEntity({ route: `${route}${orderByParamsUrl!.search}` })
        }
        return fetchEntity({ route })
    });

    useEffect(() => {
        refetch();
    }, [orderByParamsUrl, refetch]);

    const handleOnClose = () => {
        resetOrderByParamsUrl();
        setDrawer(false)
    }
    const handleOnApply = () => {
        setOrderByParamsUrl();
        setDrawer(false)
    }

    // cleanup
    const setDrawerRef = (element) => {
        if (element) {
            drawerRef.current = element;
        }
    }

    return (
        <Drawer isOpen={drawerActive}
            placement={"right"}
            onClose={() => setDrawer(false)}>
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>
                    Sort
                </DrawerHeader>
                <DrawerBody ref={(setDrawerRef)}>
                    {inputs}
                </DrawerBody>
                <DrawerFooter>
                    <Button
                        onClick={handleOnClose}
                        variant="outline"
                        mr={3}>
                        reset
                    </Button>
                    <Button
                        onClick={handleOnApply}
                        colorScheme="blue"
                        mr={3}>
                        apply
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}

export default SortDrawer;