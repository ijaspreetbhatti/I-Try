var client_id = '5d4bf20fa2664ba6a276cfd7df266419'; // Your client id
var client_secret = 'aca90df642d84f239d088a1fcc7fdc88'; // Your secret
var redirect_uri = 'http://127.0.0.1:5500/index.html'; // Your redirect uri

const searchURL = 'https://api.spotify.com/v1/search';
const authURL = 'https://accounts.spotify.com/authorize';
let params;

function getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while (e = r.exec(q)) {
        console.log(e);
        hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
}

(() => {
    if (window.location.hash.substr(1) != '') {
        params = getHashParams();
        console.log(params);
        loginButton.remove();
    } else {
        loginButton.addEventListener('click', authorizeSpotify);
    }
})();


function authorizeSpotify() {
    let queryString = `?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=user-read-private%20user-read-email&response_type=token`;
    window.location = authURL + queryString;
}

searchSp.addEventListener('click', searchSpotify);

function searchSpotify() {
    artists.innerHTML = '';
    console.log(params);
    if(params) {
        let queryString = `?q=${encodeURIComponent(searchTerm.value)}&type=artist&limit=50`;
        searchSpotifyReq(params.access_token, queryString)
        .then(data => {
            console.log(data);
            for (const artist of data.artists.items) {
                if(artist.images.length>0) {
                    artists.innerHTML += `
                    <div class="artistDetails">
                    ${
                        artist.images.length>0
                        ?
                        `<img class="artistImg" src="${artist.images[0].url}" height="${artist.images[0].height}" width="${artist.images[0].width}"></img>`
                        :
                        ''
                    }
                    <span class="artistName">${artist.name}</span>
                    <span class="followerCount">${artist.followers.total}</span>
                    <span class="genres">${artist.genres}</span>
                    </div>
                    `;
                }
            }
        });
    } else {
        alert('Login First!');
    }
}

async function searchSpotifyReq(accessToken, queryString) {
    const response = await fetch(searchURL + queryString, {
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    });
    return response.json();
}

