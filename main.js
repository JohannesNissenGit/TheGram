/*
* ////var, let//////
*/
let bookmarkposition = 0;
let likeposition = 0;
var x = document.getElementById('geocontainer');
let friends = [];
let friendsnames = [];

let commentposition;

/*
*  ////functions//////////////////////////////
*/

/*
*showlocation: gathers longitude and latitude from google and puts it in container, then displays said container
*/

function showlocation() {

    document.getElementById("geocontainer").classList.remove('display-none');
    document.getElementById("geocontainer").classList.add('z1');
    getLocation();
    timeoutgeo();

}

function getLocation() { //from https://www.w3schools.com/html/html5_geolocation.asp

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        document.getElementById('geocontainer').innerHTML = "Geolocation wird von deinem Browser nicht unterstützt.";
    }
}

function showPosition(position) {
    document.getElementById('geocontainer').innerHTML = "Du befindest dich auf folgenden Koordinaten:" + "Latitude: " + position.coords.latitude +
        "<br>Longitude: " + position.coords.longitude;
}

function timeoutgeo() {
    setTimeout(function () {
        document.getElementById("geocontainer").classList.add('display-none');
        document.getElementById("geocontainer").classList.remove('z1');
    }, 3000);
}

/*
*closesearch: removes searches from view
*/
function closesearch() {
    document.getElementById("searchcontainer").classList.add('display-none');
    document.getElementById("searchcontainer").classList.remove('z1');
    console.log('Searchlist closed');
}

/*
*showsearch: displays searches if search contains stuff
*/
function showsearch() {
    let search = document.getElementById('search').value;
    if (search.length > 0) {
        document.getElementById("searchcontainer").classList.remove('display-none');
        document.getElementById("searchcontainer").classList.remove('z-1');
        document.getElementById("searchcontainer").classList.add('z1');
    }
}
/*
*filternames: adds all relevant names to searchlist
*/

function filternames() {

    let search = document.getElementById('search').value;
    search = search.toLowerCase();
    showsearch()

    let list = document.getElementById('searchlist');
    list.innerHTML = '';

    for (let i = 0; i < friendsnames.length; i++) {
        let name = friendsnames[i];
        let element = posts[i];
        if (name.toLowerCase().includes(search)) {
            list.innerHTML += `<div class="searchitem" id="searchitem${element['id']}" onclick="">${name}</div>`;
        }
    }

}

/*
*clearposts: deletes everything in newsfeed container; does not delete json data
*/
function clearposts() {
    document.getElementById('postscontainer').innerHTML = '';
}

/*
*updatefriends: creates arrays with your friends ids and names for search display
*/
function updatefriends() {
    friends = [];
    friendsnames = [];

    for (let i = 0; i < posts.length; i++) {
        let element = posts[i].id;
        friends.push(element);
        let name = posts[i].author;
        friendsnames.push(name);
    }
}

/*
*updatesuggestions: updates the bar with suggestions for new friendships
*/
function updatesuggestions() {
    document.getElementById('suggestcontainer').innerHTML = ``;

    for (let i = 0; i < friendsuggestions.length; i++) {
        let element = friendsuggestions[i];
        document.getElementById('suggestcontainer').innerHTML += `
        <div class="profile-row" id="friendsuggest${element['id']}"><img src="img/${element['authorimage']}" alt="">
            <div class="flexgrow1">
                <p> <b>${element['author']}</b></p>
                <p></p>
            </div>
            <div class="text-blue pointer" id="suggestedfriend${element['id']}" onclick="addfriend(${element['id']})">Abonnieren</div> </div> `

    }
}

/*
*sortposts: sorts 'posts' array chronologically (publishing date)
*/
function sortposts() {
    posts.sort(function compare(a, b) {
        let dateA = a.published;
        let dateB = b.published;
        return dateB - dateA;
    })

}

/*
*updatecomments: updates the comment sections according to array comments in jsons
*/
function updatecomments() {
    for (a = 0; a < posts.length; a++) {
        selectedpost = posts[a];

        if (selectedpost.comments && selectedpost.comments.length > 0) {

            let postposition = selectedpost.id;
            var specifyid = addposts.findIndex(obj => obj.id == postposition);

            commentposition = 'comments' + specifyid;
            document.getElementById(commentposition).innerHTML = '<div>Kommentare:</div>';
            console.log('addposts position  ' + specifyid);

            buildhtmlcomments()
        }
        //else {
        //    continue;
        //}
    }
}

/*
*buildhtmlcomments : writes comments into HTML according to updatecomments()
*/
function buildhtmlcomments() {

    for (let i = 0; i < selectedpost.comments.length; i++) {
        commentid = selectedpost.comments[i];
        document.getElementById(commentposition).innerHTML += `
    <div class="singlecomment" >
        <div class="commentauthor"> <b>Dein Alias</b></div>
        <div>${commentid} </div>
    </div>`;
    }
}

