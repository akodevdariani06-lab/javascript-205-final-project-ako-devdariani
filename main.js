const API = 'https://dummyjson.com';

const PAGE_SIZE = 12;

const SORTS = {
    'name-asc':      { sortBy: 'name',            order: 'asc'  },
    'rating-desc':   { sortBy: 'rating',          order: 'desc' }, 
    'cookTime-asc':  { sortBy: 'cookTimeMinutes', order: 'asc'  },
};

async function fetchRecipes(page) {
    const skip = (page - 1) * PAGE_SIZE;

    const url = `${API}/recipes?limit=${PAGE_SIZE}&skip=${skip}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Request failed:' + response.status);
    }

    const data = await response.json();
    return data;
}

function renderRecipes(data) {
    const recipes = data.recipes;

    if (recipes.length === 0) {
        document.getElementById('recipeGrid').innerHTML = '';
        document.getElementById('emptyState').hidden = false;
        return;
    }

    document.getElementById('emptyState').hidden = true;

    const cards = recipes.map(function (r) {
        return `
        <article class="card" data-id="${r.id}">
            <div class="card__media">
                <img class="card__img" src="${r.image}" alt="${r.name}">
            </div>
            <div class="card__body">
                <h3 class="card__name">${r.name}</h3>
                <div class="card__row"><span>${r.cuisine}</span><span>${r.difficulty}</span></div>
                <div class="card__row"><span class="card__rating">⭐ ${r.rating}</span><span>${r.prepTimeMinutes + r.cookTimeMinutes} min</span></div>
            </div>
        </article>`;
    }).join('');

    document.getElementById('recipeGrid').innerHTML = cards;   // ვსვამთ გვერდზე
}


function showError() {
    document.getElementById('recipeGrid').innerHTML = `
        <div class="empty" style="grid-column: 1 / -1">
            <span class="empty__icon">😕</span>
            <h3>Something went wrong</h3>
            <p class="muted">Could not load recipes. Please check your connection.</p>
            <button class="btn btn--primary" onclick="init()">Try again</button>
        </div>`;
}

async function init() {
    const meta = document.getElementById('pageMeta');
    meta.textContent = 'Loading…';

    try {
        const data = await fetchRecipes(1);
        meta.textContent = `Showing ${data.recipes.length} of ${data.total} recipes`;
        renderRecipes(data);
    } catch (err) {
        console.error(err);
        meta.textContent = '';
        showError();
    }
}

init();