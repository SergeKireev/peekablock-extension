import React, { useState } from "react"
import { Pages } from "../../../lib/navigation/pages"
import { MenuOption } from "../../common/menu/Menu"
import { NewHeader } from "../../header/NewHeader"
import { NewContent } from "../NewContent"
import { ReportScamPage } from "../report/scam/ReportScamPage"
import { SupportPage } from "../report/support/SupportPage"
import { HomeContent } from "./HomeContent"


export interface ErrorContext {
    message?: string
}

export interface HomeProps {
    back?: () => void,
    initPage?: string;
    hideNavigation: boolean
    referrer?: string
    errorContext: ErrorContext
}

export const HomePage = (props: HomeProps) => {

    const [currentPage, setCurrentPage] = useState(props.initPage || Pages.HOME);

    const menuOptions: MenuOption[] = [
        {
            label: 'Home',
            value: Pages.HOME,
            callback: () => setCurrentPage(Pages.HOME)
        },
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
    ]

    const title = menuOptions.find(x => x.value === currentPage).label;

    const _menuOptions = props.hideNavigation ? undefined : menuOptions;

    return <div className='new_container'>
        <NewHeader menuOptions={_menuOptions} />
        <NewContent title={title} back={props.back}>
            <div className='new_content_body'>
                {
                    currentPage === Pages.SCAM_REPORT ?
                        <ReportScamPage referrer={props.referrer} /> : (
                            currentPage === Pages.SUPPORT ?
                                <SupportPage
                                    errorContext={props.errorContext}
                                    referrer={props.referrer} /> :
                                <HomeContent />
                        )
                }
            </div>
        </NewContent>
    </div>
}