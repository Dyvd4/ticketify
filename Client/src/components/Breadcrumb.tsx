import { Box, Breadcrumb as ChakraBreadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAtom } from "jotai";
import { breadcrumbAtom } from "src/context/stores/breadcrumb";

function Breadcrumb() {

    const [breadcrumb] = useAtom(breadcrumbAtom)

    return (
        <Box className="font-bold py-6">
            <ChakraBreadcrumb
                separator={<FontAwesomeIcon icon={faChevronRight} size="xs" />}>
                {breadcrumb.links.map(({ name, href, isCurrentPage }, index) => (
                    <BreadcrumbItem className="text-secondary-hover" key={index}>
                        <BreadcrumbLink
                            href={href}
                            isCurrentPage={isCurrentPage}>
                            {name}
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                ))}
            </ChakraBreadcrumb>
        </Box>
    )
}

export default Breadcrumb;