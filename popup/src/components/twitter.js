export function displayTwitterButton(contractAddress, domain) {
    const safeDomain = domain.replaceAll('.', '[.]')
    const tweetText = encodeURI(
        `@p33kablock\ncontract:${contractAddress.address}\ndomain:${safeDomain}\n`
    );
    const twitterButton = document.getElementById('twitter-hashtag-button')
    twitterButton.href = `${twitterButton.href}?text=${tweetText}&hashtags=ScamReport`
}