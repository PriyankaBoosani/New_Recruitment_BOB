import { useCallback } from "react";
import masterApiService from "../services/masterApiService";


export default function useViewIndent(existingIndentPath) {
const viewIndent = useCallback(async () => {
if (!existingIndentPath) {
console.error("No indent path provided");
return;
}


console.log("DIR SENT TO API:", existingIndentPath);


try {
const response = await masterApiService.getSasUrl(existingIndentPath);
const sasUrl = response?.data?.data;


if (!sasUrl) {
console.error("SAS URL not returned");
return;
}


window.open(sasUrl, "_blank", "noopener,noreferrer");
} catch (err) {
console.error("Failed to fetch SAS URL", err);
}
}, [existingIndentPath]);


return viewIndent;
}