import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

document.addEventListener('click', function (e) {
    if (e.target.dataset.like) {
        handleLikeClick(e.target.dataset.like)
    }
    else if (e.target.dataset.retweet) {
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if (e.target.dataset.reply) {
        handleReplyClick(e.target.dataset.reply)
    }
    else if (e.target.id === 'tweet-btn') {
        handleTweetBtnClick()
    }
    else if (e.target.dataset.replyspecial) {
        handleReplySpecialClick(e.target.dataset.replyspecial)
    }
    else if (e.target.dataset.answer) {//twreply
        handleReplyTweetBtnClick(e.target.dataset.answer)
    }

})

function handleLikeClick(tweetId) {
    const targetTweetObj = tweetsData.filter(function (tweet) {
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked) {
        targetTweetObj.likes--
    }
    else {
        targetTweetObj.likes++
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function handleRetweetClick(tweetId) {
    const targetTweetObj = tweetsData.filter(function (tweet) {
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isRetweeted) {
        targetTweetObj.retweets--
    }
    else {
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render()
}

function handleReplyClick(replyId) {
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}


let postScrimba = []


function handleTweetBtnClick() {
    const tweetInput = document.getElementById('tweet-input')
    
    
    
postScrimba.push(tweetInput.value)
tweetInput.value = ""
localStorage.setItem("postScrimba", JSON.stringify(postScrimba) )
console.log( JSON.parse(localStorage.getItem("postScrimba") ))

    
    

    if (tweetInput.value) {
        tweetsData.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
        render()

        tweetInput.value = ''
    }
}


function handleReplySpecialClick(replyspecialId) {
    document.getElementById(`tweet-reply-text-${replyspecialId}`).classList.toggle("hidden")
}

let postsReply = []

function handleReplyTweetBtnClick(replyspecialId) {
    const tweetReplyArea = document.getElementById(`tweet-reply-area-${replyspecialId}`)
    const targetTweetObj = tweetsData.filter(function (tweet) {
        return tweet.uuid === replyspecialId
    })[0]
    
            

postsReply.push(tweetReplyArea.value)
tweetReplyArea.value = ""
localStorage.setItem("postsReply", JSON.stringify(postsReply) )
console.log( JSON.parse(localStorage.getItem("postsReply") ))

    if (tweetReplyArea.value) {
        targetTweetObj.replies.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            tweetText: tweetReplyArea.value,
            uuid: uuidv4()
        })
        render()
        

    }
}

function getFeedHtml() {
    let feedHtml = ``

    tweetsData.forEach(function (tweet) {

        let likeIconClass = ''

        if (tweet.isLiked) {
            likeIconClass = 'liked'
        }

        let retweetIconClass = ''

        if (tweet.isRetweeted) {
            retweetIconClass = 'retweeted'
        }

        let repliesHtml = ''

        if (tweet.replies.length > 0) {
            tweet.replies.forEach(function (reply) {
                repliesHtml += `
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`
            })
        }


        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
                
                <span class="tweet-detail">
                   <i class="fa-solid fa-reply "
                   data-replyspecial="${tweet.uuid}"
                   ></i>
                </span>
         </div>        
                
        <div id="tweet-reply-text-${tweet.uuid}" class="tweet-reply-text hidden">
           <div class="tweet-inner">      
      
            <div>
              <img src="images/scrimbalogo.png" class="profile-pic">
                <p class="handle">@Scrimba</p>
              
            </div>
            <div>
             <textarea placeholder="Tweet your reply.." id="tweet-reply-area-${tweet.uuid}" data-twreply="${tweet.uuid}"></textarea>
           <button  data-answer ="${tweet.uuid}">Reply</button>  
            </div>
            
        </div>
  
                
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
    </div> 
      
</div>
`
    })
    return feedHtml
}

function render() {
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()




