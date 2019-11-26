document.addEventListener("DOMContentLoaded", function() {

    let bookList = document.querySelector("ul#list")
    bookList.innerHTML = "Books:"
    let showPanel = document.querySelector("div#show-panel")
    let myUser = {"id": "1", "username":"pouros"}

    function createBooks(books){
        books.forEach(function(book){
            let li = document.createElement("li")
            bookList.append(li)
            li.innerHTML = `
                ${book.title}
            `
            li.dataset.id = book.id   
        })
    }

    function addUsersUl(book, div){
        let userUl = document.createElement("ul")
        userUl.dataset.purpose = "user-ul"
        div.append(userUl)
        book.users.forEach(function(user){
            let li = document.createElement("li")
            userUl.append(li)
            li.dataset.purpose = "user"
            li.dataset.id = user.id
            li.innerText = user.username
        })
    }

    function addLikeButton(div){
        let likeButton = document.createElement("button")
        let users = document.querySelectorAll("[data-purpose = 'user']")
        let userListed = false
        users.forEach(function(user){
            if(user.innerText === myUser.username){
                userListed = true
                debugger
            }
        })
        if(userListed === true){
            likeButton.innerText = "Unlike"
        }else{
            likeButton.innerText = "Like"
        }
        
        likeButton.dataset.id = div.dataset.id
        likeButton.dataset.purpose = "like"
        div.append(likeButton)
    }

    function createThumbnail(books){
        books.forEach(function(book){
            let div = document.createElement("div")
            showPanel.append(div)
            div.dataset.id = book.id
            div.dataset.purpose = "show-book"
            div.style.display = "none"
            div.innerHTML = `
                <h3>${book.title}</h3>
                <img src = ${book.img_url} />
                <strong>Description: ${book.description} </strong>
            `
            addUsersUl(book, div)
            addLikeButton(div)
        })
    }



    function fetchBooks(){
        fetch("http://localhost:3000/books")
        .then(function(resp){
            return resp.json()
        })
        .then(function(books){
            createBooks(books)
            createThumbnail(books)
        })
    }
    fetchBooks()
    function removeMyUser(array, id){
        fetch(`http://localhost:3000/books/${id}`, {method: "PATCH",
            headers:{
                "Content-type": "application/json",
                accept: "application/json"
            },
            body: JSON.stringify({users: array})

        })
        .then(function(resp){
            return resp.json()
        })
    }

    function updateUsers(array,id){
        fetch(`http://localhost:3000/books/${id}`, {method: "PATCH",
            headers:{
                "Content-type": "application/json",
                accept: "application/json"
            },
            body: JSON.stringify({users: array})

        })
        .then(function(resp){
            return resp.json()
        })
    }

    function updateUsersUl(ul, array){
        ul.innerHTML = ""
        array.forEach(function(user){
            let li = document.createElement("li")
            li.dataset.purpose = "user"
            li.dataset.id = user.id
            li.innerText = user.username
            ul.append(li)
        })
    }


    bookList.addEventListener("click", function(e){
        if(e.target !== null){
            let show = document.querySelector(`div[data-id = "${e.target.dataset.id}"]`)
            let showDivs = document.querySelectorAll("div[data-purpose = 'show-book']")
            console.log(show)
            showDivs.forEach(function(div){
                if(div.dataset.id !== e.target.dataset.id){
                    div.style.display = "none"
                }
            })
            show.style.display = "grid"
        }
    })

    showPanel.addEventListener("click", function(e){
        if(e.target.innerText === 'Like'){
            let book = e.target.parentNode
            e.target.innerText= 'Unlike'
            let users = book.querySelectorAll("[data-purpose = 'user']")
            let usersUl = book.querySelector("ul")
            let myUserListed = false
            let usersArray = []
            users.forEach(function(user){
                usersArray.push({id: user.dataset.id, username: user.innerText})
                if(user.innerText === myUser.username){
                    myUserListed = true
                    
                }
            })
            if(!myUserListed){
                usersArray.push(myUser)
            }
            updateUsersUl(usersUl,usersArray)
            updateUsers(usersArray, book.dataset.id)
            
        }else if(e.target.innerText === 'Unlike'){
            e.target.innerText = "Like"
            let book = e.target.parentNode
            let users = book.querySelectorAll("[data-purpose = 'user']")
            let usersUl = book.querySelector("ul")
            let usersArray = []
            users.forEach(function(li){
                if(li.innerText === myUser.username){
                    li.remove()
                }else{
                    usersArray.push({id: li.dataset.id, username: li.innerText})
                }
            })
            removeMyUser(usersArray, e.target.dataset.id)
        }
    })

});
