const params = new URLSearchParams(window.location.search);
const id = params.get('id');

const API =
	'https://script.google.com/macros/s/AKfycbyqn4RMOn4K94DLqKHlgsfiM6ufOi8EiSgU3alDVEn92kseHDqrQ8KU5FPkfHumrB5jVQ';

if (id) {
	fetchDishData(id);
} else {
	showError('ID блюда не передан в URL');
}

function showError(message) {
	document.getElementById('loader').textContent = message;
}

async function fetchDishData(id) {
	try {
		const response = await fetch(`${API}/exec?id=${id}`);
		const data = await response.json();

		console.log(data);

		if (data.result === 'error') {
			showError('Блюдо не найдено');
		} else {
			renderDish(data);
		}
	} catch (error) {
		showError('Ошибка загрузки данных');
		setTimeout(() => {
			document.getElementById('loader')?.remove();
		}, 2000);
	}
}

const baseUrl = window.location.origin + window.location.pathname;

function renderDish(data) {
	const dish = data.data;
	document.getElementById('loader')?.remove();

	const productSection = document.querySelector('.product');
	const recommendationsSection = document.querySelector('.recommendations__list');

	productSection.querySelector('img').src = dish.url;
	productSection.querySelector('img').alt = dish.name;
	productSection.querySelector('.product__title').textContent = dish.name;
	productSection.querySelector('.product__description').textContent = dish.description;

	const nutrientValues = productSection.querySelectorAll('.nutrient__value');
	console.log(nutrientValues);
	nutrientValues[0].textContent = dish.carb;
	nutrientValues[1].textContent = dish.fat;
	nutrientValues[2].textContent = dish.protein;
	nutrientValues[3].textContent = dish.cals;

	productSection.querySelector('.product__price').textContent = `${dish.price}₽`;

	recommendationsSection.innerHTML = '';
	dish.recommended.forEach((rec) => {
		recommendationsSection.innerHTML += `
      <a href="${baseUrl}?id=${rec.id}">
        <div class="recommendations__item">
          <img src="${rec.url}" alt="${rec.name}" class="recommendations__item-image" />
          <h3 class="recommendations__item-title">${rec.name}</h3>
          <div class="recommendations__item-price">${rec.price}₽</div>
        </div>
      </a>`;
	});
}
