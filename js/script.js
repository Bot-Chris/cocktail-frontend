document.getElementById('searchBtn').addEventListener('click', fetchCocktails);
document.getElementById('categoryFilter').addEventListener('change', fetchCocktails);
document.getElementById('ingredientFilter').addEventListener('change', fetchCocktails);
document.getElementById('alcoholicFilter').addEventListener('change', fetchCocktails);

async function fetchCocktails() {
    const name = document.getElementById('searchInput').value;
    const category = document.getElementById('categoryFilter').value;
    const ingredient = document.getElementById('ingredientFilter').value;
    const alcoholic = document.getElementById('alcoholicFilter').value;

    // Construct the query URL based on selected filters
    let multFilters = false;
    let queryUrl = `http://localhost:3000/`;
    if(name) 
    {
        queryUrl += `search?name=${name}`;
        multFilters = true;
    }
    if (category && multFilters) queryUrl += `&filter/category?category=${category}`;
    else if (category) 
    {
        queryUrl += `filter/category?category=${category}`;
        multFilters = true;
    }
    
    if (ingredient && multFilters) queryUrl += `&filter/ingredient?ingredients=${ingredient}`;
    else if (ingredient)
    {
        queryUrl += `filter/ingredient?ingredients=${ingredient}`;
        multFilters = true;
    }

    if (alcoholic && multFilters) queryUrl += `&filter/alcoholic?type=${alcoholic}`;
    else if (alcoholic)
    {
        queryUrl += `filter/alcoholic?type=${alcoholic}`;
        multFilters = true;
    }
    console.log('Query URL:', queryUrl);
    const response = await fetch(queryUrl);
    const data = await response.json();
    displayResults(data);
    console.log('Response data:', data);
}

function displayResults(cocktails) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = ''; // Clear previous results

    cocktails.forEach(cocktail => {
        const cocktailElement = document.createElement('div');
        cocktailElement.classList.add('cocktail');
        cocktailElement.innerHTML = `
            <h3>${cocktail.strDrink}</h3>
            <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}" style="width:100%;">
        `;
        resultsContainer.appendChild(cocktailElement);
    });
}

// Fetch and populate categories and ingredients when the page loads
window.onload = function() {
    populateFilters();
};

async function populateFilters() {
    await populateCategories();
    await populateIngredients();
}

async function populateCategories() {
    const categorySelect = document.getElementById('categoryFilter');
    try {
        const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Access the 'drinks' array containing category objects
        if (data.drinks && Array.isArray(data.drinks)) {
            data.drinks.forEach(categoryObj => {
                const option = document.createElement('option');
                option.value = categoryObj.strCategory; // Use the correct property name for category
                option.textContent = categoryObj.strCategory; // Use the correct property name for category
                categorySelect.appendChild(option);
            });
        } else {
            console.error('Categories data is not in the expected format:', data);
        }
    } catch (error) {
        console.error('Failed to fetch categories:', error);
    }
}


async function populateIngredients() {
    const ingredientSelect = document.getElementById('ingredientFilter');
    try {
        const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Assuming 'data.drinks' is the array containing ingredient objects
        if (data.drinks && Array.isArray(data.drinks)) {
            data.drinks.forEach(ingredientObj => {
                const option = document.createElement('option');
                option.value = ingredientObj.strIngredient1; // Adjust based on your API response structure
                option.textContent = ingredientObj.strIngredient1; // Adjust based on your API response structure
                ingredientSelect.appendChild(option);
            });
        } else {
            console.error('Ingredients data is not in the expected format:', data);
        }
    } catch (error) {
        console.error('Failed to fetch ingredients:', error);
    }
}
