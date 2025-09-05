import type { ErrorProp } from "../types/errorProp.js";

export function ErrorPage(props: ErrorProp) {

    return (
        <div>
            <div>${props.errorCode}</div>
            <div>${props.errorDesc}</div>
        </div>
    );
}
