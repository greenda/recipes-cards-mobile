// TODO узнать про res.text, почему он ассинхронный
const fetchFile = file => fetch(file)
  .then((res) => res.text());

const initTemplates = async () => {
  //TODO в отдельную функцию все подгрузки шаблонов
  const selectWithSearchTemplate = await fetchFile('./src/app/components/select-with-search/template.html');
  const tabTemplate = await fetchFile('./src/app/components/custom-tab/template.html');

  // TODO сделать это через TS
  document.querySelector('.page').insertAdjacentHTML('beforebegin', selectWithSearchTemplate);
  document.querySelector('.page').insertAdjacentHTML('beforebegin', tabTemplate);
}

const getSelectOptions = (array, idField, labelField) => (
  JSON.stringify(array.map(({ [idField]: id, [labelField]: label }) => ({ id, label })))
);