/*
*buildpostshtml: writes posts into HTML according to loadposts(); important: functions reference addposts id ${element['id']} instead of posts id ${i}
*/
function buildpostshtml() {
    for (let i = 0; i < posts.length; i++) {
        let element = posts[i];

        document.getElementById('postscontainer').innerHTML += `

        <div class="post" id="post${element['id']}">
                <div class="post-header">
                    <img id="authorimage${element['id']}" src="img/${element['authorimage']}" alt="">
                        <div class="flexgrow1">
                            <div id="author${element['id']}"> <b> ${element['author']}</b></div>
                            <div id="geotag${element['id']}" class="text-small">${element['location']}</div>
                        </div>
                        <div class="post-ellipsis"><img src="img/icons/ellipsis.png" alt=""></div>
                        </div>

                        <div class="postimage" id="postimage${element['id']}"><img src="img/${element['image']}" alt=""></div>
                            <div class="post-bar">
                                <div id="like${element['id']}"><img src="img/icons/favorite-4-64.png" alt="" onclick="togglelike(${element['id']})"></div>
                                    <img class="marginleft" src="img/icons/comments-64.png" alt="">
                                        <div class="flexgrow1"><img class="marginleft" src="img/icons/paper-plane-64.png" alt=""></div>
                                            <div id="bookmark${element['id']}"><img src="img/icons/bookmark-5-64.png" onclick="togglebookmark(${element['id']})" alt=""></div>
                                            </div>

                                            <div class="post-text" id="posttext"> <b>${element['author']}</b> ${element['description']} </div>
                                            <div class="post-date" id="datepublished${element['id']}">VERÖFFENTLICHT AM ${element['published']}</div>
                                            <div id="comments${element['id']}" class="commentcontainer"></div>
                                            <div class="comment-input" id="commentpost${element['id']}">
                                                <form id="form${element['id']}" action='#'><textarea name="" minlength="2" maxlength="250" id="comment${element['id']}"
                                                    placeholder="Kommentar hinzufügen..."></textarea><button onclick="addcomment(${element['id']})" type="button">Absenden</button>
                                                </form>
                                            </div>
                                        </div> `;

    }
}


/*
* loadposts: create posts and update lists
*/
function loadposts() {

    clearposts();

    updatefriends();

    updatesuggestions();

    sortposts();

    buildpostshtml();


}


/*
*toogle functions: colors buttons in comment section
*/

function togglebookmark(i) { //show red bookmark on click
    id = 'bookmark' + i;
    document.getElementById(id).innerHTML = '';
    const element = posts[i];

    if (element['bookmarked'] == true) {
        document.getElementById(id).innerHTML = `<img src="img/icons/bookmark-5-64.png" onclick="togglebookmark(${i})" id="bookmark${i}" alt=""></img>`
        //bookmarkposition = 0;
        element.bookmarked = false;
    }

    else {
        document.getElementById(id).innerHTML = `<img src="img/icons/bookmark-5-64 (1).png" onclick="togglebookmark(${i})" id="bookmark${i}" alt=""></img>`
        //bookmarkposition = 1;
        element.bookmarked = true;
    }
}

function togglelike(i) { //show red heart on click
    id = 'like' + i;
    document.getElementById(id).innerHTML = '';
    const element = posts[i];

    if (element['liked'] == true) {
        document.getElementById(id).innerHTML = `<img src="img/icons/favorite-4-64.png" onclick="togglelike(${i})" id="like${i}" alt=""></img>`
        element.liked = false;
    }

    else {
        document.getElementById(id).innerHTML = `<img src="img/icons/favorite-4-64 (1).png" onclick="togglelike(${i})" id="like${i}" alt=""></img>`
        element.liked = true;
    }
}


/*
*addfriend: add selected friend json into posts[] and display friends' posts
*/
function addfriend(i) {
    console.log("Posts before push: ", posts);
    posts.push(addposts[i]);
    console.log("Posts after push: ", posts);

    var position = friendsuggestions.findIndex(obj => obj.id == i);
    authorposition = friendsuggestions[position];
    alert('Du folgst nun ' + authorposition['author'] + ' .');
    friendsuggestions.splice(position, 1);

    loadposts();
    updatecomments();

}

/*
*add comment to post
*/
function addcomment(i) {

    let commentid = 'comment' + i;
    let checkempty = document.getElementById(commentid).value;

    if (checkempty.length > 0) {
        let text = document.getElementById(commentid).value;
        console.log(text + commentid);
        //let place = posts[i].comments;
        // let placeall = addposts[i].comments;
        //placeall.push(text);

        var specifyid = posts.findIndex(obj => obj.id == i);
        let place = posts[specifyid].comments;
        place.push(text);

        updatecomments();

        document.getElementById(commentid).value = '';
    }
}


/*
*submitOnEnter: push enter to add comment to post(not working yet)
*/
function init() {
    document.addEventListener("keydown", function (e) {
        if (e.keyCode == 13) {  
            let completeid = document.activeElement.id;
            let id = completeid.replace( /^\D+/g, '');
            console.log(completeid);
            addcomment(id);
        }
    });
}

//function submitOnEnter(event) {  //from https://stackoverflow.com/questions/8934088/how-to-make-enter-key-in-a-textarea-submit-a-form/49389811

//    formid = 'form' + i;
//    commentid = 'comment' + i;

//    if (event.which === 13) {
//        event.target.form.dispatchEvent(new Event("submit", { cancelable: true }));
//        event.preventDefault(); // Prevents the addition of a new line in the text field (not needed in a lot of cases)
//    }
//}

//document.getElementById(commentid).addEventListener("keypress", submitOnEnter);

//document.getElementById("form").addEventListener("submit", (event) => {
//    event.preventDefault();
//    console.log("Kommentar gespeichert. (Noch nicht wirklich)");
//})


