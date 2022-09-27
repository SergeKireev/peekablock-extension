import * as React from 'react';
import { TransactionPage } from './components/content/tx/TransactionPage';
import { decodeParam } from './lib/utils/uri';
import { Pages } from './lib/navigation/pages';
import { HomePage, HomeProps } from './components/content/home/HomePage';
import { createTheme, ThemeProvider } from '@mui/material';

let _browser = undefined
let isChrome = undefined
try {
    //@ts-ignore
    _browser = browser ? browser : chrome
    isChrome = false
} catch {
    //@ts-ignore
    _browser = chrome
    isChrome = true
}

const theme = createTheme({
    palette: {
        success: {
            // This is green
            main: '#059669'
        },
        error: {
            // This is red
            main: '#E5483E'
        },
        secondary: {
            // This is purple.
            main: '#9460C8',
        },
    },
});


function handleOpenPopup() {
    const [page, setPage] = React.useState(undefined)
    const [transaction, setTransaction] = React.useState(undefined)
    const [homeProps, setHomeProps] = React.useState(undefined)
    const [referrer, setReferrer] = React.useState(undefined)

    const _homeProps: HomeProps = {
        back: () => setPage(Pages.TRANSACTION),
        hideNavigation: true
    }

    React.useEffect(() => {
        if (!referrer) {
            const _referrer = decodeParam('referrer', false)
            if (!_referrer || _referrer == 'null') {
                _browser.tabs.query(
                    { currentWindow: true, active: true },
                    function (tabs) {
                        const activeTab = tabs[0];
                        const domain = new URL(activeTab.url).hostname
                        setReferrer(domain);
                    });
            } else {
                setReferrer(_referrer);
            }
        }
        const _transaction = decodeParam('transaction', true)
        console.log("Decoded tx", _transaction);
        if (!page && _transaction) {
            setHomeProps(_homeProps);
            setTransaction(_transaction);
            setPage(Pages.TRANSACTION)
        }
    })

    const reportScam = () => setPage(Pages.SCAM_REPORT);
    const reportBug = () => setPage(Pages.SUPPORT);
    return <ThemeProvider theme={theme}>
        {
            page === Pages.TRANSACTION 
                ?
                <TransactionPage
                    referrer={referrer}
                    reportScam={reportScam}
                    reportBug={reportBug}
                    transaction={transaction} /> :
                <HomePage {...homeProps}
                    initPage={page}
                    referrer={referrer} />
        }
    </ThemeProvider>
}

const App = () => {
    return handleOpenPopup();
};

export default App;