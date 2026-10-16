function getFavorites() {
    const saved = localStorage.getItem('favorites');
    if (!saved) {
        return [];
    }
    return JSON.parse(saved);
}

function saveFavorites(ids) {
    localStorage.setItem('favorites', JSON.stringify(ids));
}