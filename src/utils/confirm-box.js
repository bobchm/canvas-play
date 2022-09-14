import { confirm } from "react-confirm-box";

async function confirmationBox(
    question = "Are you sure?",
    confirmLabel = "Yes",
    rejectLabel = "No",
    clickOutside = false
) {
    const options = {
        closeOnOverlayClick: clickOutside,
        labels: {
            confirmable: confirmLabel,
            cancellable: rejectLabel,
        },
    };

    return await confirm(question, options);
}

export default confirmationBox;
