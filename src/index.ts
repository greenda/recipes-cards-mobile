import { TodoistApi } from "@doist/todoist-api-typescript"

function toTodoist() {
  const api = new TodoistApi("b6d07921bc749d4f50040963cd1bc13a51fd33e2")

  api.getProjects()
      .then((projects) => console.log(projects))
      .catch((error) => console.log(error))
}

function init() {
  const button = document.createElement('button');
  button.onclick = toTodoist;
  button.textContent = 'Script';

  document.querySelector('body').appendChild(button);
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
