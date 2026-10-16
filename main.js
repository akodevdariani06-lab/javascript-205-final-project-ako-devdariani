const API = 'https://dummyjson.com';

const PAGE_SIZE = 12;

const SORTS = {
    'name-asc':      { sortBy: 'name',            order: 'asc'  },
    'rating-desc':   { sortBy: 'rating',          order: 'desc' },
    'cookTime-asc':  { sortBy: 'cookTimeMinutes', order: 'asc'  },
};

async function fetchRecipes({ page, query, meal, sortBy, order }) {
    const skip = (page - 1) * PAGE_SIZE;

    let url;
    if (query) {
        url = `${API}/recipes/search?q=${query}&limit=${PAGE_SIZE}&skip=${skip}`;
    } else if (meal) {
        url = `${API}/recipes/meal-type/${meal}?limit=${PAGE_SIZE}&skip=${skip}`;
    } else {
        url = `${API}/recipes?limit=${PAGE_SIZE}&skip=${skip}`;
    }

    if (sortBy && order) {
        url += `&sortBy=${sortBy}&order=${order}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Request failed: ' + response.status);
    }

    const data = await response.json();
    return data;
}

async function fetchRecipe(id) {
    const response = await fetch(`${API}/recipes/${id}`);

    if (!response.ok) {
        throw new Error('Request failed: ' + response.status);
    }

    const data = await response.json();
    return data;
}

async function openRecipe(id) {
    try {
        const recipe = await fetchRecipe(id);
        renderRecipeDetail(recipe);
        document.getElementById('recipeModal').hidden = false;
    } catch (err) {
        console.error(err);
        document.getElementById('recipeDetail').innerHTML = `
            <div class="empty">
                <span class="empty__icon">😕</span>
                <h3>Could not load recipe</h3>
                <p class="muted">This recipe could not be loaded. Please try again.</p>
            </div>`;
        document.getElementById('recipeModal').hidden = false;
    }
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

    document.getElementById('recipeGrid').innerHTML = cards;
}

function renderPagination(total, page) {
    const pages = Math.ceil(total / PAGE_SIZE);
    const nav = document.getElementById('pagination');

    if (pages === 0) {
        nav.innerHTML = '';
        return;
    }

    const prevDisabled = page === 1 ? ' disabled' : '';
    const nextDisabled = page === pages ? ' disabled' : '';

    let html = `<button class="page-btn" data-page="${page - 1}"${prevDisabled}>Prev</button>`;

    for (let i = 1; i <= pages; i++) {
        const active = i === page ? ' is-active' : '';
        html += `<button class="page-btn${active}" data-page="${i}">${i}</button>`;
    }

    html += `<button class="page-btn" data-page="${page + 1}"${nextDisabled}>Next</button>`;
    html += `<span class="muted">Page ${page} of ${pages}</span>`;

    nav.innerHTML = html;
}

function renderRecipeDetail(recipe) {
    const tags = recipe.tags.map(function (t) {
        return `<span class="tag">${t}</span>`;
    }).join('');

    const ingredients = recipe.ingredients.map(function (item) {
        return `<li>${item}</li>`;
    }).join('');

    const instructions = recipe.instructions.map(function (step) {
        return `<li>${step}</li>`;
    }).join('');

    document.getElementById('recipeDetail').innerHTML = `
        <div class="detail">
            <img class="detail__img" src="${recipe.image}" alt="${recipe.name}">
            <h2>${recipe.name}</h2>
            <div class="detail__tags">${tags}</div>
            <div class="detail__meta">
                <span>Servings</span><span>${recipe.servings}</span>
                <span>Calories</span><span>${recipe.caloriesPerServing}</span>
                <span>Prep time</span><span>${recipe.prepTimeMinutes} min</span>
                <span>Cook time</span><span>${recipe.cookTimeMinutes} min</span>
                <span>Total time</span><span>${recipe.prepTimeMinutes + recipe.cookTimeMinutes} min</span>
            </div>
            <h3>Ingredients</h3>
            <ul>${ingredients}</ul>
            <h3>Instructions</h3>
            <ol>${instructions}</ol>
        </div>`;
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

async function loadRecipes(options) {
    const meta = document.getElementById('pageMeta');
    meta.textContent = 'Loading…';

    try {
        const data = await fetchRecipes(options);
        meta.textContent = `Showing ${data.recipes.length} of ${data.total} recipes`;
        renderRecipes(data);
        renderPagination(data.total, options.page);
    } catch (err) {
        console.error(err);
        meta.textContent = '';
        showError();
    }
}

function currentOptions(page) {
    const query = document.getElementById('searchInput').value;
    const meal = document.getElementById('mealSelect').value;
    const sort = SORTS[document.getElementById('sortSelect').value] || {};

    return {
        page: page,
        query: query,
        meal: meal,
        sortBy: sort.sortBy,
        order: sort.order,
    };
}

function init() {
    loadRecipes(currentOptions(1));
}

init();

document.getElementById('searchInput').addEventListener('input', function () {
    document.getElementById('mealSelect').value = '';
    loadRecipes(currentOptions(1));
});

document.getElementById('mealSelect').addEventListener('change', function () {
    document.getElementById('searchInput').value = '';
    loadRecipes(currentOptions(1));
});

document.getElementById('sortSelect').addEventListener('change', function () {
    loadRecipes(currentOptions(1));
});

document.getElementById('pagination').addEventListener('click', function (e) {
    if (!e.target.classList.contains('page-btn')) {
        return;
    }

    const page = Number(e.target.dataset.page);
    loadRecipes(currentOptions(page));
});

document.getElementById('recipeGrid').addEventListener('click', function (e) {
    const card = e.target.closest('.card');
    if (!card) {
        return;
    }
    openRecipe(card.dataset.id);
});

document.getElementById('recipeModal').addEventListener('click', function (e) {
    if (!e.target.hasAttribute('data-close')) {
        return;
    }
    document.getElementById('recipeModal').hidden = true;
});