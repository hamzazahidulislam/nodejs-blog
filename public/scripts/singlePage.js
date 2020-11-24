window.onload = function () {
    const bookmarks = document.getElementsByClassName('bookmark')
    const likeBtn = document.getElementById('likeBtn')
    const dislikeBtn = document.getElementById('dislikeBtn')
    const comment = document.getElementById('comment')
    const commentHolder = document.getElementById('comment-holder');
    [...bookmarks].forEach(bookmark => {
        bookmark.style.cursor = 'pointer'
        bookmark.addEventListener('click', function (e) {
            let target = e.target.parentElement

            let headers = new Headers()
            headers.append('Accept', 'Application/JSON')

            let req = new Request(`/api/bookmarks/${target.dataset.post}`, {
                method: 'GET',
                headers,
                mode: 'cors'
            })

            fetch(req)
                .then(res => res.json())
                .then(data => {
                    if (data.bookmark) {
                        target.innerHTML = '<i class="fas fa-bookmark"></i>'
                    } else {
                        target.innerHTML = '<i class="far fa-bookmark"></i>'
                    }
                })
                .catch(e => {
                    console.log(e.response.data)
                    alert(e.response)
                })
        })
    })
    // comment 
    comment.addEventListener('keypress', function (e) {
        if (e.key == 'Enter') {
            if (e.target.value) {
                let postId = comment.dataset.post
                let data = {
                    body: e.target.value
                }
                let req = genarateRequest(`/api/comments/${postId}`, 'POST', data)
                fetch(req)
                    .then(res => res.json())
                    .then(data => {
                        let commentElement = createComment(data)
                        commentHolder.insertBefore(commentElement, commentHolder.children[0])
                        e.target.value = ''
                    })
                    .catch(e => {
                        console.log(e.message)
                        alert(e.message)
                    })
            } else {
                alert('Please Enter A Valid Comment')
            }
        }
    })

    commentHolder.addEventListener('keypress', function (e) {
        if (commentHolder.hasChildNodes(e.target)) {
            if (e.key == 'Enter') {
                let commentId = e.target.dataset.comment
                let value = e.target.value

                if (value) {
                    let data = {
                        body: value
                    }
                    let req = genarateRequest(`/api/comments/replies/${commentId}`, 'POST', data)
                    fetch(req)
                        .then(res => res.json())
                        .then(data => {
                            let replyElement = createReplyComment(data)
                            let parent = e.target.parentElement
                            parent.previousElementSibling.appendChild(replyElement)
                            e.target.value = ''
                        })
                        .catch(e => {
                            console.log(e)
                            alert(e.message)
                        })
                } else {
                    alert('Please Enter A Valid Reply')
                }
            }
        }
    })
    //like dislike 
    likeBtn.addEventListener('click', function (e) {
        let postId = likeBtn.dataset.post
        reqLikeDislike('Likes', postId)
            .then(res => res.json())
            .then(data => {
                let LikeText = data.liked ? 'Liked' : 'Like'
                LikeText = LikeText + `( ${data.totalLikes} )`
                let dislikeText = `Dislike ( ${data.totalDisLikes} )`

                likeBtn.innerHTML = LikeText
                dislikeBtn.innerHTML = dislikeText
            })
            .catch(e => {
                console.log(e.data)
            })
    })
    dislikeBtn.addEventListener('click', function (e) {
        let postId = likeBtn.dataset.post
        reqLikeDislike('dislikes', postId)
            .then(res => res.json())
            .then(data => {
                let dislikeText = data.disliked ? 'Disliked' : 'Dislike'
                dislikeText = dislikeText + `( ${data.totalDisLikes} )`
                let LikeText = `Like ( ${ data.totalLikes } )`

                likeBtn.innerHTML = LikeText
                dislikeBtn.innerHTML = dislikeText
            })
            .catch(e => {
                console.log(e.data)
            })
    })

}

function genarateRequest(url, method, body) {
    let headers = new Headers()
    headers.append('Accept', 'Application/JSON')
    headers.append('Content-Type', 'Application/JSON')

    let req = new Request(url, {
        method,
        headers,
        body: JSON.stringify(body),
        mode: 'cors'
    })
    return req
}

function createComment(comment) {
    let innerHTML = `
    <img src="${comment.user.profilePics}" 
    class="rounded-circle mx-3 my-3" style="width: 40px;">
    <div class="media-body my-3">
        <p>${comment.body}</p>
        <div class="my-3">
            <input class="form-control" type="text" placeholder="Press Enter to Reply " name="reply"
                data-comment="${comment._id}">
        </div>
    </div> 
	`

    let div = document.createElement('div')
    div.className = 'media border'
    div.innerHTML = innerHTML

    return div
}

function createReplyComment(reply) {
    let innerHTML = `
		<img style="width:40px;" src="${reply.profilePics}" class="align-self-start mr-3  rounded-circle" alt="">
		<div class="media-body">
			<p>${reply.body}</p>
		</div>
    `
    let div = document.createElement('div')
    div.className = 'media mt-3'
    div.innerHTML = innerHTML

    return div
}

function reqLikeDislike(type, postId) {
    let headers = new Headers()
    headers.append('Accept', 'Application/JSON')
    headers.append('Content-Type', 'Application/JSON')

    let req = new Request(`/api/${type}/${postId}`, {
        method: 'GET',
        headers,
        mode: 'cors'
    })
    console.log(req)
    return fetch(req)
}