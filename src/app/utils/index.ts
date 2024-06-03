import * as selectWithSearchTemplate from '../../app/components/select-with-search/template.html';
import * as tabTemplate from '../../app/components/custom-tab/template.html';
import * as scheduleTemplate from '../../app/components/schedule/template.html';

// TODO узнать про res.text, почему он ассинхронный
const fetchFile = file => fetch(file)
  .then((res) => res.text());

export const initTemplates = async () => {
  //TODO в отдельную функцию все подгрузки шаблонов

  // TODO сделать это через TS
  document.querySelector('.page').insertAdjacentHTML('beforebegin', selectWithSearchTemplate.default);
  document.querySelector('.page').insertAdjacentHTML('beforebegin', tabTemplate.default);
  document.querySelector('.page').insertAdjacentHTML('beforebegin', scheduleTemplate.default);
}

const getSelectOptions = (array, idField, labelField) => (
  JSON.stringify(array.map(({ [idField]: id, [labelField]: label }) => ({ id, label })))
);

export const getWeekDay = index => {
  return ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', ][index];
}
