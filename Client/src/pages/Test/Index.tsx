import { Button, MenuItem } from "@chakra-ui/react";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import { useRef } from "react";
import { useMutation } from "react-query";
import { fetchEntity, updateEntity } from "src/api/entity";
import ActionBox from "src/components/ActionBox/ActionBox";
import Editor from "src/components/Editor";
import useBreadcrumb from "src/context/hooks/useBreadcrumbs";
import useToggle from "src/hooks/useToggle";
import TestComponent from "./TestComponent";

interface IndexProps {}
type test = undefined | never;
function Index(props: IndexProps) {
	useBreadcrumb([{ name: "/", isCurrentPage: true }]);

	const makeRequest = async () => {
		const objWithNested = {
			randomProp: "haha",
			anotherProp: "hehe",
			nestedObj: {
				someNestedProp: "fhdsjkfhs",
				someNestedArrProp: ["fdsfds", "fhdjskhfjk"],
			},
		};
		await fetchEntity({
			route: "dummy/getWithObjectUrlParams",
			queryParams: objWithNested,
		});
	};
	const [isCollapsed, , toggleIsCollapsed] = useToggle(false);

	return (
		<>
			<ActionBox
				useCollapse
				isCollapsed={isCollapsed}
				toggleIsCollapsed={toggleIsCollapsed}
				menuActions={[
					<MenuItem onClick={() => console.log("test")}>Download</MenuItem>,
					<MenuItem>Download</MenuItem>,
					<MenuItem>Download</MenuItem>,
				]}
				actions={[
					<Button size={"xs"} onClick={() => console.log("test")}>
						Download
					</Button>,
					<Button size={"xs"}>Download</Button>,
					<Button size={"xs"}>Download</Button>,
				]}
				title="test"
			>
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias quia iusto, quibusdam
				fugiat error voluptatum itaque labore. Cumque aspernatur at eius soluta repudiandae.
				Sint vitae numquam odit! Numquam, modi. Quis, dignissimos veniam? Possimus ad autem
				repellendus dolore, sunt alias eveniet incidunt iure fugit maiores numquam esse qui!
				Quod eos aliquid numquam voluptates dicta? Reprehenderit doloremque tenetur delectus
				commodi a. Quisquam itaque officiis veritatis minima a! Reiciendis autem fugiat
				aliquam laborum alias dolorum ipsum facere ab dolorem architecto totam impedit
				omnis, odit illo magnam ipsa inventore rerum eveniet iure! Illum, rem tempore animi
				molestias inventore sed dolor fugit magnam reprehenderit architecto.
			</ActionBox>
			<TestComponent useCollapse isCollapsed toggleIsCollapsed={() => {}} />
			<br />
			<br />
			<Editor onChange={(a, e) => console.log(a, e)} />
			{/* <TestList
                header={{
                    title: "test",
                    showCount: true,
                }}
                id="5802edfd-85e0-41d7-818a-b2e7ab0c6d54"
                filter={[
                    {
                        property: "isAmazing",
                        type: "boolean",
                        label: "Is amazing",
                    },
                    {
                        property: "createdAt",
                        type: "date",
                        label: "created at",
                    },
                ]}
                fetch={{
                    route: "dummy/test/pager",
                    queryKey: "test",
                }}
                columns={[
                    {
                        property: "isAmazing",
                        label: "is amazing",
                        disabled: true,
                    },
                    {
                        property: "createdAt",
                        label: "created at",
                        disabled: true,
                    },
                    {
                        property: "description",
                        label: "description",
                        disabled: true,
                    },
                ]}
                listItemRender={(item) => (
                    <>
                        <Td>{String(item.isAmazing)}</Td>
                        <Td>{item.createdAt}</Td>
                        <Td>{item.description}</Td>
                    </>
                )}
                search={{
                    property: "description",
                    type: "string",
                    operation: {
                        value: "contains",
                    },
                    label: "search by description",
                }}
            ></TestList>
            <br />
            <SearchBar />
            <br />
            <IconButton
                aria-label="test"
                circle
                icon={<FontAwesomeIcon size="sm" icon={faThumbTack} />}
            /> */}
			{/* <List
                variant={{
                    name: "pagination"
                }}
                id="6ed914af-4959-4920-8327-1bec3dccebc7"
                fetch={{
                    route: "dummy/test/pager",
                    queryKey: "test"
                }}
                listItemRender={(item) => (
                    <ListItem
                        useDivider
                        heading={
                            <ListItemHeading>
                                This is a fairly creative heading
                            </ListItemHeading>
                        }
                        actions={<>
                            <MenuItem
                                icon={<FontAwesomeIcon icon={faEdit} />}>
                                Edit
                            </MenuItem>
                            <MenuItem
                                icon={<FontAwesomeIcon icon={faDownload} />}>
                                Download
                            </MenuItem>
                            <MenuItem
                                icon={<FontAwesomeIcon icon={faImage} />}>
                                Save as image
                            </MenuItem>
                        </>}
                        content={<ListItemContent item={item} />}
                        tags={[
                            <Tag colorScheme={"red"}>Tag</Tag>,
                            <Tag colorScheme={"green"}>Tag</Tag>,
                            <Tag colorScheme={"cyan"}>Tag</Tag>,
                        ]}
                    />
                )}
                header={{
                    title: "test",
                    showCount: true
                }}
                search={{
                    label: "search for description",
                    property: "description",
                    operation: {
                        value: "contains"
                    },
                    type: "string"
                }}
                sort={[
                    {
                        property: "isAmazing",
                        label: "Is amazing"
                    },
                    {
                        property: "description",
                    },
                    {
                        property: "createdAt",
                        label: "created at"
                    }
                ]}
                filter={[
                    {
                        property: "isAmazing",
                        type: "boolean",
                        label: "Is amazing"
                    },
                    {
                        property: "description",
                        type: "string",
                    },
                    {
                        property: "createdAt",
                        type: "date",
                        label: "created at"
                    }
                ]}
            /> */}
			{/* <Button onClick={makeRequest}>Make Request</Button> */}
		</>
	);
}

export default Index;
