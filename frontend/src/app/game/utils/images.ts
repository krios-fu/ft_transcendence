import { environment } from "../../../environments/environment";

export function g_buildImgUrl(imgPath: string): string {
    return (environment.staticUrl + imgPath);
}
