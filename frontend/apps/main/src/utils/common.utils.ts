import type { IError } from "@forever/api";
import toast from "react-hot-toast";

export const handleShowApiErrorWithToastMessages = (error: IError) => {
    const apiError = error?.response?.data?.error.errorMessage;
    if (typeof apiError === "string") toast.error(apiError);
    if (apiError && typeof apiError === "object") {
        Object.entries(apiError).forEach(([key, value]) => {
            value.forEach((val) => {
                toast.error(`${key} : ${val}`);
            });
        });
    }
}