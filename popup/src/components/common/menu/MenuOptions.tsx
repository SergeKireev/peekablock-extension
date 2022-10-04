import { Pages } from "../../../lib/navigation/pages";
import { MenuOption } from "./Menu";

export const homeMenuOptions = (setCurrentPage: (p: string) => void): MenuOption[] => ([
    {
        label: 'Home',
        value: Pages.HOME,
        callback: () => setCurrentPage(Pages.HOME)
    },
    ...txMenuOptions(setCurrentPage)
])

export const txMenuOptions = (setCurrentPage: (p: string) => void): MenuOption[] => ([
    {
        label: 'Support',
        value: Pages.SUPPORT,
        callback: () => setCurrentPage(Pages.SUPPORT)
    },
    {
        label: 'Report a scam',
        value: Pages.SCAM_REPORT,
        callback: () => setCurrentPage(Pages.SCAM_REPORT)
    },
])