import { ContainerProps, useToast } from "@chakra-ui/react";
import type EditorJS from "@editorjs/editorjs";
import { AxiosError } from "axios";
import { format } from "date-fns";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { fetchEntity } from "src/api/entity";
import { mutateTicket } from "src/api/ticket";
import {
	getValidationErrorMap,
	ValidationErrorMap,
	ValidationErrorResponse,
} from "src/utils/error";
import Form from "./Form";

type FormWrapperProps = (
	| {
			variant?: "add";
			isOpen: boolean;
			onClose(...args: any[]): void;
	  }
	| {
			variant?: "edit";
			id: any;
			isOpen: boolean;
			onClose(...args: any[]): void;
	  }
) &
	ContainerProps;

function FormWrapper(props: FormWrapperProps) {
	const { variant = "add", id, isOpen, onClose } = props;
	// state
	// -----
	const [localTicketState, setLocalTicketState] = useState<any>({});
	const [localInputState, setLocalInputState] = useState<any>({});
	const [editor, setEditor] = useState<EditorJS | null>(null);
	const [success, setSuccess] = useState(false);
	const [errorMap, setErrorMap] = useState<ValidationErrorMap | null>();
	const toast = useToast();
	const queryClient = useQueryClient();

	// queries
	// -------
	const { data: fetchedTicket = {}, fetchStatus: ticketFetchStatus } = useQuery(
		["ticket", id],
		() => {
			return fetchEntity({ route: "ticket", entityId: id!.toString() });
		},
		{
			enabled: !!id && isOpen,
			refetchOnWindowFocus: false,
		}
	);

	const {
		data: responsibleUsers,
		isLoading: responsibleUsersLoading,
		isError: responsibleUsersError,
	} = useQuery(["responsibleUsers"], () => fetchEntity({ route: "users" }));

	const {
		data: priorities,
		isLoading: prioritiesLoading,
		isError: prioritiesError,
	} = useQuery(["priorities"], () => fetchEntity({ route: "ticketPriorities" }));

	const defaultInputState = {
		responsibleUserId: fetchedTicket?.responsibleUser?.username,
		priorityId: fetchedTicket?.priority?.name,
	};
	const ticketState = {
		...fetchedTicket,
		dueDate: format(
			new Date(
				!!fetchedTicket && fetchedTicket.dueDate
					? new Date(fetchedTicket.dueDate)
					: new Date()
			),
			"yyyy-MM-dd'T'hh:mm"
		),
		...localTicketState,
	};
	const inputState = {
		...defaultInputState,
		...localInputState,
	};
	// mutations
	// ---------
	const mutation = useMutation(
		async () => {
			const editorOutput = await editor!.save();
			return mutateTicket(
				{
					...ticketState,
					description: JSON.stringify(editorOutput), // stateToHTML(editorState["description"].getCurrentContent()),
				},
				variant
			);
		},
		{
			onSuccess: async (response) => {
				await queryClient.invalidateQueries(["ticket", String(ticketState.id)]);
				await queryClient.invalidateQueries(["ticket"]);
				toast({
					title: "successfully saved ticket",
					status: "success",
				});
				if (variant === "add") {
					setLocalTicketState({
						id: response.data.id,
					});
					setLocalInputState({});
					setErrorMap(null);
					editor?.clear();
					setSuccess(true);
				} else {
					handleOnClose();
				}
			},
			onError: (error: AxiosError<ValidationErrorResponse>) => {
				const errorMap = getValidationErrorMap(error);
				setErrorMap(errorMap);
			},
		}
	);
	// handler
	// -------
	const handleInputChange = ([key, value]) => {
		setLocalTicketState((ticket) => {
			return {
				...ticket,
				[key]: value,
			};
		});
	};

	const handleInputValueChange = ([key, value]) => {
		setLocalInputState((input) => {
			return {
				...input,
				[key]: value,
			};
		});
	};

	const handleOnClose = () => {
		setLocalTicketState({});
		setLocalInputState({});
		editor?.clear?.();
		setSuccess(false);
		onClose();
	};

	const loading = [
		responsibleUsersLoading,
		prioritiesLoading,
		ticketFetchStatus === "fetching",
	].some((loading) => loading);
	const error = [responsibleUsersError, prioritiesError].some((error) => error);

	return (
		<Form
			variant={variant}
			modalIsOpen={isOpen}
			onAbort={handleOnClose}
			onSubmit={() => mutation.mutate()}
			onInputChange={handleInputChange}
			onInputValueChange={handleInputValueChange}
			ticketState={ticketState}
			inputState={inputState}
			onEditorMount={(editor) => setEditor(editor)}
			loading={loading}
			mutationLoading={mutation.isLoading}
			success={success}
			error={error}
			errorMap={errorMap || null}
			responsibleUsers={responsibleUsers?.items || []}
			priorities={priorities?.items || []}
		/>
	);
}

export default FormWrapper;
