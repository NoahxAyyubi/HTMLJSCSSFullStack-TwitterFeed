document.addEventListener("DOMContentLoaded", () => {
    const tweetButton = document.querySelector(".tweetbox__tweetButton");
    const tweetInput = document.querySelector(".tweetbox__input input");
    const feed = document.querySelector(".feed");
    
    const BIN_ID = '6713c6caacd3cb34a899b262'; // Your BIN_ID
    const ACCESS_KEY = '$2a$10$tLeRimVEHOxU0NpB.1oNm.AfMTykeajNJofXZAy.wdnbpBgUVRZue'; // Your ACCESS_KEY
    const API_KEY = '$2a$10$Y2cSsRKOyq5nTYjGxdwiRuBy6GNQdwP1UGjzQ44aBtH18ec5Qhp6a'; // Your API_KEY

    async function fetchTweets() {
        try {
            const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Access-Key': ACCESS_KEY // Access Key for JSONBin
                }
            });
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            data.record.tweets.reverse().forEach(tweet => {
                const tweetElement = createTweetElement(tweet);
                feed.appendChild(tweetElement);
            });
        } catch (error) {
            console.error('Error fetching tweets:', error);
        }
    }

    function createTweetElement(tweet) {
        const tweetElement = document.createElement("div");
        tweetElement.classList.add("post");

        tweetElement.innerHTML = `
            <div class="post__avatar">
                <img src="/IMG_0135-modified.png" alt="Avatar"> <!-- Adjusted image path -->
            </div>
            <div class="post__body">
                <div class="post__header">
                    <div class="post__headerText">
                        <h3>
                            ${tweet.user}
                            <span class="post__headerSpecial">
                                <span class="material-icons post__badge">verified</span>
                                @${tweet.userHandle}
                            </span>
                        </h3>
                    </div>
                    <div class="post__headerDescription">
                        <p>${tweet.content}</p>
                    </div>
                    ${tweet.image ? `<img src="${tweet.image}" alt="">` : ''}
                    <div class="post__footer">
                        <span class="material-icons">repeat</span>
                        <span class="material-icons">favorite_border</span>
                        <span class="material-icons">publish</span>
                    </div>
                </div>
            </div>
        `;

        return tweetElement;
    }

    tweetButton.addEventListener("click", async (event) => {
        event.preventDefault();
        const chirpSound = new Audio('/chirp.mp3');
        chirpSound.play();
        const tweetText = tweetInput.value.trim();

        if (tweetText) {
            const newTweet = {
                user: 'Twitter User',
                userHandle: 'noah_ayyubi',
                content: tweetText,
                image: null
            };

            try {
                // Step 1: Fetch existing tweets
                const existingResponse = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Access-Key': ACCESS_KEY // Access Key for JSONBin
                    }
                });

                const existingData = await existingResponse.json();
                const tweets = existingData.record.tweets;

                // Step 2: Add the new tweet
                tweets.push(newTweet);

              // Step 3: Update the JSONBin with the new array of tweets
const putResponse = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': API_KEY, // Access Key for JSONBin
        'X-Access-Key': ACCESS_KEY,
        'X-Bin-Versioning': 'false' // Disable version control for updates
    },
    body: JSON.stringify({ record: { // Wrap tweets inside 'record'
        tweets: tweets // The tweets array to be updated
    } })
});

                if (putResponse.ok) {
                    const updatedTweet = createTweetElement(newTweet);
                    feed.insertBefore(updatedTweet, document.querySelector('.tweetbox').nextSibling);
                    tweetInput.value = "";
                } else {
                    console.error('Failed to update the tweets');
                }
            } catch (error) {
                console.error('Error posting tweet:', error);
            }
        }
    });

    fetchTweets(); // Fetch tweets on page load
});
