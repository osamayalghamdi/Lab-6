const initialLikes = 2400;
const initialDislikes = 120;

let likesCount = initialLikes;
let dislikesCount = initialDislikes;
let comments = [];

const likesBtn = document.getElementById("likeBtn");
const dislikesBtn = document.getElementById("dislikeBtn");
const commentBox = document.getElementById("commentBox");
const submitBtn = document.getElementById("submit");
const clearBtn = document.getElementById("clear");
const commentsList = document.getElementById("commentsList");

function updateButtons() {
    likesBtn.innerText = "👍 " + likesCount;
    dislikesBtn.innerText = "👎 " + dislikesCount;
}

function rebuildComments() {
    commentsList.innerHTML = "";
    comments.forEach(comment => {
        const commentElement = document.createElement("p");
        commentElement.innerText = comment;
        commentsList.appendChild(commentElement);
    });
}

function saveState() {
    setCookie("likesCount", likesCount, 7);
    setCookie("dislikesCount", dislikesCount, 7);
    setCookie("comments", JSON.stringify(comments), 7);
}

function loadState() {
    const storedLikes = getCookie("likesCount");
    const storedDislikes = getCookie("dislikesCount");
    const storedComments = getCookie("comments");

    if (storedLikes) {
        likesCount = parseInt(storedLikes, 10);
    }
    if (storedDislikes) {
        dislikesCount = parseInt(storedDislikes, 10);
    }
    if (storedComments) {
        comments = JSON.parse(storedComments);
        rebuildComments();
    }
    updateButtons();

    if (getCookie("voted") === "true") {
        likesBtn.disabled = true;
        dislikesBtn.disabled = true;
    }
    if (getCookie("commented") === "true") {
        submitBtn.disabled = true;
        commentBox.disabled = true;
    }
}

likesBtn.addEventListener("click", () => {
    if (getCookie("voted") === "true") return;
    likesCount++;
    updateButtons();
    setCookie("voted", "true", 7);
    saveState();
    likesBtn.disabled = true;
    dislikesBtn.disabled = true;
});

dislikesBtn.addEventListener("click", () => {
    if (getCookie("voted") === "true") return;
    dislikesCount++;
    updateButtons();
    setCookie("voted", "true", 7);
    saveState();
    likesBtn.disabled = true;
    dislikesBtn.disabled = true;
});

submitBtn.addEventListener("click", () => {
    if (getCookie("commented") === "true") return;
    const commentText = commentBox.value.trim();
    if (commentText !== "") {
        comments.push(commentText);
        rebuildComments();
        commentBox.value = "";
        setCookie("commented", "true", 7);
        saveState();
        submitBtn.disabled = true;
        commentBox.disabled = true;
    }
});

clearBtn.addEventListener("click", () => {
    likesCount = initialLikes;
    dislikesCount = initialDislikes;
    comments = [];

    deleteCookie("voted");
    deleteCookie("commented");
    deleteCookie("likesCount");
    deleteCookie("dislikesCount");
    deleteCookie("comments");

    updateButtons();
    rebuildComments();
    commentBox.value = "";

    likesBtn.disabled = false;
    dislikesBtn.disabled = false;
    submitBtn.disabled = false;
    commentBox.disabled = false;
});

function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
}

function getCookie(name) {
    return document.cookie.split('; ').reduce((r, v) => {
        const parts = v.split('=');
        return parts[0] === name ? decodeURIComponent(parts[1]) : r;
    }, '');
}

function deleteCookie(name) {
    setCookie(name, '', -1);
}

document.addEventListener("DOMContentLoaded", loadState);
