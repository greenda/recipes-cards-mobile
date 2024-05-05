function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import { TodoistApi } from "@doist/todoist-api-typescript";
export var MyLib = /*#__PURE__*/function () {
  function MyLib() {
    _classCallCheck(this, MyLib);
  }
  return _createClass(MyLib, null, [{
    key: "toTodoist",
    value: function toTodoist() {
      var api = new TodoistApi("0123456789abcdef0123456789");
      api.getProjects().then(function (projects) {
        return console.log(projects);
      })["catch"](function (error) {
        return console.log(error);
      });
    }
  }]);
}();

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