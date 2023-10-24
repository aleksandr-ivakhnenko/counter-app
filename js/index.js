'use strict';

// Получение DOM-элементов значений приложения (пройденной дистанции и прогресса)
const distanceValueNode = document.getElementById('distance-traveled-value');
const progressValueNode = document.getElementById('distance-progress-value');

// Получение DOM-элемента кольцевой диаграммы прогресса
const progressCircleChartNode = document.getElementById('chart-progress');

// Получение DOM элементов секций
const targetControlsSectionNode = document.getElementById('target-controls-section');
const distanceControlsSectionNode = document.getElementById('distance-controls-section');

//
const targetValueInputNode = document.getElementById('target-value-input');
const acceptTargetButtonNode = document.getElementById('accept-target-button');
const addDistanceButtonsNode = document.querySelectorAll('[data-find="add-distance-button"]');
const resetButtonNode = document.getElementById('reset-button');

//
const alertTextNode = document.getElementById('alert-text');


//
const COUNTER_CLASSLIST = {
	DISTANCE_CONTROL_SECTION_ACTIVE: 'counter-control__target_active',
	TARGET_CONTROL_SECTION_ACTIVE: 'counter-control__buttons_active',
};

const COUNTER_INITIAL_VALUE = {
	DISTANCE_VALUE: 0,
	PROGRESS_VALUE: 0,
};

const ALERT_INITIAL_TEXTS = {
	NOT_NUMBER_ENTERED: 'Пожалуйста введите число.',
	ZERO_NUMBER_ENTERED: 'Пожалуйста введите число большее, чем 0.',
	MORE_NUMBER_ENTERED: 'Пожалуйста введите число не большее, чем 99.',
};


// Данные приложения и их инициализация
const counterData = {
	distanceValue: COUNTER_INITIAL_VALUE.DISTANCE_VALUE,

	targetValue: function () {
		this.targetValueFromUser = parseInt(targetValueInputNode.value);
		return this.targetValueFromUser;
	},

	progressValue: function () {
		this.progressValueResult = Math.round(this.distanceValue * 100 / this.targetValue());

		if (isNaN(this.progressValueResult)) {
			this.progressValueResult = COUNTER_INITIAL_VALUE.PROGRESS_VALUE;
			return this.progressValueResult;
		};

		return this.progressValueResult;
	},
};

// Расчет прогресса круговой диаграммы
function getDataForProgressCircleChart() {
	const radiusCircle = progressCircleChartNode.r.baseVal.value;
	const circumferenceCircle = 2 * Math.PI * radiusCircle;

	const strokeDasharrayValue = circumferenceCircle;
	const strokeDashoffsetValue = circumferenceCircle - (counterData.progressValue() / 100 * circumferenceCircle);

	return {
		strokeDasharrayValue,
		strokeDashoffsetValue,
	};
};


// Инициализация приложения
function initApp() {
	renderCounterData();
	renderProgressCircleChart();
};

initApp();


//
function addDistanceTraveledValue(addDistanceButtonNode) {
	const addDistanceButtonNodeValue = parseInt(addDistanceButtonNode.dataset.value);

	if ((counterData.distanceValue + addDistanceButtonNodeValue) > counterData.targetValue()) {
		counterData.distanceValue = counterData.targetValue();
		return;
	};

	counterData.distanceValue += addDistanceButtonNodeValue;
};

function resetDistanceTraveledValue() {
	counterData.distanceValue = COUNTER_INITIAL_VALUE.DISTANCE_VALUE;
};


//
function renderCounterData() {
	distanceValueNode.textContent = counterData.distanceValue;
	progressValueNode.innerHTML = `<br/>${counterData.progressValue()}%`;
};

function renderProgressCircleChart() {
	const progressChartProgressData = getDataForProgressCircleChart();

	progressCircleChartNode.style.strokeDasharray = progressChartProgressData.strokeDasharrayValue;
	progressCircleChartNode.style.strokeDashoffset = progressChartProgressData.strokeDashoffsetValue;
};

function renderToggleTab() {
	targetControlsSectionNode.classList.toggle(COUNTER_CLASSLIST.DISTANCE_CONTROL_SECTION_ACTIVE);
	distanceControlsSectionNode.classList.toggle(COUNTER_CLASSLIST.TARGET_CONTROL_SECTION_ACTIVE);
};

function renderAlertText(alertText) {
	alertTextNode.textContent = alertText;
};

function renderResetTargetValueInput() {
	targetValueInputNode.value = '';
};


//
targetValueInputNode.addEventListener('input', () => {
	const targetValueFromUser = validationTargetValue(counterData.targetValue());
	let alertText = '';

	if (typeof targetValueFromUser !== 'number') {
		alertText = targetValueFromUser;
		renderAlertText(alertText);
		renderResetTargetValueInput();
		acceptTargetButtonNode.disabled = true;
		return;
	};

	renderAlertText(alertText);
	acceptTargetButtonNode.disabled = false;
});

//
acceptTargetButtonNode.addEventListener('click', () => {
	renderToggleTab();
});

// 
function validationTargetValue(targetValueInput) {
	if (isNaN(targetValueInput)) {
		return ALERT_INITIAL_TEXTS.NOT_NUMBER_ENTERED;
	};

	if (targetValueInput === 0) {
		return ALERT_INITIAL_TEXTS.ZERO_NUMBER_ENTERED;
	};

	if (targetValueInput > 99) {
		return ALERT_INITIAL_TEXTS.MORE_NUMBER_ENTERED;
	};

	return targetValueInput;
};


addDistanceButtonsNode.forEach(addDistanceButtonNode => {
	addDistanceButtonNode.addEventListener('click', () => {
		addDistanceTraveledValue(addDistanceButtonNode);
		renderCounterData();
		renderProgressCircleChart();
	});
});

resetButtonNode.addEventListener('click', () => {
	resetDistanceTraveledValue();
	renderCounterData();
	renderProgressCircleChart();
	renderToggleTab();
});