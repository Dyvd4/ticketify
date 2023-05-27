import { useState } from "react";

const useToggle = (defaultValue?: boolean) => {
    const [value, setValue] = useState(!!defaultValue);
    const toggle = () => {
        setValue(!value);
    };
    return [value, setValue, toggle];
};
export default useToggle;
