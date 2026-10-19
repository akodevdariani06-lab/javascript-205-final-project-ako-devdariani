const API = 'https://dummyjson.com';

const PAGE_SIZE = 12;

const SORTS = {
    'name-asc':      { sortBy: 'name',            order: 'asc'  },
    'rating-desc':   { sortBy: 'rating',          order: 'desc' },
    'cookTime-asc':  { sortBy: 'cookTimeMinutes', order: 'asc'  },
};

async function fetchRecipes({ page, query, meal, tag, sortBy, order }) {
    const skip = (page - 1) * PAGE_SIZE;

    let url;
    if (query) {
        url = `${API}/recipes/search?q=${query}&limit=${PAGE_SIZE}&skip=${skip}`;
    } else if (meal) {
        url = `${API}/recipes/meal-type/${meal}?limit=${PAGE_SIZE}&skip=${skip}`;
    } else if (tag) {
        url = `${API}/recipes/tag/${tag}?limit=${PAGE_SIZE}&skip=${skip}`;
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

async function createRecipe(recipe) {
    const response = await fetch(`${API}/recipes/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recipe),
    });

    if (!response.ok) {
        throw new Error('Request failed: ' + response.status);
    }

    const data = await response.json();
    return data;
}

async function fetchTags() {
    const response = await fetch(`${API}/recipes/tags`);

    if (!response.ok) {
        throw new Error('Request failed: ' + response.status);
    }

    return response.json();
}

function renderTags(tags) {
    const select = document.getElementById('tagSelect');

    tags.forEach(function (tag) {
        const option = document.createElement('option');
        option.value = tag;
        option.textContent = tag;
        select.appendChild(option);
    });
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

    const favorites = getFavorites();

    const cards = recipes.map(function (r) {
        const isFav = favorites.includes(r.id);

        return `
        <article class="card" data-id="${r.id}">
            <div class="card__media">
                <img class="card__img" src="${r.image}" alt="${r.name}">
                <button class="card__fav${isFav ? ' is-active' : ''}" data-fav="${r.id}">${isFav ? '❤️' : '🤍'}</button>
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
    const isFav = getFavorites().includes(recipe.id);

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
            <button class="detail__fav${isFav ? ' is-active' : ''}" data-fav="${recipe.id}"><span class="fav-icon">${isFav ? '❤️' : '🤍'}</span> Favourite</button>
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
    document.getElementById('emptyTitle').textContent = 'No recipes found';
    document.getElementById('emptyText').textContent = 'Try a different search or filter.';
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
    const tag = document.getElementById('tagSelect').value;
    const sort = SORTS[document.getElementById('sortSelect').value] || {};

    return {
        page: page,
        query: query,
        meal: meal,
        tag: tag,
        sortBy: sort.sortBy,
        order: sort.order,
    };
}

function renderFavoriteState() {
    const favorites = getFavorites();

    document.querySelectorAll('[data-fav]').forEach(function (btn) {
        const id = Number(btn.dataset.fav);
        const isFav = favorites.includes(id);
        btn.classList.toggle('is-active', isFav);
        const icon = btn.querySelector('.fav-icon');
        if (icon) {
            icon.textContent = isFav ? '❤️' : '🤍';
        } else {
            btn.textContent = isFav ? '❤️' : '🤍';
        }
    });

    document.getElementById('favCount').textContent = favorites.length;
}

function toggleFavorite(id) {
    let favorites = getFavorites();

    if (favorites.includes(id)) {
        favorites = favorites.filter(function (f) {
            return f !== id;
        });
    } else {
        favorites.push(id);
    }

    saveFavorites(favorites);
    renderFavoriteState();
}

function setActiveNav(activeId) {
    document.getElementById('homeLink').classList.remove('is-active');
    document.getElementById('favLink').classList.remove('is-active');
    document.getElementById(activeId).classList.add('is-active');
}

function init() {
    document.getElementById('pageTitle').textContent = 'All recipes';
    loadRecipes(currentOptions(1));
    setActiveNav('homeLink');
}

async function showFavorites() {
    const meta = document.getElementById('pageMeta');
    const ids = getFavorites();

    document.getElementById('pageTitle').textContent = 'Favorites';
    document.getElementById('pagination').innerHTML = '';
    setActiveNav('favLink');

    if (ids.length === 0) {
        document.getElementById('recipeGrid').innerHTML = '';
        document.getElementById('emptyTitle').textContent = 'No favorites yet';
        document.getElementById('emptyText').textContent = 'Tap the heart on a recipe to save it here.';
        document.getElementById('emptyState').hidden = false;
        meta.textContent = '';
        return;
    }

    meta.textContent = 'Loading…';

    try {
        const recipes = await Promise.all(ids.map(function (id) {
            return fetchRecipe(id);
        }));

        meta.textContent = 'Showing ' + recipes.length + ' favorites';
        renderRecipes({ recipes: recipes });
    } catch (err) {
        console.error(err);
        meta.textContent = '';
        showError();
    }
}

renderFavoriteState();
fetchTags().then(renderTags).catch(function (err) {
    console.error(err);
});
init();

document.getElementById('favLink').addEventListener('click', function (e) {
    e.preventDefault();
    showFavorites();
});

document.getElementById('homeLink').addEventListener('click', function (e) {
    e.preventDefault();
    init();
});

document.getElementById('addRecipeBtn').addEventListener('click', function () {
    document.getElementById('addModal').hidden = false;
});

document.getElementById('searchInput').addEventListener('input', function () {
    document.getElementById('mealSelect').value = '';
    document.getElementById('tagSelect').value = '';
    loadRecipes(currentOptions(1));
});

document.getElementById('mealSelect').addEventListener('change', function () {
    document.getElementById('searchInput').value = '';
    document.getElementById('tagSelect').value = '';
    loadRecipes(currentOptions(1));
});

document.getElementById('tagSelect').addEventListener('change', function () {
    document.getElementById('searchInput').value = '';
    document.getElementById('mealSelect').value = '';
    loadRecipes(currentOptions(1));
});

document.getElementById('sortSelect').addEventListener('change', function () {
    loadRecipes(currentOptions(1));
});

document.getElementById('addForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const form = e.currentTarget;
    const button = form.querySelector('button[type="submit"]');

    const fields = ['name', 'cuisine', 'difficulty', 'ingredients', 'instructions'];
    let hasError = false;

    fields.forEach(function (field) {
        const input = form.elements[field];
        const error = form.querySelector('[data-error="' + field + '"]');
        const value = input.value.trim();

        error.textContent = '';
        input.classList.remove('is-invalid');

        if (value === '') {
            error.textContent = 'This field is required.';
            input.classList.add('is-invalid');
            hasError = true;
        } else if (field === 'name' && value.length < 3) {
            error.textContent = 'Please enter at least 3 characters.';
            input.classList.add('is-invalid');
            hasError = true;
        } else if (field === 'ingredients' && value.split('\n').filter(function (line) {
            return line.trim() !== '';
        }).length < 2) {
            error.textContent = 'Please enter at least 2 ingredients.';
            input.classList.add('is-invalid');
            hasError = true;
        }
    });

    if (hasError) {
        return;
    }

    button.disabled = true;

    const recipe = {
        name: form.elements.name.value.trim(),
        cuisine: form.elements.cuisine.value.trim(),
        difficulty: form.elements.difficulty.value,
        ingredients: form.elements.ingredients.value.split('\n').filter(function (line) {
            return line.trim() !== '';
        }),
        instructions: form.elements.instructions.value.split('\n').filter(function (line) {
            return line.trim() !== '';
        }),
    };

    try {
        const created = await createRecipe(recipe);

        form.reset();
        document.getElementById('addModal').hidden = true;
        document.getElementById('recipeDetail').innerHTML = `
            <div class="empty">
                <span class="empty__icon">✅</span>
                <h3>Recipe added</h3>
                <p class="muted">Saved as id ${created.id}.</p>
            </div>`;
        document.getElementById('recipeModal').hidden = false;
    } catch (err) {
        console.error(err);
    } finally {
        button.disabled = false;
    }
});

document.getElementById('pagination').addEventListener('click', function (e) {
    if (!e.target.classList.contains('page-btn')) {
        return;
    }

    const page = Number(e.target.dataset.page);
    loadRecipes(currentOptions(page));
});

document.getElementById('recipeGrid').addEventListener('click', function (e) {
    const favBtn = e.target.closest('.card__fav');
    if (favBtn) {
        toggleFavorite(Number(favBtn.dataset.fav));
        return;
    }

    const card = e.target.closest('.card');
    if (!card) {
        return;
    }
    openRecipe(card.dataset.id);
});

document.getElementById('recipeModal').addEventListener('click', function (e) {
    const favBtn = e.target.closest('.detail__fav');
    if (!favBtn) {
        return;
    }
    toggleFavorite(Number(favBtn.dataset.fav));
});

document.getElementById('recipeModal').addEventListener('click', function (e) {
    if (!e.target.hasAttribute('data-close')) {
        return;
    }
    document.getElementById('recipeModal').hidden = true;
});

document.getElementById('addModal').addEventListener('click', function (e) {
    if (!e.target.hasAttribute('data-close')) {
        return;
    }
    document.getElementById('addModal').hidden = true;
});