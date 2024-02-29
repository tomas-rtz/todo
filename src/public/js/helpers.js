const deleteList = (btn) => {
	const listId = btn.parentNode.querySelector('[name=listId]').value;
	const csrf = btn.parentNode.querySelector('[name=_csrf]').value;

	const listElement = btn.closest('section');

	fetch('/todo/list/delete/' + listId, {
		method: 'DELETE',
		headers: {
			'csrf-token': csrf
		}
	}).then((res) => {
		return res.json();
	}).then(data => {
		listElement.parentNode.removeChild(listElement);
	});
};

const shareList = (btn) => {
	const nick = btn.parentNode.querySelector('[name=shareInput]').value;
	if(!nick ||  nick == '') return;
	const listId = btn.parentNode.querySelector('[name=listId]').value;
	const csrf = btn.parentNode.querySelector('[name=_csrf]').value;
	const url = `/todo/list/share?listId=${listId}&nick=${nick}`;

	// info panel
	const messageDiv = document.createElement('div');
	messageDiv.style.color = 'white';
	messageDiv.style.padding = '10px';
	messageDiv.style.marginTop = '10px';
	messageDiv.style.display = 'none';
	btn.parentNode.appendChild(messageDiv);


	fetch(url, {
		headers: {
			'csrf-token': csrf,
			'Content-Type': 'application/json',
		},
	}).then(response => {
		if (response.ok) {
			messageDiv.style.backgroundColor = 'green';
			messageDiv.textContent = 'Successfully shared!';
			messageDiv.style.display = 'block';

			setTimeout(() => {
				messageDiv.style.display = 'none';
			}, 5000);
		} else {
			messageDiv.style.backgroundColor = 'darkred';
			messageDiv.textContent = 'User not found!';
			messageDiv.style.display = 'block';
			setTimeout(() => {
				messageDiv.style.display = 'none';
			}, 5000);
		}
	})
		.catch(error => {
			console.error('Chyba počas fetch:', error);
		});
};

const deleteItem = (btn) => {
	const listId = btn.parentNode.querySelector('[name=listId]').value;
	const itemId = btn.parentNode.querySelector('[name=itemId]').value;
	const csrf = btn.parentNode.querySelector('[name=_csrf]').value;

	const itemElement = btn.closest('article');

	fetch('/todo/item/delete/' + listId + '/' + itemId, {
		method: 'DELETE',
		headers: {
			'csrf-token': csrf
		}
	})
		.then((res) => {
			return res.json();
		})
		.then(data => {
			itemElement.parentNode.removeChild(itemElement);
		});
};

async function handleAutocomplete(inp) {
	const csrf = inp.parentNode.querySelector('[name=_csrf]').value;
	const searchTerm = inp.value;

	const response = await fetch(`/user/search?q=${searchTerm}`, {
		headers: {
			'csrf-token': csrf
		}
	});
    
	const users = await response.json();
	const arr = users.map(user => user.nick);
	let a, b, i, val = inp.value;

	closeAllLists();
  
	if (!val) { return false;}

	currentFocus = -1;
  
	/*create a DIV element that will contain the items (values):*/
	a = document.createElement('DIV');
	a.setAttribute('id', inp.id + 'autocomplete-list');
	a.setAttribute('class', 'autocomplete-items');
	inp.parentNode.appendChild(a);
  
	for (i = 0; i < arr.length; i++) {
		/*check if the item starts with the same letters as the text field value:*/
		if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
			b = document.createElement('DIV');
			b.innerHTML = '<strong>' + arr[i].substr(0, val.length) + '</strong>';
			b.innerHTML += arr[i].substr(val.length);
			b.innerHTML += '<input type=\'hidden\' value=\'' + arr[i] + '\'>';
			b.addEventListener('click', function(e) {
				inp.value = this.getElementsByTagName('input')[0].value;
				closeAllLists();
			});
			a.appendChild(b);
		}
	}
  
	function closeAllLists(elmnt) {
		var x = document.getElementsByClassName('autocomplete-items');
		for (var i = 0; i < x.length; i++) {
			if (elmnt != x[i] && elmnt != inp) {
				x[i].parentNode.removeChild(x[i]);
			}
		} 
	}
}