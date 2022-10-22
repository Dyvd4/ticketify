import { Modal, ModalContent } from "@chakra-ui/react";
import { cleanup, render, screen } from "@testing-library/react";
import ModalBody from "../ModalBody";

afterEach(cleanup);

it("renders children", () => {
    const modalContent = "This is the modal content";
    render(
        <Modal isOpen={true} onClose={() => { }}>
            <ModalContent>
                <ModalBody>
                    {modalContent}
                </ModalBody>
            </ModalContent>
        </Modal>
    )
    screen.getByText(modalContent);
});

it("does not render children if loading", () => {
    const modalContent = "This is the modal content";
    render(
        <Modal isOpen={true} onClose={() => { }}>
            <ModalContent>
                <ModalBody isLoading={true}>
                    {modalContent}
                </ModalBody>
            </ModalContent>
        </Modal>
    )
    expect(screen.queryByText(modalContent)).toBeNull();
});

it("does not render children if error", () => {
    const modalContent = "This is the modal content";
    render(
        <Modal isOpen={true} onClose={() => { }}>
            <ModalContent>
                <ModalBody isError={true}>
                    {modalContent}
                </ModalBody>
            </ModalContent>
        </Modal>
    )
    expect(screen.queryByText(modalContent)).toBeNull();
});

it("does not display loading state if error", () => {
    render(
        <Modal isOpen={true} onClose={() => { }}>
            <ModalContent>
                <ModalBody isLoading={true} isError={true} />
            </ModalContent>
        </Modal>
    )
    expect(screen.queryByTestId("LoadingRipple")).toBeNull();
});