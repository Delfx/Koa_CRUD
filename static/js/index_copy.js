

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

async function removeThing() {
    const selectModalButton = document.getElementsByClassName('modalbutton');
    const selectallthings = document.querySelector('#allthings');
    const creattext = document.createElement('h3');
    creattext.innerHTML = 'No data in Database';

    for (const modalButton of selectModalButton) {
        modalButton.addEventListener('click', async function (event) {
            modalButton.classList.add('selectedModal');
            const getDeleteForm = event.target.parentNode.parentNode.getElementsByClassName('deleteForm');

            for (const form of getDeleteForm) {
                form.addEventListener('submit', async function (event) {
                    event.preventDefault();

                    const entry = form.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
                    const formData = new FormData(form);
                    const formBody = new URLSearchParams(formData);

                    try {
                        const response = await fetch('/thing/delete', {
                            method: 'post',
                            body: formBody
                        });

                        const data = await response.json();

                        if (data.success) {
                            entry.remove();
                            const deletemodalfade = document.querySelector('.modal-backdrop');
                            deletemodalfade.remove();
                            if (selectModalButton.length === 0) {
                                selectallthings.appendChild(creattext);
                            }

                        }
                    } catch (e) {
                        console.log(e);
                    }

                });
            }

        });
    }


}


update();
removeThing();