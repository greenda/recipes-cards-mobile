import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import weekday from 'dayjs/plugin/weekday';
import { schedule as scheduleMock } from '../../mock/schedule.js';
import { CustomElement } from '../../utils/custom-element';
import { getWeekDay } from '../../utils';

dayjs.extend(customParseFormat);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(weekday)

const DATE_FORMAT = { FULL: 'DD.MM.YY', DEFAULT: 'DD-MM-YY' };

class Schedule extends HTMLElement {
  firstDate: typeof dayjs;
  secondDate: typeof dayjs;
  thirdDate: typeof dayjs;

  schedule: CustomElement;
  scheduleContainer: CustomElement;

  constructor() {
    super();

    const schedule = new CustomElement('div', 'schedule');

    this.schedule = schedule;

    const template = document.getElementById("custom-schedule");
    const templateContent = template.cloneNode(true).content;
    templateContent.appendChild(schedule.getElement());

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(templateContent);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'current-date' && newValue) {
      this.firstDate = dayjs(newValue, DATE_FORMAT.FULL);
      this.secondDate = this.firstDate.clone().add(1, 'day');
      this.thirdDate = this.firstDate.clone().add(2, 'day');

      this.renderSchedule();
    }
  }

  static get observedAttributes() { return ['current-date']; }

  addMealElements = (meal, title, scheduleContainer) => {
    // TODO переименовать элементы
    // const breakfastBackground = document.createElement('div');
    // breakfastBackground.className = `background ${meal}-background`;
    // breakfastBackground.id = meal;

    const mealBackground = new CustomElement('div', `background ${meal}-background`, {
      id: meal,
    });

    const breakfastTitle = document.createElement('span');
    breakfastTitle.innerText = title;

    const breakfastTitleContainer = document.createElement('div');
    breakfastTitleContainer.className = "background-title";

    breakfastTitleContainer.appendChild(breakfastTitle);

    mealBackground.appendChild(breakfastTitleContainer);
    scheduleContainer.appendChild(mealBackground);

    const firstDiv = document.createElement('div');
    firstDiv.className = 'day-div first-div';
    firstDiv.id = `date-${this.firstDate.format(DATE_FORMAT.DEFAULT)}`;

    const secondDiv = document.createElement('div');
    secondDiv.className = 'day-div second-div';
    secondDiv.id = `date-${this.firstDate.add(1, 'day').format(DATE_FORMAT.DEFAULT)}`;
    const thirdDiv = document.createElement('div');
    thirdDiv.className = 'day-div third-div';
    thirdDiv.id = `date-${this.firstDate.add(2, 'day').format(DATE_FORMAT.DEFAULT)}`;

    mealBackground.appendChildren([firstDiv, secondDiv, thirdDiv]);
  }

  renderSchedule() {
    const tabsContainer = this.renderTabs();

    const scheduleContainer = new CustomElement('div', 'schedule-container');

    this.scheduleContainer = scheduleContainer;

    this.addMealElements('breakfast', 'завтрак', scheduleContainer);
    this.addMealElements('lanch', 'обед', scheduleContainer);
    this.addMealElements('diner', 'ужин', scheduleContainer);
    this.addMealElements('prepare', 'приготовить', scheduleContainer);
    this.addMealElements('buy', 'купить', scheduleContainer);

    this.renderChangeDaysArrows();

    this.renderDayLines();

    this.schedule.appendChildren([tabsContainer, scheduleContainer]);
  }

  renderTabs() {
    const firstTab = new CustomElement('custom-tab');
    const secondTab = new CustomElement('custom-tab');
    const thirdTab = new CustomElement('custom-tab');

    const tabsContainer = new CustomElement('div', 'tabs-container');

    tabsContainer.appendChildren([
      firstTab,
      secondTab,
      thirdTab,
    ]);

    firstTab.setAttributes({
      'day': getWeekDay(this.firstDate.day()),
      'date': this.firstDate.format(DATE_FORMAT.FULL),
    });
    secondTab.setAttributes({
      'day': getWeekDay(this.secondDate.day()),
      'date': this.secondDate.format(DATE_FORMAT.FULL),
    });
    thirdTab.setAttributes({
      'day': getWeekDay(this.thirdDate.day()),
      'date': this.thirdDate.format(DATE_FORMAT.FULL),
    });

    return tabsContainer;
  }

  renderChangeDaysArrows() {
    const leftArrowButton = new CustomElement('div', 'arrow-button arrow-button_left');

    const rightArrowButton = new CustomElement('div', 'arrow-button arrow-button_right');

    leftArrowButton.getElement().addEventListener('click', this.onChangeDays);
    rightArrowButton.getElement().addEventListener('click', this.onChangeDays);

    this.scheduleContainer.appendChildren([leftArrowButton, rightArrowButton]);

    leftArrowButton.setAttribute('type', 'left');
    rightArrowButton.setAttribute('type', 'right');
  }

  renderDayLines() {
    const lineWithoutArrowElement = new CustomElement('div', 'day-line');

    const lineWithLeftArrowElement = lineWithoutArrowElement.cloneNode();

    const dayArrow = new CustomElement('div', 'day-arrow');

    const leftArrow = dayArrow.cloneNode();
    const rightArrow = dayArrow.cloneNode();

    lineWithLeftArrowElement.appendChild(leftArrow);

    const lineWithRightArrowElement = lineWithoutArrowElement.cloneNode();
    lineWithRightArrowElement.appendChild(rightArrow);

    const lineWithBothArrowElement = lineWithoutArrowElement.cloneNode();
    lineWithBothArrowElement.appendChildren([leftArrow, rightArrow]);

    const textLineElement = new CustomElement('span', 'day-line__text__text');
    const dayLineTextContainer = new CustomElement('div', 'day-line__text');
    dayLineTextContainer.appendChild(textLineElement);

    const processedSchedule = this.processSchedule(scheduleMock);

    Object.keys(processedSchedule).forEach(id => {
      const { dateFrom, dateTo, left, right, withoutArrows, meal, type, description } = processedSchedule[id];

      const text = dayLineTextContainer.cloneNode();
      text.querySelector('span').innerText = description;

      const getTypeOffset = type => {
        switch(type) {
          case 'garnish': return 'top: 40px;';

          case 'salad': return 'top: 80px;';

          default: return 'top: 0px;';
        }
      }

      const mealContainer = this.scheduleContainer.querySelector(`#${meal}`);
      const typeOffset = getTypeOffset(type);

      // TODO рассмотреть ситуации, когда несколько на одной, в том числе они перекрываются
      if (withoutArrows) {
        text.setStyle(`width: 300px; left: 32px; ${typeOffset}`);
        mealContainer.appendChild(text.getElement());

        return;
      }

      if (left && right) {
        const leftOffset = dateFrom.isSame(this.secondDate) ? 'left: 132px;' : dateFrom.isSame(this.thirdDate) ? 'left: 232px;' : 'left: 32px;';
        const widthLeftOffset = dateFrom.isSame(this.secondDate) ? 1 : dateFrom.isSame(this.thirdDate) ? 2 : 0;
        const width = 3 - widthLeftOffset;
        text.setStyle(`width: ${width * 100}px; ${leftOffset} ${typeOffset}`);

        const leftArrow = dayArrow.cloneNode();
        leftArrow.setStyle('left: 0px');
        rightArrow.setStyle('right: 0px');
        text.appendChild(leftArrow);
        text.appendChild(rightArrow);

        mealContainer.appendChild(text.getElement());

        return;
      }

      if (left) {
        const leftOffset = dateFrom.isSame(this.secondDate) ? 'left: 132px;' : dateFrom.isSame(this.thirdDate) ? 'left: 232px;' : 'left: 32px;';
        const widthLeftOffset = dateFrom.isSame(this.secondDate) ? 1 : dateFrom.isSame(this.thirdDate) ? 2 : 0;
        const width = 3 - widthLeftOffset;
        text.setStyle(`width: ${width * 100}px; ${leftOffset} ${typeOffset}`);

        const leftArrow = dayArrow.cloneNode();
        leftArrow.setStyle('left: 0px');
        // TODO передавать id
        // leftArrow.id = '';
        text.appendChild(leftArrow);
        mealContainer.appendChild(text.getElement());

        return;
      }

      if (right) {
        const widthRightOffset = dateTo.isSame(this.secondDate) ? 1 : dateTo.isSame(this.firstDate) ? 2 : 0;
        const width = 3 - widthRightOffset;
        const rightArrow = dayArrow.cloneNode();
        rightArrow.setStyle('right: 0px');
        text.setStyle(`width: ${width * 100}px; left: 32px; ${typeOffset}`);
        text.appendChild(rightArrow);
        mealContainer.appendChild(text.getElement());

        return;
      }
    });
  }

  processSchedule(schedule) {
    return schedule.reduce((acc, { id, from, to, ...rest }) => {
      const dateFrom = dayjs(from, DATE_FORMAT.FULL);
      const dateTo = dayjs(to, DATE_FORMAT.FULL);

      switch(true) {
        case dateFrom.isSameOrAfter(this.firstDate) && dateTo.isSameOrBefore(this.thirdDate):
          return { ...acc, [id]: { left: 'true', right: true, dateFrom, dateTo, ...rest } };

        case dateFrom.isSameOrBefore(this.firstDate)
          && dateTo.isSameOrAfter(this.firstDate)
          && dateTo.isSameOrBefore(this.thirdDate):
          return { ...acc, [id]: { right: true, dateFrom, dateTo, ...rest } };

        case dateFrom.isSameOrAfter(this.firstDate)
          && dateFrom.isSameOrBefore(this.thirdDate)
          && dateTo.isSameOrAfter(this.thirdDate):
          return { ...acc, [id]: { left: true, dateFrom, dateTo, ...rest } };

        case dateFrom.isBefore(this.firstDate) && dateTo.isAfter(this.thirdDate):
          return { ...acc, [id]: { withoutArrows: true, dateFrom, dateTo, ...rest } };

        default:
          return { ...acc };
      }
    }, {});
  }

  onChangeDays = (event: PointerEvent) => {
    const type = event.currentTarget.attributes.type.nodeValue;

    if (type === 'left') {
      this.updateSchedule(this.firstDate.subtract(1, 'day'));
    } else {
      this.updateSchedule(this.firstDate.add(1, 'day'));
    }
  }

  updateSchedule(newCurrentDate) {
    this.clear();

    this.firstDate = dayjs(newCurrentDate, DATE_FORMAT.FULL);
    this.secondDate = this.firstDate.clone().add(1, 'day');
    this.thirdDate = this.firstDate.clone().add(2, 'day');

    this.renderSchedule();
  }

  clear() {
    this.schedule.getElement().innerHTML = '';
  }
}

customElements.define("custom-schedule", Schedule);

