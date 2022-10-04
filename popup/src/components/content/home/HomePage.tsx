import React, { useState } from "react"
import { Pages } from "../../../lib/navigation/pages"
import { MenuOption } from "../../common/menu/Menu"
import { homeMenuOptions } from "../../common/menu/MenuOptions"
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
    const menuOptions = homeMenuOptions(setCurrentPage);
    const title = menuOptions.find(x => x.value === currentPage).label;
    const _menuOptions = props.hideNavigation ? undefined : menuOptions;
    const hideTitle = currentPage === Pages.HOME

    const reportBug = () => setCurrentPage(Pages.SUPPORT)
    const reportScam = () => setCurrentPage(Pages.SCAM_REPORT)
    return <div className='new_container'>
        <NewHeader menuOptions={_menuOptions} />
        <NewContent title={title} back={props.back} hideTitle={hideTitle}>
            <div className='new_content_body'>
                {
                    currentPage === Pages.SCAM_REPORT ?
                        <ReportScamPage referrer={props.referrer} /> : (
                            currentPage === Pages.SUPPORT ?
                                <SupportPage
                                    errorContext={props.errorContext}
                                    referrer={props.referrer} /> :
                                <HomeContent
                                    reportBug={reportBug}
                                    reportScam={reportScam}
                                />
                        )
                }
            </div>
        </NewContent>
    </div>
}