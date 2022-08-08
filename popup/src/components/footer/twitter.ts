import { Address } from "../../domain/event";

export function displayTwitterButton(contractAddress: Address, domain: string) {
    const safeDomain = domain.replaceAll('.', '[.]')
    const tweetText = encodeURI(
        `@p33kablock\ncontract:${contractAddress.address}\ndomain:${safeDomain}\n`
    );
    const twitterButton: HTMLLinkElement = document.getElementById('twitter-hashtag-button') as HTMLLinkElement
    twitterButton.href = `${twitterButton.href}?text=${tweetText}&hashtags=ScamReport`
}