async function addNewThing(data) {
    const getContainers = document.querySelector('#allthings');
    getContainers.insertAdjacentHTML('beforeend', data.html);
    //TODO create FORM without insertAdjacentHTML
    //TODO login
    //TODO filter things
}

async function addThing(opts) {
    try {
        const response = await fetch('/add', {
            method: 'post',
            body: opts
        });

        const data = await response.json();

        if (data.success) {
            addNewThing(data);
            removeThing();
            update()
        }
    } catch (e) {
        console.log(e);
    }
}

async function update() {
    const selectForm = document.getElementsByClassName('changeForm');
    for (const updateForm of selectForm) {

        updateForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            const allForms = updateForm.parentNode;
            const inputField = document.createElement('input');
            const inputFieldHidden = document.createElement('input');
            const creatForm = document.createElement('form');
            const createButton = document.createElement('input');
            const thingText = allForms.querySelector('span').textContent;
            const targetId = event.target.querySelector('.id').value;

            creatForm.method = 'post';
            creatForm.className = ('updateForm d-inline');

            creatForm.appendChild(inputField);
            inputField.className = 'form-control';
            inputField.value = thingText;
            inputField.type = 'text';
            inputField.name = 'thing';

            creatForm.appendChild(inputFieldHidden);
            inputFieldHidden.type = 'hidden';
            inputFieldHidden.value = targetId;
            inputFieldHidden.name = 'id';

            creatForm.appendChild(createButton);
            createButton.type = 'submit';
            createButton.value = 'Ok';
            createButton.className = 'btn-danger btn btn-sm mt-2';

            for (const form of allForms.querySelectorAll('form')) {
                form.style.display = 'none';
                form.classList.remove('d-inline');
                // form.style.visibility = 'hidden';
                // form.style.position = 'absolute';
            }

            allForms.appendChild(creatForm);

            const selectUpdateForm = document.querySelectorAll('.updateForm');
            for (let i = 0; i < selectUpdateForm.length; i++) {
                const getUpdateForm = selectUpdateForm[i];
                selectUpdateForm[i].addEventListener('submit', async function (event) {
                    event.preventDefault();

                    const formData = new FormData(getUpdateForm);
                    const formParams = new URLSearchParams(formData);

                    try {
                        const response = await fetch('/update', {
                            method: 'post',
                            body: formParams
                        });

                        const data = await response.json();

                        if (data.success) {
                            for (const form of allForms.querySelectorAll('form')) {
                                form.style.display = 'block';
                                form.classList.add('d-inline');
                            }

                            const selectInputValue = event.target.querySelector('input').value;
                            event.target.parentNode.querySelector('span').innerHTML = selectInputValue;
                            event.target.remove();
                        }

                    } catch (e) {
                        console.log(e);
                    }


                });
            }
        });
    }
}

async function removeThing() {
    const selectDeleteForm = document.getElementsByClassName('deleteForm');

    for (const form of selectDeleteForm) {
        form.addEventListener('submit', async function (event) {
            event.preventDefault();

            const entry = form.parentNode.parentNode;

            const formData = new FormData(form);
            const formBody = new URLSearchParams(formData);

            try {
                const response = await fetch('/delete', {
                    method: 'post',
                    body: formBody
                });

                const data = await response.json();

                if (data.success) {
                    entry.remove();
                }
            } catch (e) {
                console.log(e);
            }

        });
    }
}

async function addone() {

}

(function () {
    const getForm = document.getElementById('submitForm');

    getForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const formData = new FormData(getForm);
        const data = new URLSearchParams(formData);

        addThing(data);
    });

})();

removeThing();
update();
