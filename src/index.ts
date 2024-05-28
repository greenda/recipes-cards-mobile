import { TodoistApi } from "@doist/todoist-api-typescript";
import { ingredients } from './ingredients.js';
import { units } from './units';
import { recipes } from './recipes.js';
import './index.css';

const RECIPE_TYPE = {
  FIRST_COURSE: 'first-course',
  SECOND_COURSE: 'secound-course',
  GARNISH: 'garnish',
  SALAD: 'salad',
  DESSERT: 'dessert',
  BREAKFAST: 'breakfast',
};
// ---- в библиотеку ---- //

const RECIPE_TYPE_MAP = {
  [RECIPE_TYPE.FIRST_COURSE]: 'Первые блюда',
  [RECIPE_TYPE.SECOND_COURSE]: 'Вторые блюда',
  [RECIPE_TYPE.GARNISH]: 'Гарниры',
  [RECIPE_TYPE.SALAD]: 'Салаты',
  [RECIPE_TYPE.DESSERT]: 'Десерты',
  [RECIPE_TYPE.BREAKFAST]: 'Завтраки',
};

function toTodoist() {
  const api = new TodoistApi("b6d07921bc749d4f50040963cd1bc13a51fd33e2")

  api.getProjects()
      .then((projects) => console.log(projects))
      .catch((error) => console.log(error))
}

function init() {
  console.log('%c%s', 'background: cadetblue; padding: 8px;', 'init');
  // const button = document.createElement('button');
  // button.onclick = toTodoist;
  // button.textContent = 'Script';

  // document.querySelector('body').appendChild(button);

  const pageContainer = document.querySelector('.page');

  // TODO убрать дублирование ingredientds/INGREDIENDS
  const INGREDIENTS = ingredients;
  const UNITS = units;
  const RECIPES = recipes;

  function clearScreen() {
    pageContainer.textContent = '';
  }

  function renderMenu() {
    clearScreen();

    const pageTitle = document.createElement('span');
    pageContainer.appendChild(pageTitle);

    pageTitle.textContent = 'Рецепты';
    pageTitle.className = 'page__title'

    const sectionContainer = document.createElement('div');
    sectionContainer.className = 'section-container';

    [
      {
        type: RECIPE_TYPE.FIRST_COURSE,
        color: 'caramel_dark',
      },
      {
        type: RECIPE_TYPE.SECOND_COURSE,
        color: 'caramel_light',
      },
      {
        type: RECIPE_TYPE.BREAKFAST,
        color: 'sand_light',
      },
      {
        type: RECIPE_TYPE.GARNISH,
        color: 'sand_dark',
      },
      {
        type: RECIPE_TYPE.SALAD,
        color: 'caramel_dark',
      },
      {
        type: RECIPE_TYPE.DESSERT,
        color: 'caramel_light',
      },
    ].forEach(({ type, color, href}) => {
      const sectionButton = document.createElement('button');

      sectionButton.textContent = RECIPE_TYPE_MAP[type];
      sectionButton.className = `type-container type-container_${color}`;
      sectionButton.type = type;
      sectionButton.onclick = renderSection;

      sectionContainer.appendChild(sectionButton);
    });

    pageContainer.appendChild(sectionContainer);
  }

  function renderRecipeIngredientsList(event) {
    clearScreen();

    const recipeId = event.currentTarget.attributes.id.nodeValue;

    const recipe = RECIPES.find(recipe => recipe.id === +recipeId);
    const ingredientds = recipe.ingredients || [];

    if (!ingredientds.length) throw new Error('Рецепт не найден');

    const section = document.createElement('div');
    section.className = 'section recipe';

    const titleContainer = document.createElement('div');
    // TODO разобраться со вложенностью элементов
    titleContainer.className = 'recipe__title';
    titleContainer.innerText = recipe.title;

    ingredientds.forEach(ingredient => {
      const ingredientElement = document.createElement('span');
      ingredientElement.className = 'recipe__ingredient';
      ingredientElement.innerText = INGREDIENTS.find(value => value.id === ingredient.id).name;

      const amountElement = document.createElement('span');
      amountElement.className = 'recipe__amount';
      amountElement.innerText = ingredient.amountOf;

      const unitElement = document.createElement('span');
      unitElement.className = 'recipe__unit';
      unitElement.innerText = UNITS.find(value => value.id === ingredient.unitId).name;

      const rowElement = document.createElement('div');
      rowElement.className = 'recipe__row';
      rowElement.appendChild(amountElement);
      rowElement.appendChild(unitElement);
      rowElement.appendChild(ingredientElement);

      section.appendChild(rowElement);
    })

    pageContainer.appendChild(titleContainer);
    pageContainer.appendChild(section);
  }

  function renderSection(event) {
    clearScreen();

    const recipeType = event.currentTarget.attributes.type.nodeValue;

    const recipes = RECIPES.filter(({ type }) => type === recipeType );

    const recipeList = document.createElement('div');
    recipeList.className = 'section';
    pageContainer.appendChild(recipeList);

    const section = document.createElement('div');
    section.className = `recipe-list`;

    const pageTitle = document.createElement('span');
    recipeList.appendChild(pageTitle);

    pageTitle.textContent = RECIPE_TYPE_MAP[recipeType];
    pageTitle.className = 'section__title';

    const sectionList = document.createElement('ul');
    section.appendChild(sectionList);

    recipes.forEach((recipe) => {
      const recipeName = document.createElement('li');
      recipeName.className = 'section__text';

      const recipeLink = document.createElement('a');
      recipeLink.innerText = recipe.title;
      recipeLink.id = recipe.id;
      recipeLink.onclick = renderRecipeIngredientsList;

      recipeName.appendChild(recipeLink);

      sectionList.appendChild(recipeName);
    });

    recipeList.appendChild(section);

    const backButton = document.createElement('button');
    backButton.innerText = 'Назад';
    backButton.onclick = renderMenu;
    backButton.className = 'type-container type-container_sand_dark';

    recipeList.appendChild(backButton);
  }

  renderMenu();
}

init();

  // const recipe = _recipes__WEBPACK_IMPORTED_MODULE_3__.RECIPES.find(({    id  }) => id === cardsNumber);
  // const tasks = recipe.ingredients.reduce((acc, ingredient) => {
  //   const {
  //     id,
  //     ingredientId,
  //     amountOf,
  //     unitId,
  //     index } = ingredient; const unit = _units__WEBPACK_IMPORTED_MODULE_2__.UNITS.find(({ id }) => id === unitId); const unitName = index ? unit.name[index - 1] : unit.name; const ingredientEntity = _ingredients__WEBPACK_IMPORTED_MODULE_4__.INGREDIENTS.find(({ id }) => id === ingredientId); const { inReserve, check } = ingredientEntity; if (inReserve && !check) return acc; const checkPostfix = inReserve === false || inReserve === true && check === true ? ' (проверить)' : ''; const postfix = unitName && unitName !== 'по вкусу' ? ` — ${amountOf || ''} ${unitName}${checkPostfix}` : ''; return [...acc, { content: `${ingredientEntity.name}${postfix}`, projectId: '2290188609' }];
  // }, []);

  // console.log('%c%s', 'background: cadetblue; padding: 8px;', JSON.stringify(tasks));

  // tasks.forEach(task => {
  //   api.addTask(task).then(({ id }) => console.log('%c%s', 'background: cadetblue; padding: 8px;', id)).catch(error => console.log(error));
  // });

  // api.getProjects().then(projects => console.log(projects)).catch(error => console.log(error));
