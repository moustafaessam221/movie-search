// fetch movies

const apikey = 66785117;
let movies = [
  "Troy",
  "Aliens",
  "Marvel",
  "Lord of the rings",
  "Mad max",
  "Spider man",
  "Jaws",
  "Indiana Jones",
  "Jumanji",
  "The Matrix",
  "Shrek",
  "Frozen",
  "Coco",
  "Harry Potter",
  "Toy Story",
  "The Godfather",
  "Inception",
  "The Lion King",
  "Star Wars",
];
let randomMovie = movies[Math.floor(Math.random() * movies.length)];

fetch(`https://www.omdbapi.com/?s=${randomMovie}&apikey=${apikey}`)
  .then((response) => response.json())
  .then((data) => renderAll(data));
function searchAll() {
  const input = document.getElementById("input").value;
  fetch(`https://www.omdbapi.com/?s=${input}&apikey=${apikey}`)
    .then((response) => response.json())
    .then((data) => renderAll(data));
}

function renderAll(data) {
  document.getElementById("results").innerHTML = "";
  document.getElementById("TITLE").innerText = "Search Results";
  for (const movie of data.Search) {
    document.getElementById("results").innerHTML += `
        <div class="card" >
        <img
          src="${movie.Poster}"
          alt=""
          class="poster"
          id="poster"
        />
        <h2 class="title" id="title">${movie.Title}</h2>
        <p class="plot" id="plot">${movie.Type} (${movie.Year})</p>
        <button class="details" id="details" onclick="getDetails('${movie.imdbID}')">Get details</button>
        <button class="favourite" id="favourite" onclick='addToFavourites(${JSON.stringify(movie)})'>Add to Favourites</button>
      </div>
        `;
  }
}

// render details

function getDetails(id) {
  document.getElementById("results").innerHTML = "";
  document.getElementById("TITLE").innerText = "Search Results";

  fetch(`https://www.omdbapi.com/?i=${id}&apikey=${apikey}`)
    .then((response) => response.json())
    .then((data) => renderDetails(data));

  function renderDetails(data) {
    document.getElementById("results").innerHTML += `
          <div class="card">
          <img
            src="${data.Poster}"
            alt=""
            class="poster"
            id="poster"
          />
          <h2 class="title" id="title">${data.Title}</h2>
          <p class="plot" id="plot">${data.Type} (${data.Year})</p>
          <p class="plot">${data.Plot}</p>
        </div>
          `;
  }
}

// add to favourites

function addToFavourites(data) {
  let title = data.Title;
  let type = data.Type;
  let year = data.Year;
  let poster = data.Poster;
  fetch("http://localhost:8000/Favourites", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, type, year, poster }),
  }).then(() => {
    console.log("Added to favourites");
  });
}

function favourite() {
  fetch("http://localhost:8000/Favourites")
    .then((response) => response.json())
    .then((data) => {
      renderFav(data);
    });
}

function renderFav(data) {
  document.getElementById("results").innerHTML = "";
  document.getElementById("TITLE").innerText = "Favourites";
  for (const item of data) {
      document.getElementById("results").innerHTML += `
          <div class="card">
          <img
            src="${item.poster}"
            alt=""
            class="poster"
          />
          <h2 class="title">${item.title}</h2>
          <p class="plot">${item.type} (${item.year})</p>
          <button class="favourite" id="remove" onclick='removeFromFavourites(${JSON.stringify(
            item
          )})'>Remove</button>
        </div>
          `;
  }
}

function removeFromFavourites(data) {
  fetch(`http://localhost:8000/Favourites/${data.id}`, {
    method: "DELETE",
  }).then(() => {
    console.log("Removed from favourites");
  });
}
