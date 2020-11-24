window.onload = function () {
    const likeBtn = document.getElementById('likeBtn')
    const dislikeBtn = document.getElementById('dislikeBtn')

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
}