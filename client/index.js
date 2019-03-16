const card = post => {
	return `
    <div class="card z-depth-3">
        <div class="card-content">
            <span class="card-title">${post.title}</span>
            <p style="white-space: pre-line;">${post.text}</p>
            <small>${new Date(post.date).toLocaleDateString()}</small>
        </div>
        <div class="card-action">
            <button class="btn btn-small red js-remove" data-id="${post._id}">
                <i class="material-icons">delete</i>
            </button>
        </div>
    </div>`;
};

let posts = [];
let modal;
const BASE_URL = '/api/post';

class PostApi {
	static fetch() {
		return fetch(BASE_URL, { method: 'get' }).then(res => res.json());
	}

	static create(post) {
		return fetch(BASE_URL, {
			method: 'post',
			body: JSON.stringify(post),
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		}).then(res => res.json());
	}

	static remove(id) {
		return fetch(`${BASE_URL}/${id}`, {
			method: 'delete',
		}).then(res => res.json());
	}
}

document.addEventListener('DOMContentLoaded', () => {
	PostApi.fetch().then(backendPosts => {
		posts = backendPosts.concat();
		renderPosts(posts);
	});
	modal = M.Modal.init(document.querySelector('.modal'));
	setTimeout(() => {
		document.querySelector('.btn-floating').classList.add('scale-in');
	}, 700);
	document.querySelector('#createPost').addEventListener('click', onCreatePost);
	document.querySelector('#posts').addEventListener('click', onDeletePost);
});

function renderPosts(_posts = []) {
	const $posts = document.querySelector('#posts');

	if (_posts.length > 0) {
		$posts.innerHTML = _posts.map(post => card(post)).join(' ');
	} else {
		$posts.innerHTML = `<div class="center">Постов пока нет</div>`;
	}
}

function onCreatePost() {
	const $title = document.querySelector('#title');
	const $text = document.querySelector('#text');

	if ($title.value && $text.value) {
		const newPost = {
			title: $title.value,
			text: $text.value,
		};

		PostApi.create(newPost).then(post => {
			posts.unshift(post);
			renderPosts(posts);
		});

		modal.close();

		$title.value = '';
		$title.text = '';

		M.updateTextFields();
	}
}

function onDeletePost(e) {
	if (
		e.target.classList.contains('js-remove') ||
		e.target.parentNode.classList.contains('js-remove')
	) {
		const decisison = confirm('Вы уверены, что хотите удалить пост?');

		if (decisison) {
			const id =
				e.target.getAttribute('data-id') ||
				e.target.parentNode.getAttribute('data-id');

			PostApi.remove(id).then(() => {
				const postIndex = posts.findIndex(post => post._id === id);
				console.log(postIndex);
				posts.splice(postIndex, 1);
				renderPosts(posts);
			});
		}
	}
}
