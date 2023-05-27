import {
    Divider,
    Heading,
    Mark,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "react-query";
import { updateEntity } from "src/api/entity";
import { useCurrentUserSettings } from "src/hooks/user";
import SettingsSwitch from "../components/SettingsSwitch";

function FilterAndSortPersistenceSection() {
    const { currentUserSettings } = useCurrentUserSettings();
    const queryClient = useQueryClient();

    const mutation = useMutation(
        (payload: any) => {
            return updateEntity({
                route: "userSettings",
                payload,
            });
        },
        {
            onMutate: async (payload) => {
                const oldUserSettings: any = queryClient.getQueryData(["userSettings"]);
                const newUserSettings = {
                    ...oldUserSettings,
                    ...payload,
                };
                queryClient.setQueryData(["userSettings"], newUserSettings);

                return { userSettings: oldUserSettings };
            },
            onError: (error, payload, context) => {
                queryClient.setQueryData(["userSettings"], (context as any).userSettings);
            },
            onSuccess: () => {
                queryClient.invalidateQueries(["userSettings"]);
            },
        }
    );

    const filterAndSortPersistenceSettingsByLocalStorageAreChecked =
        currentUserSettings.allowFilterItemsByLocalStorage &&
        currentUserSettings.allowSortItemsByLocalStorage;
    const filterAndSortPersistenceSettingsByUrlAreChecked =
        currentUserSettings.allowFilterItemsByUrl && currentUserSettings.allowSortItemsByUrl;
    const someFilterAndSortPersistenceSettingsByLocalStorageAreChecked = [
        currentUserSettings.allowFilterItemsByLocalStorage,
        currentUserSettings.allowSortItemsByLocalStorage,
    ].some((setting) => setting);
    const someFilterAndSortPersistenceSettingsByUrlAreChecked = [
        currentUserSettings.allowFilterItemsByUrl,
        currentUserSettings.allowSortItemsByUrl,
    ].some((setting) => setting);

    return (
        <>
            <Heading as="h3" className="text-xl font-bold">
                Filter and sort persistence (
                <Popover placement="top">
                    <PopoverTrigger>
                        <Mark cursor={"pointer"} textDecoration={"underline"} color={"orange.100"}>
                            XOR
                        </Mark>
                    </PopoverTrigger>
                    <PopoverContent>
                        <PopoverArrow />
                        <PopoverBody className="text-base font-normal">
                            This means that only one of the below settings-group can be checked.
                        </PopoverBody>
                    </PopoverContent>
                </Popover>
                )...
            </Heading>
            <Divider className="mb-2 mt-4" />
            <SettingsSwitch
                disabled={someFilterAndSortPersistenceSettingsByUrlAreChecked}
                className="my-2 ml-2"
                variant="heading"
                name="...via local storage"
                switchProps={{
                    isChecked: filterAndSortPersistenceSettingsByLocalStorageAreChecked,
                    onChange: () =>
                        mutation.mutate({
                            allowSortItemsByLocalStorage:
                                !filterAndSortPersistenceSettingsByLocalStorageAreChecked,
                            allowFilterItemsByLocalStorage:
                                !filterAndSortPersistenceSettingsByLocalStorageAreChecked,
                        }),
                    size: "md",
                }}
            />
            <SettingsSwitch
                disabled={someFilterAndSortPersistenceSettingsByUrlAreChecked}
                className="ml-4"
                name="Allow filter to be stored in- and applied by local storage"
                description="This enables the filter mechanism to work with the local storage of the browser. When the filter of a list is being applied, it'll be stored in the local storage. When you now reload the page, the stored filter will be applied. This will work against the stored filter in the URL."
                switchProps={{
                    isChecked: currentUserSettings.allowFilterItemsByLocalStorage,
                    onChange: () =>
                        mutation.mutate({
                            allowFilterItemsByLocalStorage:
                                !currentUserSettings.allowFilterItemsByLocalStorage,
                        }),
                }}
            />
            <SettingsSwitch
                disabled={someFilterAndSortPersistenceSettingsByUrlAreChecked}
                className="ml-4"
                name="Allow sort to be stored in- and applied by local storage"
                description={
                    <>
                        <span>This works the same way as mentioned in the</span>
                        <b>
                            &nbsp; "Allow sort to be stored in- and applied by local
                            storage"-setting,
                        </b>
                        &nbsp;
                        <span>but for sort."</span>
                    </>
                }
                switchProps={{
                    isChecked: currentUserSettings.allowSortItemsByLocalStorage,
                    onChange: () =>
                        mutation.mutate({
                            allowSortItemsByLocalStorage:
                                !currentUserSettings.allowSortItemsByLocalStorage,
                        }),
                }}
            />
            <Divider className="my-2" />
            <SettingsSwitch
                disabled={someFilterAndSortPersistenceSettingsByLocalStorageAreChecked}
                className="my-2 ml-2"
                variant="heading"
                name="...via URL"
                switchProps={{
                    isChecked: filterAndSortPersistenceSettingsByUrlAreChecked,
                    onChange: () =>
                        mutation.mutate({
                            allowSortItemsByUrl: !filterAndSortPersistenceSettingsByUrlAreChecked,
                            allowFilterItemsByUrl: !filterAndSortPersistenceSettingsByUrlAreChecked,
                        }),
                    size: "md",
                }}
            />
            <SettingsSwitch
                disabled={someFilterAndSortPersistenceSettingsByLocalStorageAreChecked}
                className="ml-4"
                name="Allow filter to be stored in- and applied by URL"
                description="This enables the filter mechanism to work with the URL. When the filter is being applied, it'll be stored in the URL. So you can share the link of the page containing this list to other users. Now - if they also have the option enabled, the filter will be applied on their list too. This will work against the stored filter in the local storage."
                switchProps={{
                    isChecked: currentUserSettings.allowFilterItemsByUrl,
                    onChange: () =>
                        mutation.mutate({
                            allowFilterItemsByUrl: !currentUserSettings.allowFilterItemsByUrl,
                        }),
                }}
            />
            <SettingsSwitch
                disabled={someFilterAndSortPersistenceSettingsByLocalStorageAreChecked}
                className="ml-4"
                name="Allow sort to be stored in- and applied by URL"
                description={
                    <>
                        <span>This works the same way as mentioned in the</span>
                        <b>&nbsp; "Allow filter to be stored in- and applied by URL"-setting,</b>
                        &nbsp;
                        <span>but for sort.</span>
                    </>
                }
                switchProps={{
                    isChecked: currentUserSettings.allowSortItemsByUrl,
                    onChange: () =>
                        mutation.mutate({
                            allowSortItemsByUrl: !currentUserSettings.allowSortItemsByUrl,
                        }),
                }}
            />
        </>
    );
}

export default FilterAndSortPersistenceSection;
