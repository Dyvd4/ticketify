import { BreadcrumbItem, BreadcrumbLink, Breadcrumb as ChakraBreadcrumb, Container } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { breadcrumbAtom } from "src/context/stores/breadcrumb";

function Breadcrumb() {
    const [breadcrumb] = useAtom(breadcrumbAtom)

    return (
        <Container
            maxW={`container.${breadcrumb.containerSize || "lg"}`}
            className="my-4">
            <ChakraBreadcrumb>
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