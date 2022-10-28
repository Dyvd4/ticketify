import { Button } from "@chakra-ui/react";
import { cleanup, render, screen } from "@testing-library/react";
import SectionBlock from "../SectionBlock";

afterEach(cleanup);

it("renders title and editButton", () => {
    const title = "This is a special title";
    const buttonContent = "This a the button content";
    const editButton = <Button>{buttonContent}</Button>;
    const testId = "SectionBlock";

    render(<SectionBlock title={title} editButton={editButton} />)
    screen.getByText(buttonContent, { selector: "button" });
    screen.getByTestId(testId);
    expect(screen.queryByTestId(testId)!.innerHTML).toContain(title);
});