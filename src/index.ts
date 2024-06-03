import { TodoistApi } from "@doist/todoist-api-typescript";
import { ingredients } from './ingredients.js';
import { units } from './units';
import { recipes } from './recipes.js';

import './app/components/schedule/index.ts';

import { initTemplates } from './app/utils';

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

let selectedIngredients = [];
let selectedRecipeType;

async function toTodoist() {
  const api = new TodoistApi("b6d07921bc749d4f50040963cd1bc13a51fd33e2")

  // await api.getProjects()
  //     .then((projects) => console.log(projects))
  //     .catch((error) => console.log(error))

  // TODO в константу
  const result = await Promise.all(selectedIngredients.map(ingredient => {
    return api.addTask({ content: ingredient, projectId: "2290188609" })
      .then(
        (task) => console.log(task)
      )
      .catch(
        (error) => console.log(error)
      )
  }));

  console.log('%c%s', 'background: cadetblue; padding: 8px;', JSON.stringify(result));

  // TODO всплывашки, что всё получилось

  // "2290188609"
  console.log('%c%s', 'background: cadetblue; padding: 8px;', JSON.stringify(selectedIngredients));
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

    selectedIngredients = [];
  }

  function renderMenu() {
    clearScreen();

    selectedRecipeType = null;

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
    ].forEach(({ type, color}) => {
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
    const recipeId = event.currentTarget.attributes.id.nodeValue;
    console.log('%c%s', 'background: cadetblue; padding: 8px;', recipeId);

    clearScreen();

    const recipe = RECIPES.find(recipe => recipe.id === +recipeId);
    const ingredientds = recipe.ingredients || [];

    if (!ingredientds.length) throw new Error('Рецепт не найден');

    const section = document.createElement('div');
    section.className = 'section';

    const recipeElement = document.createElement('div');
    recipeElement.className = 'recipe';

    section.appendChild(recipeElement);

    const titleContainer = document.createElement('div');
    // TODO разобраться со вложенностью элементов
    titleContainer.className = 'recipe__title';
    titleContainer.innerText = recipe.title;

    ingredientds.forEach(ingredient => {
      const ingredientElement = document.createElement('span');
      const ingredientEntity = INGREDIENTS.find(value => value.id === ingredient.ingredientId)
      const ingredientName = ingredientEntity.name;
      ingredientElement.innerText = ingredientName;

      const ingredientContainerElement = document.createElement('div');
      ingredientContainerElement.className = 'recipe__ingredient';
      ingredientContainerElement.appendChild(ingredientElement);

      const amountElement = document.createElement('span');
      amountElement.className = 'recipe__amount';
      amountElement.innerText = ingredient.amountOf;

      const unitElement = document.createElement('span');
      unitElement.className = 'recipe__unit';
      const unitName = UNITS.find(value => value.id === ingredient.unitId).name;
      const processedUnitName = `${ingredient.index ? unitName[ingredient.index] : unitName}`
      unitElement.innerText = processedUnitName;

      const checkboxElement = document.createElement('input');
      checkboxElement.type = 'checkbox';
      const valueString =`${ingredientName} ${unitName !== 'по вкусу' ? `(${ingredient.amountOf} ${processedUnitName})` : ''}`;
      checkboxElement.id = valueString;
      checkboxElement.className = 'recipe__checkbox';

      if (!ingredientEntity.notDefaultSelect) {
        checkboxElement.checked = true;
        selectedIngredients.push(valueString);
      }

      checkboxElement.onclick = event => {
        const checkbox = event.currentTarget;
        const ingredient = checkbox.attributes.id.nodeValue;

        if (checkbox.checked) {
          selectedIngredients.push(ingredient);
        } else {
          selectedIngredients = selectedIngredients.filter(value => value !== ingredient);
        }
      }

      const amountUnitElement = document.createElement('div');
      amountUnitElement.className = 'recipe__amount-unit';
      amountUnitElement.appendChild(checkboxElement);

      if (ingredient.amountOf) {
        amountUnitElement.appendChild(amountElement);
      }

      // В переменную; возможно нужен список таких значений
      if (unitName !== 'по вкусу') {
        amountUnitElement.appendChild(unitElement);
      }

      const rowElement = document.createElement('div');
      rowElement.className = 'recipe__row';
      rowElement.appendChild(amountUnitElement);
      rowElement.appendChild(ingredientContainerElement);

      recipeElement.appendChild(rowElement);
    })

    const backButton = document.createElement('button');
    backButton.innerText = 'Назад';
    // TODO возвращаться в раздел, а не в меню
    backButton.onclick = () => renderSection({ currentTarget: { attributes: { type: { nodeValue: selectedRecipeType } } } });
    backButton.className = 'type-container type-container_caramel_dark';

    const toTodoistButton = document.createElement('button');
    toTodoistButton.innerText = 'В Todoist';
    toTodoistButton.onclick = toTodoist;
    toTodoistButton.className = 'to-todoist-button type-container type-container_caramel_light';

    pageContainer.appendChild(titleContainer);
    pageContainer.appendChild(section);
    section.appendChild(toTodoistButton);
    section.appendChild(backButton);
  }

  function renderSection(event) {
    clearScreen();

    const recipeType = event.currentTarget.attributes.type.nodeValue;

    selectedRecipeType = recipeType;

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
  // renderRecipeIngredientsList({ currentTarget: { attributes: { id: { nodeValue: 1 } } } })
}

// init();

async function menuInit() {
  await initTemplates();

  const menuContainer = document.querySelector('.menu');

  const pageTitle = document.createElement('span');
  pageTitle.className = "page__title";
  pageTitle.innerText = "Меню";

  const schedule = document.createElement('custom-schedule');
  console.log('%c%s', 'background: cadetblue; padding: 8px;', 'init');

  menuContainer.appendChild(pageTitle);
  menuContainer.appendChild(schedule);

  schedule.setAttribute('current-date', '20.01.24');
}

menuInit();

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
