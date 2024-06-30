document.addEventListener('DOMContentLoaded', function () {
    const submitBtn = document.getElementById('submitBtn');
    const ingredientSelect = document.getElementById('ingredient');
    const cuisineSelect = document.getElementById('cuisine');
    const prepTimeInput = document.getElementById('prepTime');
    const dietSelect = document.getElementById('diet');
    const recipeCards = document.getElementById('recipeCards');
    const favoriteRecipeCards = document.getElementById('favoriteRecipeCards');

    // Clear local storage on page load
    localStorage.removeItem('favoriteRecipes');

    submitBtn.addEventListener('click', function (e) {
        e.preventDefault();
        const selectedIngredients = Array.from(ingredientSelect.selectedOptions).map(option => option.value);
        const selectedCuisine = cuisineSelect.value;
        const selectedPrepTime = prepTimeInput.value;
        const selectedDiet = dietSelect.value;
        displayRecipes(selectedIngredients, selectedCuisine, selectedPrepTime, selectedDiet);
    });

    // Function to display recipes based on selected criteria
    function displayRecipes(selectedIngredients, selectedCuisine, selectedPrepTime, selectedDiet) {
        recipeCards.innerHTML = ''; // Clear previous cards

        // Filter recipes that match the selected criteria
        const matchingRecipes = Object.keys(recipes).filter(recipeKey => {
            const recipe = recipes[recipeKey];
            const matchesIngredients = selectedIngredients.every(ingredient => recipe.ingredients.includes(ingredient));
            const matchesCuisine = selectedCuisine ? recipe.cuisine === selectedCuisine : true;
            const matchesPrepTime = selectedPrepTime ? recipe.prepTime <= selectedPrepTime : true;
            const matchesDiet = selectedDiet ? recipe.diet === selectedDiet : true;
            return matchesIngredients && matchesCuisine && matchesPrepTime && matchesDiet;
        });

        // Display matching recipes as cards
        matchingRecipes.forEach(recipeKey => {
            const recipe = recipes[recipeKey];
            const cardDiv = document.createElement('div');
            cardDiv.className = 'col-md-4 mb-4';

            const cardHtml = `
                <div class="card">
                    <img src="${recipe.image}" class="card-img-top recipe-image" alt="${recipe.title}">
                    <div class="card-body">
                        <h5 class="card-title">${recipe.title}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">Ingredients:</h6>
                        <ul class="card-text">
                            ${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                        </ul>
                        <p class="card-text"><strong>Cooking Procedure:</strong><br>${recipe.procedure}</p>
                        <button class="btn btn-success save-btn" data-recipe="${recipeKey}">Save to Favorites</button>
                    </div>
                </div>
            `;
            cardDiv.innerHTML = cardHtml;
            recipeCards.appendChild(cardDiv);
        });

        // Display message if no recipes are found
        if (matchingRecipes.length === 0) {
            recipeCards.innerHTML = '<p class="col">No matching recipes found. Please adjust your filters.</p>';
        }

        // Add event listeners to the save buttons
        document.querySelectorAll('.save-btn').forEach(button => {
            button.addEventListener('click', function() {
                const recipeKey = this.getAttribute('data-recipe');
                saveFavoriteRecipe(recipeKey);
            });
        });
    }

    // Function to save favorite recipe
    function saveFavoriteRecipe(recipeKey) {
        let favorites = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];
        if (!favorites.includes(recipeKey)) {
            favorites.push(recipeKey);
            localStorage.setItem('favoriteRecipes', JSON.stringify(favorites));
            displayFavoriteRecipes();
        } else {
            alert('Recipe is already in favorites');
        }
    }

    // Function to display favorite recipes
    function displayFavoriteRecipes() {
        const favorites = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];
        favoriteRecipeCards.innerHTML = ''; // Clear previous cards

        if (favorites.length === 0) {
            favoriteRecipeCards.innerHTML = '<p class="col">No favorite recipes found. Add some recipes to your favorites!</p>';
        } else {
            favorites.forEach(recipeKey => {
                const recipe = recipes[recipeKey];
                if (recipe) { // Check if the recipe exists
                    const cardDiv = document.createElement('div');
                    cardDiv.className = 'col-md-4 mb-4';

                    const cardHtml = `
                        <div class="card">
                            <img src="${recipe.image}" class="card-img-top recipe-image" alt="${recipe.title}">
                            <div class="card-body">
                                <h5 class="card-title">${recipe.title}</h5>
                                <h6 class="card-subtitle mb-2 text-muted">Ingredients:</h6>
                                <ul class="card-text">
                                    ${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                                </ul>
                                <p class="card-text"><strong>Cooking Procedure:</strong><br>${recipe.procedure}</p>
                            </div>
                        </div>
                    `;
                    cardDiv.innerHTML = cardHtml;
                    favoriteRecipeCards.appendChild(cardDiv);
                }
            });
        }
    }

    // Initially clear favorite recipes display
    favoriteRecipeCards.innerHTML = '<p class="col">No favorite recipes found. Add some recipes to your favorites!</p>';
});

