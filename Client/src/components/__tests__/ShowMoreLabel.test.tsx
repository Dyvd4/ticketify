import { Box } from "@chakra-ui/react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import React, { useState } from "react";
import ShowMoreLabel from "../ShowMoreLabel";

const contentBoxOverflowContent =
    "This is some content that is definitely more than one line: Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex vitae iure, quod ullam nemo facere quo blanditiis velit, esse incidunt hic iste sunt molestiae fugit accusantium ad, quas laboriosam adipisci cupiditate? Eius necessitatibus, obcaecati assumenda adipisci, tempora perspiciatis velit suscipit fuga optio voluptates inventore nostrum architecto veniam qui minima ipsa placeat quia dolore! Aut corporis vel consequatur sequi voluptas! Cupiditate quia sapiente iusto, eum aspernatur facilis iste ipsa, sint impedit distinctio soluta nulla debitis? Id quis aut, consectetur earum at aperiam quo nisi voluptates placeat soluta animi, eligendi cumque ducimus commodi minus nostrum. Eum quibusdam ea eos, rerum tenetur consectetur excepturi fugiat saepe dolores nisi neque in est facilis provident rem veritatis modi aspernatur, esse, sunt maiores sequi? Consectetur quam quasi animi nesciunt magni id eum assumenda nobis maiores, voluptate dolore esse placeat debitis doloribus. Consequatur maiores iusto iste ipsum delectus eligendi deleniti eius minus debitis sapiente. Nemo deserunt natus dignissimos dolorem! Officiis vero porro consectetur consequatur fuga qui libero vitae voluptatum exercitationem, quibusdam quod molestiae pariatur necessitatibus iure autem perspiciatis, rerum esse corrupti dicta quos saepe? Aspernatur mollitia nam repellendus natus, dolorum maxime, corrupti voluptas laborum vitae tenetur quam ad quia, ut molestias. Consectetur laborum nulla ipsa earum quas.";

beforeEach(cleanup);

it("renders if the content has overflow", async () => {
    const HOC = () => {
        const defaultNoOfContentLines = 2;
        const [noOfContentLines, setNoOfContentLines] = useState(defaultNoOfContentLines);
        const contentBoxRef = React.createRef<HTMLDivElement>();

        return (
            <>
                <Box ref={contentBoxRef} noOfLines={noOfContentLines}>
                    {contentBoxOverflowContent}
                </Box>
                <ShowMoreLabel
                    contentRef={contentBoxRef}
                    contentNoOfLines={noOfContentLines}
                    setContentNoOfLines={setNoOfContentLines}
                    defaultContentNoOfLines={defaultNoOfContentLines}
                />
            </>
        );
    };

    render(<HOC />);

    waitFor(() => {
        const showMoreLabel = screen.getByTestId("ShowMoreLabel");
        expect(showMoreLabel).toBeTruthy();
        expect(showMoreLabel.textContent).toBe("Show more");
    });
});

it("doesn't render if the content doesn't have overflow", async () => {
    const HOC = () => {
        const defaultNoOfContentLines = 2;
        const [noOfContentLines, setNoOfContentLines] = useState(defaultNoOfContentLines);
        const contentBoxRef = React.createRef<HTMLDivElement>();

        return (
            <>
                <Box ref={contentBoxRef} noOfLines={noOfContentLines}>
                    This is one line
                </Box>
                <ShowMoreLabel
                    contentRef={contentBoxRef}
                    contentNoOfLines={noOfContentLines}
                    setContentNoOfLines={setNoOfContentLines}
                    defaultContentNoOfLines={defaultNoOfContentLines}
                />
            </>
        );
    };

    render(<HOC />);

    waitFor(() => expect(screen.getByTestId("ShowMoreLabel")).not.toBeTruthy());
});

it("toggles label", () => {
    const HOC = () => {
        const defaultNoOfContentLines = 2;
        const [noOfContentLines, setNoOfContentLines] = useState(defaultNoOfContentLines);
        const contentBoxRef = React.createRef<HTMLDivElement>();

        return (
            <>
                <Box ref={contentBoxRef} noOfLines={noOfContentLines}>
                    {contentBoxOverflowContent}
                </Box>
                <ShowMoreLabel
                    contentRef={contentBoxRef}
                    contentNoOfLines={noOfContentLines}
                    setContentNoOfLines={setNoOfContentLines}
                    defaultContentNoOfLines={defaultNoOfContentLines}
                />
            </>
        );
    };

    render(<HOC />);

    waitFor(() => {
        const showMoreLabel = screen.getByTestId("ShowMoreLabel");
        expect(showMoreLabel.textContent).toBe("Show more");
        fireEvent.click(showMoreLabel);
        expect(showMoreLabel.textContent).toBe("Show less");
    });
});
