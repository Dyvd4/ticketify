import { Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { useEffect, useRef } from "react";
import { useQuery } from "react-query";
import { fetchEntity } from "src/api/entity";
import { filterDrawerAtom } from "src/context/atoms";
import { useFilterParams } from "src/hooks/useFilterParams";
import { usePrefillFilterParams } from "src/hooks/usePrefillFilterParams";

type FilterDrawerProps = {
    inputs: React.ReactNode
    fetch: {
        queryKey: string
        route: string
    }
}

function FilterDrawer({ inputs, fetch: { queryKey, route }, ...props }: FilterDrawerProps) {
    const [drawerActive, setDrawer] = useAtom(filterDrawerAtom);
    const drawerRef = useRef<HTMLDivElement | null>(null);
    const { filterParamsUrl, setFilterParamsUrl, resetFilterParamsUrl } = useFilterParams(drawerRef);
    const { prefillFilterParams } = usePrefillFilterParams(drawerRef);

    const { refetch } = useQuery([queryKey], () => {
        if (filterParamsUrl?.search) {
            return fetchEntity({ route: `${route}${filterParamsUrl!.search}` })
        }
        return fetchEntity({ route })
    });

    useEffect(() => {
        refetch();
    }, [filterParamsUrl, refetch]);

    const handleOnClose = () => {
        resetFilterParamsUrl();
        setDrawer(false);
    }
    const handleOnApply = () => {
        setFilterParamsUrl();
        setDrawer(false);
    }

    const setDrawerRef = (element) => {
        if (element) {
            drawerRef.current = element;
            prefillFilterParams();
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
                    Filter
                </DrawerHeader>
                <DrawerBody ref={setDrawerRef}>
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

export default FilterDrawer;