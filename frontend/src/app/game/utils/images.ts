import { environment } from "../../../environments/environment";

export function g_buildImgUrl(imgPath: string): string {
    if (imgPath.startsWith("http"))
        return (imgPath);
    return (environment.staticUrl + imgPath);
}
