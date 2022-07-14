export function displayTwitterButton(contractAddress, domain) {
    const safeDomain = domain.replaceAll('.', '[.]')
    const tweetText = encodeURI(
        `@p33kablock\ncontract:${contractAddress.address}\ndomain:${safeDomain}\n#ScamReport`
    );
    const twitterButton = document.getElementById('twitter-hashtag-button')
    twitterButton.href = `${twitterButton.href}?text=${tweetText}`
    
    //We have to load the script after the link is fully formed
    var script = document.createElement('script');
    script.src = 'https://platform.twitter.com/widgets.js';
    document.head.appendChild(script);
}