// Sample recipes data
var recipes = {
    SalsaChicken: {
        title: 'Salsa Chicken',
        image: 'https://www.onceuponachef.com/images/2012/01/buttermilk-chicken-tenders.jpg',
        ingredients: ['Chicken', 'Onion', 'Garlic', 'Salt', 'Pepper', 'Cream'],
        procedure: '1. Saute onions and garlic. 2. Add tomatoes, salt, and pepper. 3. Simmer, then blend. 4. Add cream and serve.',
        cuisine: 'Mexican',
        prepTime: 30,
        diet: 'Non-Vegetarian'
    },
    CocunutChickenSalad: {
        title: 'Cocunut Chicken Salad',
        image: 'https://www.gimmesomeoven.com/wp-content/uploads/2022/06/Crispy-Coconut-Chicken-Salad-Recipe-5.jpg',
        ingredients: ['Chicken', 'Mozzarella', 'Basil', 'Olive oil', 'Salt', 'Pepper',"Spices And Herbs"],
        procedure: '1. Slice tomatoes and mozzarella. 2. Arrange with basil leaves. 3. Drizzle with olive oil, salt, and pepper. 4. Serve chilled.',
        cuisine: 'Indian',
        prepTime: 15,
        diet: 'Non-Vegetarian'
    },
    CrunchyChickenNuggets: {
        title: 'Crunchy Chicken Nuggets',
        image: 'https://yummyatasteofneworleans.com/wp-content/uploads/2020/10/chicken-nuggets-blog.jpg',
        ingredients: ['Chicken', 'Barbeque sauce', 'Cereal Flakes'],
        procedure:"Preheat oven to 375 degrees 2.Mix chicken and barbeque sauce in a large bowl.3.Pour cereal flakes into a large plastic bag and crush into small pieces.4.Place chicken pieces in the bag, reseal, and toss to coat.5.Lightly coat a baking sheet with cooking spray. Arrange coated chicken pieces on the baking sheet.6.Bake until crispy and golden brown and chicken is no longer pink inside, about 20 to 25 minutes.7.Refrigerate leftovers within 2 hours.",
        cuisine: 'Chinese',
        prepTime: 30,
        diet: 'Non-Vegetarian'
    },
    WhiteChickenChilly: {
        title: 'WhiteChickenChilly',
        image: 'https://sweetandsavorymeals.com/wp-content/uploads/2019/03/White-Chicken-Chili-Recipe-4.jpg',
        ingredients: ["olive oil, onion, garlic, jalapeño, ground cumin, dried oregano, chili powder, Salt and pepper to taste,Chicken, chicken broth, white beans (such as cannellini or great northern beans, drained and rinsed), diced green chilies, frozen corn kernels, heavy cream, lime juice, Fresh cilantro, Sour cream, shredded cheese, avocado"],
        cuisine: 'Mexican',
        prepTime:60,
        diet: 'Non-Vegetarian',
        procedure: 'Sauté onion, garlic, jalapeño with cumin, oregano, chili powder; add chicken, broth, white beans, green chilies, corn; simmer, stir in cream, lime juice; serve with cilantro and optional toppings.'
    },
    
    tomatoSalad: {
        title: 'Tomato Salad',
        image: 'https://th.bing.com/th/id/R.fc089ee18250818aecc1b2c1f3ef5075?rik=cz6gcPeDcvEocQ&pid=ImgRaw&r=0',
        ingredients: ['Vegetables', 'Cucumber', 'Red onion', 'Olive oil', 'Lemon juice', 'Salt', 'Pepper'],
        procedure: '1. Slice tomatoes, cucumber, and red onion. 2. Toss with olive oil, lemon juice, salt, and pepper. 3. Serve chilled.',
        cuisine: 'Chinese',
        prepTime: 15,
        diet: 'Vegetarian'
    },
    onion: {
        title: 'Onion Rings',
        image: 'https://th.bing.com/th?id=OIF.D26qyEw62X3M%2fneVDW0PIA&rs=1&pid=ImgDetMain',
        ingredients: ['Vegetables','Onions', 'Flour', 'Eggs', 'Breadcrumbs', 'Oil', 'Salt', 'Pepper',"Spices And Herbs"],
        procedure: '1. Slice onions into rings. 2. Coat in flour. 3. Dip in egg mixture and breadcrumbs. 4. Fry until golden brown.',
        cuisine: 'Chinese',
        prepTime:45,
        diet: 'Gluten-Free'
    },
    garlicBread: {
        title: 'Garlic Bread',
        image: 'https://bing.com/th?id=OSK.777c741c559c6e44d6411481688b24e0',
        ingredients: [ 'Garlic', 'Butter', 'Parsley', 'Salt',"Vegetables"],
        procedure: '1. Mix butter, minced garlic, parsley, and salt. 2. Spread on bread slices. 3. Bake until golden and crispy.',
        cuisine: 'Mexican',
        prepTime: 30,
        diet: 'Vegetarian'
    },
    BananaCurd: {
        title: 'Banana Curd',
        image: 'http://iambaker.net/wp-content/uploads/2015/06/bananacurd1.jpg',
        ingredients: ["Banana","salt","curd","Milk","Fruits","sugar","lemon","egg york"],
        procedure: "Melt butter in a saucepan over medium-low heat. Add banana puree, brown sugar, lemon juice, vanilla extract, cinnamon, lemon zest, and salt. Cook, stirring constantly, until slightly thickened, 8 to 10 minutes.Beat eggs and egg yolk in a bowl until foamy. Add 2 to 3 tablespoons hot banana mixture to temper the eggs. Slowly add egg-banana mixture to saucepan and cook, stirring constantly, until the back of a spoon is coated with the curd, 4 to 7 minutes.",
        cuisine: 'Chinese',
        prepTime: 30,
        diet: 'Gluten-Free'
    },
    RasperryCurd: {
        title: 'Rasberry Curd',
        image: 'https://bakesbybrownsugar.com/wp-content/uploads/2020/08/Raspberry-Curd-1-2-1-768x1024.jpg',
        ingredients: ["Fruits","Rasberry","salt","curd","Milk","sugar","lemon","egg york"],
        procedure: "'1. In a blender or food processor, blend rasberry until smooth. 2. In a saucepan, combine rasberry puree, sugar, lemon juice, egg yolks, and salt. Whisk until well combined. 3. Cook over medium heat, stirring constantly, until mixture thickens and coats the back of a spoon (about 8-10 minutes). 4. Remove from heat and stir in butter until melted and incorporated. 5. Strain mixture through a fine-mesh sieve into a bowl to remove any solids. 6. Cover with plastic wrap, pressing it directly onto the surface of the curd to prevent a skin from forming. 7. Chill in the refrigerator for at least 2 hours or until completely chilled.",
        cuisine: 'Indian',
        prepTime: 15,
        diet: 'Gluten-Free'
    },
    LemonCurd: {
        title: 'Lemon Curd',
        image: 'https://platedcravings.com/wp-content/uploads/2017/04/Easy-Lemon-Curd-Recipe-Plated-Cravings-1.jpg',
        ingredients: ["fresh lemon juice","white sugar","curd","Milk","cream","egg york"],
        procedure: "Combine all the ingredients in a saucepan, then cook over medium heat until the mixture thickens and bubbles.",
        cuisine: 'Mexican',
        prepTime: 45,
        diet: 'Vegetarian'
    },
    FishTaco: {
        title: 'Fish Taco',
        image: 'https://showmetheyummy.com/wp-content/uploads/2017/04/Baked-Fish-Tacos-Show-Me-the-Yummy-5@2x.jpg',
        ingredients: ["Fish","all-purpose flour","cornstarch","baking powder","Eggs","cabbage","corn tortillas","ground cumin","dried dill weed"],
        procedure: "Make beer batter,Make white sauce,Start fish tacos: Heat oil in a deep-fryer to 375 degrees F,Dust fish pieces lightly with flour. Set aside,Dip floured fish pieces into beer batter.Fry in hot oil until crisp and golden brown.Place fried fish in tortillas; top with shredded cabbage and white sauce. ",
        cuisine: 'Mexican',
        prepTime:60,
        diet: 'Non-Vegetarian'
    },
    FishCurrry: {
        title: 'South India Style Fish Curry',
        image: 'https://www.archanaskitchen.com/images/archanaskitchen/1-Author/poojanadkarni/South_indian_style_fish_curry_recipe.jpg',
        ingredients: ["Fish","chopped tomato","ground turmeric","ground coriander","vegetable broth","cashew halves",],
        procedure:"Mix 2 tablespoons oil, mustard, black pepper, and 1/2 teaspoon salt together in a shallow glass bowl.Add fish and turn to coat.Preheat the oven to 350 degrees,Heat remaining 1 tablespoon oil in a skillet over medium-low heat,Add cayenne pepper, remaining 1 teaspoon salt, cumin, coriander, sugar, and turmeric to the cashew paste in the skillet; cook and stir for 5 minutes. Stir in tomato and broth.Bake, covered, in the preheated oven until fish flakes easily with a fork, about 30 minutes. Garnish with cilantro.Bake, covered, in the preheated oven until fish flakes easily with a fork, about 30 minutes. Garnish with cilantro.",
        cuisine: 'Indian',
        prepTime: 30,
        diet: 'Non-Vegetarian'
    },
    Panties: {
        title: 'Vegetable Pantties',
        image: 'https://recipes4day.com/wp-content/uploads/2019/02/Best-Vegetable-Patties-1024x538.jpg',
        ingredients: ["Eggs","Vegetables","cottage cheese","dried thyme","vegetable broth","vegetable oil","mushroom","Spices And Herbs"],
        procedure:"Preheat oven to 350 degrees F.Preheat oven to 350 degrees F,Heat oil in a skillet over medium heat.Pour condensed soup into a small bowl. Stir in 1/2 can of water.Bake in a preheated oven until soup is bubbly, about 20 minutes.",
        cuisine: 'Chinese',
        prepTime:60,
        diet: 'Gluten-Free'
    },
    Fried_Rice: {
        title: 'Easy Fried Rice',
        image: 'https://food.fnr.sndimg.com/content/dam/images/food/fullset/2015/4/16/1/CCTIA106_Orange-Flavored-Rice-recipe_s4x3.jpg.rend.hgtvcom.826.620.suffix/1432658985717.jpeg',
        ingredients: ["Vegetables","rice","green peas","vegetable broth",],
        procedure:"Combine 4 cups of water and 2 cups of white rice in a saucepan; bring to a boil.Reduce the heat, then cover and simmer until the rice is tender and the water has been absorbed, 20 to 25 minutes.Remove from the heat and let cool to room temperature.",
        cuisine: 'Chinese',
        prepTime: 30,
        diet: 'Vegetarian'
    },
    Fruitsalad: {
        title: 'Sunday Best Fruit Salad',
        image: 'https://thespicyapron.com/wp-content/uploads/2016/01/Green-Salad-Overhead-Pic.jpg',
        ingredients: ["Fruits","Spices And Herbs"],
        procedure:"In a small bowl, toss the chopped apples in reserved pineapple juice. Allow to sit for 5 to 10 minutes.In a large salad bowl, combine the peach pie filling and pineapple chunks.Peel and slice kiwi and 1/2 of strawberries. Chop the other 1/2 of strawberries and set aside.Arrange kiwi slices around the edge of the serving bowl and alternate with strawberry slices. Chill and serve.",
        cuisine: 'Indian',
        prepTime:15,
        diet: 'Vegetarian'
    }
}
