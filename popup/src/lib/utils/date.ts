export function displayRelativeDate(timestamp: number): string {
    //Not handling timezones correctly
    const now = Date.now() / 1000
    const SECONDS_IN_DAY = 3600 * 24

    if (now - timestamp < SECONDS_IN_DAY) {
        return 'today'
    } else {
        const daysAgo = Math.round((now - timestamp) / SECONDS_IN_DAY)
        return `${daysAgo} days ago`
    }
}
