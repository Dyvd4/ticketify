import { getCurrentUser } from "@core/services/CurrentUserService";
import { prismaMock } from "testSetup";
import TicketModelActivity, { TicketActivityActionColorMap, TicketActivityActionLabelMap, TicketActivityModelIconMap } from "../TicketActivity";

jest.mock("@services/CurrentUserService", () => ({
    getCurrentUser: jest.fn()
}));

const mockedGetCurrentUser = getCurrentUser as jest.Mock<any>

const comment = {
    ticketId: 1,
    title: "dummy title",
    description: "dummy description"
}

const commentCreatedActivityDescription = "Comment created"

mockedGetCurrentUser.mockResolvedValue({
    id: "85bd6d9d-bce0-4628-92b6-de2c3c6d4f4e"
});

describe("optional parameters", () => {
    describe("descriptionEvaluator", () => {
        it("allows description evaluators per action", () => {

            const ticketModelActivityTestFn = TicketModelActivity("Comment", {
                disableMailDelivery: true,
                actions: ["create", "update"],
                descriptionEvaluator: {
                    create: () => commentCreatedActivityDescription,
                    update: (comment) => comment.title
                }
            });

            const ticketActivityCreateFn = jest.spyOn(prismaMock.ticketActivity, "create")

            ticketModelActivityTestFn({
                model: "Comment",
                action: "create",
                args: {
                    data: comment
                },
                dataPath: [],
                runInTransaction: false
            }, jest.fn());

            ticketModelActivityTestFn({
                model: "Comment",
                action: "update",
                args: {
                    data: comment
                },
                dataPath: [],
                runInTransaction: false
            }, jest.fn());

            expect(ticketActivityCreateFn).toHaveBeenNthCalledWith(1,
                expect.objectContaining({
                    data: expect.objectContaining({
                        description: commentCreatedActivityDescription
                    })
                })
            )

            expect(ticketActivityCreateFn).toHaveBeenNthCalledWith(2,
                expect.objectContaining({
                    data: expect.objectContaining({
                        description: comment.title
                    })
                })
            )

        })
    })
    describe("actions", () => {
        it("allows to filter out actions", () => {

            const ticketModelActivityTestFn = TicketModelActivity("Comment", {
                disableMailDelivery: true,
                actions: ["update"],
                descriptionEvaluator: {
                    // "create" should be marked red,
                    // don't know how to get that kind of compiler inference
                    create: () => commentCreatedActivityDescription,
                    update: (comment) => comment.title
                }
            });

            const ticketActivityCreateFn = jest.spyOn(prismaMock.ticketActivity, "create")

            ticketModelActivityTestFn({
                model: "Comment",
                action: "create",
                args: {
                    data: comment
                },
                dataPath: [],
                runInTransaction: false
            }, jest.fn());

            ticketModelActivityTestFn({
                model: "Comment",
                action: "update",
                args: {
                    data: comment
                },
                dataPath: [],
                runInTransaction: false
            }, jest.fn());

            expect(ticketActivityCreateFn).toHaveBeenCalledTimes(1);
            expect(ticketActivityCreateFn).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        description: comment.title
                    })
                })
            )

        });
    })
})

describe("when creating activity", () => {

    const ticketModelActivityTrigger = () => {
        TicketModelActivity("Comment", { disableMailDelivery: true })({
            model: "Comment",
            action: "create",
            args: {
                data: comment
            },
            dataPath: [],
            runInTransaction: false
        }, jest.fn());
    }

    it("maps color based on action", async () => {

        const ticketActivityCreateFn = jest.spyOn(prismaMock.ticketActivity, "create")

        ticketModelActivityTrigger()

        expect(ticketActivityCreateFn).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({
                    color: TicketActivityActionColorMap.create
                })
            })
        )

    })

    it("maps icon based on model", () => {

        const ticketActivityCreateFn = jest.spyOn(prismaMock.ticketActivity, "create")

        ticketModelActivityTrigger()

        expect(ticketActivityCreateFn).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({
                    icon: TicketActivityModelIconMap.Comment
                })
            })
        )
    })

    it("maps title based on actionLabelMap", () => {
        const ticketActivityCreateFn = jest.spyOn(prismaMock.ticketActivity, "create")

        ticketModelActivityTrigger()

        expect(ticketActivityCreateFn).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({
                    title: expect.stringContaining(TicketActivityActionLabelMap.create)
                })
            })
        )
    })
});
