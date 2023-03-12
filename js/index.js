const formRef = document.querySelector("form");
const tableRef = document.querySelector("table");
const tbodyRef = document.querySelector("tbody");

const radioButtons = document.querySelectorAll('input[name="amount-type"]');
const downloadButton = document.getElementById('download-button');

const autosuggestInput = document.getElementById('autosuggest-input');
const autosuggestList = document.querySelector('.autosuggestion-list');

const species = [
	'Trairão',
	'Pintado',
	'Curimba',
	'Piau',
	'Pirarucu',
	'Pirarara',
	'Cachara',
	'Tucunaré',
	'Jundiá Albino',
	'Tilápia',
	'Catfish',
	'Tambacu',
	'Carpa Capim',
	'Lambari Prata',
	'Lambari Rosa',
	'Carpa Colorida',
	'Carpakoi',
	'Cascudo',
	'Cascudo Abacaxi'
].sort();

const currentDate = new Date().toLocaleDateString('pt-BR').replaceAll('/', '-');

const displayNames = (value) => {
  autosuggestInput.value = value;

  removeLiElements();
}

const removeLiElements = () => {
  const items = document.querySelectorAll(".list-items");

  items.forEach((item) => {
    item.remove();
  });
}

const clearDatasForm = () => {
	formRef.reset();
};

const clearDatasTable = () => {
	tableRef.remove();
};

const autosuggest = (specie) => {
	return species.filter((item) => {
		return item.toLowerCase().startsWith(specie.toLowerCase());
	})
};

const getSuggestionsList = ({ target }) => {
	const specieToSearch = target.value;
	removeLiElements();

	if (specieToSearch !== '') {
		const getSuggestionValues = autosuggest(specieToSearch);
		
		getSuggestionValues.map((value) => {
			let createListItem = document.createElement('li');

			createListItem.classList.add("list-items");
			createListItem.style.cursor = 'pointer';
			createListItem.setAttribute("onclick", `displayNames("${value}")`);

			createListItem.innerHTML = value;
			document.querySelector(".autosuggestion-list").appendChild(createListItem);
		});
	}
};

const getFormatedValue = (value) => {
	let selectedAmountType;
	
	for (const radioButton of radioButtons) {
		if (radioButton.checked) {
			selectedAmountType = radioButton.value;
		}
	}

	const formatAmountTypes = {
		Unitário: '(UN)',
		Cento: '(CT)',
		Milheiro: '(MIL)',
	};

	const formattedAmountType = formatAmountTypes[selectedAmountType] || '-';
	const valueToCurrence = value === '' ? '-' : Number(value).toLocaleString('pt-BR', {
		style: 'currency',
		currency: 'BRL',
	});

	return `${valueToCurrence} ${formattedAmountType}`
};

const getFormatedSizesValue = (size1, size2) => {
	return size1 === '' || size2 === '' ? '-' : `${size1} A ${size2} CM`;
};

const convertTableToImage = () =>  {
	const download = document.getElementById("result");
	const rows = tableRef.querySelectorAll('td[name="delete-btn-container"]');
	rows.forEach((row) => row.remove());

	html2canvas(tableRef).then(canvas => {
		download.href = canvas.toDataURL("image/png");
		download.download = `tabela-preços-${currentDate}.jpeg`
		download.click();
		clearDatasTable();
	});
}

const onSubmitForm = (event) => {
	event.preventDefault();
	if (document) {
		const valueInputRef = document.getElementById('value').value;
		const size1InputRef = document.getElementById('size1').value;
		const size2InputRef = document.getElementById('size2').value;

		const formatedValue = getFormatedValue(valueInputRef);
		const fotmatedSize = getFormatedSizesValue(size1InputRef, size2InputRef);

		tbodyRef.innerHTML += `
			<tr>
				<td>${autosuggestInput.value === '' ? '-' : autosuggestInput.value}</td>
				<td>${fotmatedSize}</td>
				<td>${formatedValue}</td>
				<td name="delete-btn-container"><button class="delete-btn"><img src="./assets/delete-icon.svg" width="20px" height="20px" /></button></td>
			</tr>
		`;
	}

	clearDatasForm();
};

const onDeleteRow = (event) => {
	const btn = event.target;
	btn.closest("tr").remove();
};

downloadButton.addEventListener("click", convertTableToImage);
formRef.addEventListener("submit", onSubmitForm);
tableRef.addEventListener("click", onDeleteRow);
autosuggestInput.addEventListener('keyup', getSuggestionsList)