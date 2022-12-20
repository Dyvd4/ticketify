import { BreadcrumbItem, BreadcrumbLink, Breadcrumb as ChakraBreadcrumb, Container } from "@chakra-ui/react";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAtom } from "jotai";
import { breadcrumbAtom } from "src/context/stores/breadcrumb";

function Breadcrumb() {
    const [breadcrumb] = useAtom(breadcrumbAtom)

    return (
        <Container
            maxW={`container.${breadcrumb.containerSize || "lg"}`}
            className="font-bold my-4">
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
        </Container>
    )
}

export default Breadcrumb;