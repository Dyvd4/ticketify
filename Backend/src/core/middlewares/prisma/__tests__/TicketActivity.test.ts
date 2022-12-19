import { getCurrentUser } from "@core/services/CurrentUserService";
import { prismaMock } from "testSetup";
import CreateTicketActivityBasedOn, { TicketActivityEventColorMap, TicketActivityEventLabelMap, TicketActivityModelIconMap } from "../TicketActivity";

jest.mock("@services/CurrentUserService", () => ({
    getCurrentUser: jest.fn()
}));

const mockedGetCurrentUser = getCurrentUser as jest.Mock<any>

const comment = {
    ticketId: 1,
    title: "dummy title",
    description: "dummy description"
}

const commentCreatedActivityDescription = "Comment has been created"
const commentUpdatedActivityDescription = "Comment has been updated"

mockedGetCurrentUser.mockResolvedValue({
    id: "85bd6d9d-bce0-4628-92b6-de2c3c6d4f4e"
});

describe("optional parameters", () => {
    it("allows async evaluators", async () => {

        const CreateTicketActivityBasedOnTestFn = CreateTicketActivityBasedOn("Comment", ["create", "update"], {
            disableMailDelivery: true,
            descriptionEvaluator: (event) => {
                return new Promise((resolve) => {
                    if (event === "create") {
                        resolve(commentCreatedActivityDescription)
                    }
                    if (event === "update") {
                        resolve(comment.title)
                    }
                    else resolve(null);
                })
            }
        });

        const ticketActivityCreateFn = jest.spyOn(prismaMock.ticketActivity, "create")

        await CreateTicketActivityBasedOnTestFn({
            model: "Comment",
            action: "create",
            args: {
                data: comment
            },
            dataPath: [],
            runInTransaction: false
        }, jest.fn());

        await CreateTicketActivityBasedOnTestFn({
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
    describe("events", () => {
        it("allows to filter out events", async () => {

            const CreateTicketActivityBasedOnTestFn = CreateTicketActivityBasedOn("Comment", ["update"], {
                disableMailDelivery: true,
                descriptionEvaluator: async (event) => {
                    if (event === "update") return commentUpdatedActivityDescription // should be
                    else return commentCreatedActivityDescription // should not be
                }
            });

            const ticketActivityCreateFn = jest.spyOn(prismaMock.ticketActivity, "create")

            await CreateTicketActivityBasedOnTestFn({
                model: "Comment",
                action: "create",
                args: {
                    data: comment
                },
                dataPath: [],
                runInTransaction: false
            }, jest.fn());

            await CreateTicketActivityBasedOnTestFn({
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
                        description: commentUpdatedActivityDescription
                    })
                })
            )

        });
    })
})

describe("when creating activity", () => {

    const CreateTicketActivityBasedOnTrigger = () => {
        CreateTicketActivityBasedOn("Comment", ["create", "update"], { disableMailDelivery: true })({
            model: "Comment",
            action: "create",
            args: {
                data: comment
            },
            dataPath: [],
            runInTransaction: false
        }, jest.fn());
    }

    it("maps color based on event", async () => {

        const ticketActivityCreateFn = jest.spyOn(prismaMock.ticketActivity, "create")

        CreateTicketActivityBasedOnTrigger()

        expect(ticketActivityCreateFn).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({
                    color: TicketActivityEventColorMap.create
                })
            })
        )

    })

    it("maps icon based on model", () => {

        const ticketActivityCreateFn = jest.spyOn(prismaMock.ticketActivity, "create")

        CreateTicketActivityBasedOnTrigger()

        expect(ticketActivityCreateFn).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({
                    icon: TicketActivityModelIconMap.Comment
                })
            })
        )
    })

    it("maps title based on event label map", () => {
        const ticketActivityCreateFn = jest.spyOn(prismaMock.ticketActivity, "create")

        CreateTicketActivityBasedOnTrigger()

        expect(ticketActivityCreateFn).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({
                    title: expect.stringContaining(TicketActivityEventLabelMap.create)
                })
            })
        )
    })
});
