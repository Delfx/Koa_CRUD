function update() {
    const selectForm = document.getElementsByClassName('changeForm');
    for (const changeForm of selectForm) {

        changeForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            const allForms = changeForm.parentNode;
            const createInput = document.createElement('input');
            const createSubmitButton = document.createElement('button');
            const createForm = document.createElement('form');
            const createHidden = document.createElement('input');
            const getId = allForms.getElementsByClassName('id');

            createHidden.name = 'id';
            createHidden.value = getId[0].defaultValue;
            createHidden.type = ('hidden');

            createForm.method = 'post';
            createForm.action = ('/update');
            createForm.className = 'update d-inline';

            createInput.setAttribute('type', ('text'));
            createInput.classList.add('form-control');
            createInput.value = allForms.querySelector('span').textContent;
            createInput.name = 'changeThing';

            createSubmitButton.innerText = 'Ok';
            createSubmitButton.className = 'btn-danger btn btn-sm mt-2';

            createForm.appendChild(createInput);
            createForm.appendChild(createSubmitButton);
            createForm.appendChild(createHidden);


            for (const form of allForms.querySelectorAll('form')) {
                form.style.display = 'none';
                form.classList.remove('d-inline');
            }

            allForms.appendChild(createForm);

            const selectUpdateForm = document.getElementsByClassName('update');
            for (const updateForm of selectUpdateForm) {
                updateForm.addEventListener('submit', async function (event) {
                    event.preventDefault();

                    const updateData = new URLSearchParams(new FormData(updateForm));

                    const response = await fetch('/thing/update', {
                        method: 'post',
                        body: updateData
                    });

                    const data = await response.json();
                    // const data = true;

                    if (data.success) {
                        for (const form of allForms.querySelectorAll('form')) {
                            form.style.display = 'block';
                            form.classList.add('d-inline');
                        }

                        const selectInputValue = event.target.querySelector('input').value;
                        event.target.parentNode.querySelector('span').innerHTML = selectInputValue;
                        event.target.remove();
                    }
                    //TODO integrate model after success false;
                })
            }
        })
    }
}

function removeThing() {
    const selectModalButton = document.getElementsByClassName('modalbutton');
    const deleteForm = document.querySelector('.deleteForm');
    const selectallthings = document.querySelector('#allthings');
    const creattext = document.createElement('h3');
    const hideModal = $('#exampleModal');

    creattext.innerHTML = 'No data in Database';

    deleteForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const formData = new FormData(deleteForm);
        const formBody = new URLSearchParams(formData);

        try {
            const response = await fetch('/thing/delete', {
                method: 'post',
                body: formBody
            });

            const data = await response.json();

            if (data.success) {
                const thingById = document.querySelector(`#allthings li[data-id="${formData.get('id')}"]`);
                thingById.remove();
                if (selectModalButton.length === 0) {
                    selectallthings.appendChild(creattext);
                }
                hideModal.modal('hide');
            }

        } catch (e) {
            console.log(e);
        }

    });

}


async function selectModal() {
    const selectModalButton = document.getElementsByClassName('modalbutton');
    const hiddenDeleteInput = document.querySelector('.hiddenDeleteInput');

    for (const modalButton of selectModalButton) {
        modalButton.addEventListener('click', function (event) {
            const thingId = event.target.dataset.id;
            hiddenDeleteInput.value = thingId;
        })
    }

}

update();
removeThing();
selectModal();